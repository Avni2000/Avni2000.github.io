#!/bin/bash

# Quick deployment script for avni-badiwale.xyz
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying to avni-badiwale.xyz..."

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "Please run this script as a regular user with sudo privileges, not as root"
   exit 1
fi

# Prompt for required info
read -p "Enter your email for SSL certificates: " EMAIL
read -s -p "Enter a secure database password: " DB_PASSWORD
echo

# Install dependencies
echo "📦 Installing dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx postgresql postgresql-contrib python3 python3-pip python3-venv nodejs npm git certbot python3-certbot-nginx

# Setup directories
echo "📁 Setting up directories..."
sudo mkdir -p /var/www/avni-badiwale.xyz
sudo chown $USER:$USER /var/www/avni-badiwale.xyz

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/avni-badiwale.xyz
if [ ! -d ".git" ]; then
    git clone https://github.com/Avni2000/Avni2000.github.io.git .
fi

# Database setup
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE USER avni WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE avnime_prod OWNER avni;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avnime_prod TO avni;"

# Backend setup
echo "⚙️ Setting up backend..."
cd /var/www/avni-badiwale.xyz/backend
echo "DATABASE_URL=postgresql://avni:$DB_PASSWORD@localhost:5432/avnime_prod" > .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn
python init_postgres.py

# Frontend setup
echo "🎨 Setting up frontend..."
cd /var/www/avni-badiwale.xyz/avni.me
npm install
npm run build

# Create systemd services
echo "🔧 Creating services..."
sudo tee /etc/systemd/system/avni-backend.service > /dev/null <<EOF
[Unit]
Description=Avni Blog Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/avni-badiwale.xyz/backend
Environment=PATH=/var/www/avni-badiwale.xyz/backend/venv/bin
ExecStart=/var/www/avni-badiwale.xyz/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/avni-frontend.service > /dev/null <<EOF
[Unit]
Description=Avni Blog Frontend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/avni-badiwale.xyz/avni.me
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Nginx configuration
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/avni-badiwale.xyz > /dev/null <<'EOF'
server {
    listen 80;
    server_name avni-badiwale.xyz www.avni-badiwale.xyz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Start services
echo "🚀 Starting services..."
sudo chown -R www-data:www-data /var/www/avni-badiwale.xyz
sudo systemctl daemon-reload
sudo systemctl enable avni-backend avni-frontend
sudo systemctl start avni-backend avni-frontend

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/avni-badiwale.xyz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL certificate
echo "🔒 Setting up SSL..."
sudo certbot --nginx -d avni-badiwale.xyz -d www.avni-badiwale.xyz --non-interactive --agree-tos -m $EMAIL

echo "✅ Deployment complete!"
echo "🌍 Your site is live at: https://avni-badiwale.xyz"
echo ""
echo "Management commands:"
echo "  Status: sudo systemctl status avni-backend avni-frontend"
echo "  Logs:   sudo journalctl -u avni-backend -f"
echo "  Update: cd /var/www/avni-badiwale.xyz && git pull && sudo systemctl restart avni-backend avni-frontend" 
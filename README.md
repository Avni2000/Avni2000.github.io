# Quickstart Guide
Convenience command: curl -sSL https://raw.githubusercontent.com/Avni2000/Avni2000.github.io/main/deploy.sh | bash
Or git clone and run ./deploy.sh 
```bash
# 1. Start PostgreSQL database
cd backend && docker-compose -f docker-compose.dev.yml up -d

# 2. Set up backend
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
python init_postgres.py

# 3. Start backend (keep this terminal open)
python app.py &

# 4. Start frontend (in new terminal)
cd ../avni.me && npm install && npm run dev
```

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/posts
- **Database**: PostgreSQL running on localhost:5432

## Stop Everything

```bash
# Stop backend
pkill -f "python app.py"

# Stop PostgreSQL
cd backend && docker-compose -f docker-compose.dev.yml down
```

## Production Note

For production deployment, replace step 3 with:
```bash
cd backend && source venv/bin/activate
gunicorn --bind 0.0.0.0:5000 app:app
```

And for the frontend:
```bash
cd avni.me && npm run build && npm start
``` 


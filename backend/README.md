# Blog Backend

This is the Flask backend for the blog website. It uses SQLite3 for data storage.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
# On Linux/macOS:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python init_db.py
```

5. Run the development server:
```bash
python app.py
```

The server will start on http://localhost:5000.

## API Endpoints

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/<slug>` - Get a specific blog post by slug
- `POST /api/posts` - Create a new blog post
- `PUT /api/posts/<id>` - Update a blog post
- `DELETE /api/posts/<id>` - Delete a blog post

### Home Page

- `GET /api/home` - Get the home page content
- `POST /api/home` - Update the home page content

## Database Schema

### Blog Posts

- `id` (Integer, Primary Key)
- `title` (String)
- `content` (Text)
- `slug` (String, Unique)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Home Page

- `id` (Integer, Primary Key)
- `title` (String)
- `content` (Text)
- `updated_at` (DateTime) 
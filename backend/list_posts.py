from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import BlogPost

# Connect to the database
engine = create_engine('sqlite:///avnime.db')
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Get all posts
    posts = session.query(BlogPost).all()
    
    print(f"Found {len(posts)} posts in the database:")
    for post in posts:
        print(f"ID: {post.id}, Title: {post.title}, Slug: {post.slug}")
    
except Exception as e:
    print(f"Error: {str(e)}")
finally:
    session.close() 
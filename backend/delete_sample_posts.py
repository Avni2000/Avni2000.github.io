from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app import BlogPost

# Connect to the database
engine = create_engine('sqlite:///avnime.db')
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Find and delete posts matching "Welcome to My Blog" and "Getting Started with Flask" case-insensitively
    sample_posts = session.query(BlogPost).filter(
        func.lower(BlogPost.title).in_([
            "welcome to my blog",
            "getting started with flask"
        ])
    ).all()
    
    if sample_posts:
        print(f"Found {len(sample_posts)} sample posts to delete:")
        for post in sample_posts:
            print(f"- ID: {post.id}, Title: {post.title}, Slug: {post.slug}")
            session.delete(post)
        
        session.commit()
        print("Sample posts deleted successfully!")
    else:
        print("No sample posts found with the specified titles.")
    
except Exception as e:
    session.rollback()
    print(f"Error: {str(e)}")
finally:
    session.close() 
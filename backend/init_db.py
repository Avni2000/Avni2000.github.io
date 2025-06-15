from app import Base, engine, Session, BlogPost, HomePage
from datetime import datetime

def init_db():
    # Drop all tables
    Base.metadata.drop_all(engine)
    
    # Create tables
    Base.metadata.create_all(engine)
    
    session = Session()
    
    # Create sample blog posts
    posts = [
    ]
    
    # Create home page
    home = HomePage(
        title="Welcome to My Website",
        content="""# Welcome to My Website

I'm a software developer passionate about creating interesting things.

## About Me

I love working with:
- Python
- JavaScript
- Web Development
- Machine Learning

Feel free to explore my blog and projects!""",
        updated_at=datetime.utcnow()
    )
    
    try:
        # Add posts
        for post in posts:
            session.add(post)
        
        # Add home page
        session.add(home)
        
        # Commit changes
        session.commit()
        print("Database initialized successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error initializing database: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    init_db() 
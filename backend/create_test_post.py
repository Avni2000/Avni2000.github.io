from app import Session, BlogPost
from datetime import datetime

def create_test_post():
    session = Session()
    
    # Create a test post
    test_post = BlogPost(
        title="Test Post",
        content="This is a test post to verify database functionality.",
        slug="test-post",
        published=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    try:
        # Add and commit the post
        session.add(test_post)
        session.commit()
        print("Test post created successfully!")
        print(f"ID: {test_post.id}, Title: {test_post.title}, Slug: {test_post.slug}, Published: {test_post.published}")
    except Exception as e:
        session.rollback()
        print(f"Error creating test post: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    create_test_post() 
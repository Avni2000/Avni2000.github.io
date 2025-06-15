import sqlite3
import os

def migrate_database():
    """Add the published column to blog_posts table"""
    try:
        conn = sqlite3.connect('avnime.db')
        cursor = conn.cursor()
        
        # Check if published column exists
        cursor.execute("PRAGMA table_info(blog_posts)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'published' not in columns:
            # Add the published column with default value of False (0 in SQLite)
            cursor.execute("ALTER TABLE blog_posts ADD COLUMN published BOOLEAN DEFAULT 0")
            conn.commit()
            print("Migration successful: Added 'published' column to blog_posts table")
        else:
            print("Column 'published' already exists in blog_posts table")
            
    except Exception as e:
        print(f"Migration failed: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database() 
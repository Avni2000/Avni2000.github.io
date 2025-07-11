#!/usr/bin/env python3
"""
PostgreSQL Database Initialization Script
Run this script to create the database and tables for the blog application.
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from app import Base

load_dotenv()

def create_database():
    """Create the database if it doesn't exist."""
    database_url = os.getenv('DATABASE_URL', 
        'postgresql://username:password@localhost:5432/avnime_db')
    
    # Extract database name and connection details
    url_parts = database_url.split('/')
    db_name = url_parts[-1]
    base_url = '/'.join(url_parts[:-1]) + '/postgres'
    
    print(f"Creating database: {db_name}")
    
    try:
        # Connect to postgres database to create our target database
        engine = create_engine(base_url)
        with engine.connect() as conn:
            # Close any existing connections to the target database
            conn.execute(text(f"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{db_name}' AND pid <> pg_backend_pid()"))
            conn.commit()
            
            # Create database if it doesn't exist
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"))
            if not result.fetchone():
                conn.execute(text(f"CREATE DATABASE {db_name}"))
                conn.commit()
                print(f"Database '{db_name}' created successfully!")
            else:
                print(f"Database '{db_name}' already exists.")
    
    except Exception as e:
        print(f"Error creating database: {e}")
        return False
    
    return True

def create_tables():
    """Create the application tables."""
    database_url = os.getenv('DATABASE_URL')
    
    try:
        engine = create_engine(database_url)
        Base.metadata.create_all(engine)
        print("Tables created successfully!")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def main():
    """Main initialization function."""
    print("Initializing PostgreSQL database for Avni.me blog...")
    
    if not create_database():
        sys.exit(1)
    
    if not create_tables():
        sys.exit(1)
    
    print("Database initialization completed successfully!")

if __name__ == "__main__":
    main() 
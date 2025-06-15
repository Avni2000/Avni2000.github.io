from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database setup
Base = declarative_base()
engine = create_engine('sqlite:///avnime.db')
Session = sessionmaker(bind=engine)

# Models
class BlogPost(Base):
    __tablename__ = 'blog_posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class HomePage(Base):
    __tablename__ = 'home_page'
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Only create tables if they don't exist (don't drop anything)
if not os.path.exists('avnime.db') or os.path.getsize('avnime.db') == 0:
    Base.metadata.create_all(engine)

# Routes
@app.route('/api/posts', methods=['GET'])
def get_posts():
    session = Session()
    posts = session.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    result = [{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'slug': post.slug,
        'published': post.published,
        'created_at': post.created_at.isoformat(),
        'updated_at': post.updated_at.isoformat()
    } for post in posts]
    session.close()
    return jsonify(result)

@app.route('/api/posts/<slug>', methods=['GET'])
def get_post(slug):
    session = Session()
    post = session.query(BlogPost).filter_by(slug=slug).first()
    if post:
        result = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'slug': post.slug,
            'published': post.published,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
        }
        session.close()
        return jsonify(result)
    session.close()
    return jsonify({'error': 'Post not found'}), 404

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    session = Session()
    try:
        post = BlogPost(
            title=data['title'],
            content=data['content'],
            slug=data['slug'],
            published=data.get('published', False)
        )
        session.add(post)
        session.commit()
        result = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'slug': post.slug,
            'published': post.published,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
        }
        return jsonify(result), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.json
    session = Session()
    try:
        post = session.query(BlogPost).filter_by(id=post_id).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        post.title = data['title']
        post.content = data['content']
        post.slug = data['slug']
        if 'published' in data:
            post.published = data['published']
            
        session.commit()
        
        result = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'slug': post.slug,
            'published': post.published,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
        }
        return jsonify(result)
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    session = Session()
    try:
        post = session.query(BlogPost).filter_by(id=post_id).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        session.delete(post)
        session.commit()
        return '', 204
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

# Add route to get post by slug for editing
@app.route('/api/posts/slug/<slug>', methods=['GET'])
def get_post_by_slug(slug):
    session = Session()
    post = session.query(BlogPost).filter_by(slug=slug).first()
    if post:
        result = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'slug': post.slug,
            'published': post.published,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
        }
        session.close()
        return jsonify(result)
    session.close()
    return jsonify({'error': 'Post not found'}), 404

@app.route('/api/home', methods=['GET'])
def get_home():
    session = Session()
    home = session.query(HomePage).first()
    if home:
        result = {
            'id': home.id,
            'title': home.title,
            'content': home.content,
            'updated_at': home.updated_at.isoformat()
        }
        session.close()
        return jsonify(result)
    session.close()
    return jsonify({'error': 'Home page not found'}), 404

@app.route('/api/home', methods=['POST'])
def update_home():
    data = request.json
    session = Session()
    try:
        home = session.query(HomePage).first()
        if home:
            home.title = data['title']
            home.content = data['content']
        else:
            home = HomePage(
                title=data['title'],
                content=data['content']
            )
            session.add(home)
        session.commit()
        result = {
            'id': home.id,
            'title': home.title,
            'content': home.content,
            'updated_at': home.updated_at.isoformat()
        }
        return jsonify(result)
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
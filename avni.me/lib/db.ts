import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'
import { hash, compare } from 'bcrypt'

let db: Database | null = null

export async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'blog.db'),
      driver: sqlite3.Database
    })

    await db.exec(`
      CREATE TABLE IF NOT EXISTS admin_tokens (
        token TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        published BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    `)
  }
  return db
}

export async function createAdminToken(token: string, password: string) {
  const db = await getDb()
  const passwordHash = await hash(password, 10)
  await db.run(
    'INSERT INTO admin_tokens (token, password_hash) VALUES (?, ?)',
    token,
    passwordHash
  )
}

export async function verifyAdminToken(token: string, password: string) {
  const db = await getDb()
  const result = await db.get(
    'SELECT password_hash FROM admin_tokens WHERE token = ?',
    token
  )
  if (!result) return false
  return compare(password, result.password_hash)
}

// API endpoint for Flask backend
const API_URL = 'http://localhost:5000/api';

export async function createPost(
  slug: string,
  title: string,
  content: string,
  published: boolean = false
) {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        title,
        content
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(
  slug: string,
  title: string,
  content: string,
  published: boolean
) {
  try {
    // First get the post ID from the slug
    const post = await getPostBySlug(slug);
    if (!post) {
      throw new Error('Post not found');
    }
    
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        title,
        content
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(slug: string) {
  try {
    // First get the post ID from the slug
    const post = await getPostBySlug(slug);
    if (!post) {
      throw new Error('Post not found');
    }
    
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete post');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Helper function to get post by slug
async function getPostBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/posts/slug/${slug}`);
    if (!response.ok) {
      console.error(`Error fetching post by slug: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function getPost(slug: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

export async function getAllDraftPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching draft posts:', error);
    return [];
  }
}

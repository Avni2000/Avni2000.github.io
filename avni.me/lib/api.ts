export interface Post {
  id: number
  slug: string
  title: string
  content: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface HomePage {
  id: number
  title: string
  content: string
  updated_at: string
}

const API_BASE_URL = 'http://localhost:5000/api'

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export async function getPost(slug: string): Promise<Post | null> {
  const response = await fetch(`${API_BASE_URL}/posts/${slug}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }
  return response.json()
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'true'

  if (!title || !content) {
    return { error: 'Title and content are required.' }
  }

  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, slug, published }),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return response.json()
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'true'

  if (!title || !content) {
    return { error: 'Title and content are required.' }
  }

  const slug = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, slug, published }),
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  return response.json()
}

export async function deletePost(id: number) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
}

export async function getHomePage(): Promise<HomePage | null> {
  const response = await fetch(`${API_BASE_URL}/home`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch home page')
  }
  return response.json()
}

export async function updateHomePage(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: 'Title and content are required.' }
  }

  const response = await fetch(`${API_BASE_URL}/home`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  })

  if (!response.ok) {
    throw new Error('Failed to update home page')
  }

  return response.json()
} 
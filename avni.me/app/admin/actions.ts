'use server'

import { verifyAdminToken, deletePost as deletePostFromDb, createPost as createPostInDb, updatePost as updatePostInDb } from '@/lib/db'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Helper function to create slug from title
function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export async function loginAction(formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  if (!token || !password) {
    return { error: 'Token and password are required' }
  }

  try {
    const isValid = await verifyAdminToken(token, password)
    
    if (!isValid) {
      return { error: 'Invalid token or password' }
    }

    // Create cookie string that client can use
    const cookieString = `admin_session=${token}; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`

    return { 
      success: true,
      cookieString
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An error occurred during login' }
  }
}

export async function logoutAction() {
  // Clear the admin session cookie
  const cookieStore = await cookies()
  
  // Set an expired cookie to clear it
  const expiredCookie = `admin_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  
  return { 
    success: true,
    cookieString: expiredCookie
  }
}

export async function deletePost(slug: string) {
  try {
    await deletePostFromDb(slug)
    revalidatePath('/admin/dashboard')
    revalidatePath('/writing')
    revalidatePath(`/writing/${slug}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { error: 'Failed to delete post' }
  }
}

export async function createPost(title: string, content: string, published: boolean) {
  try {
    const slug = createSlug(title)
    await createPostInDb(slug, title, content, published)
    revalidatePath('/admin/dashboard')
    revalidatePath('/writing')
    return { success: true, slug }
  } catch (error) {
    console.error('Error creating post:', error)
    return { error: 'Failed to create post' }
  }
}

export async function updatePost(slug: string, title: string, content: string, published: boolean) {
  try {
    await updatePostInDb(slug, title, content, published)
    revalidatePath('/admin/dashboard')
    revalidatePath('/writing')
    revalidatePath(`/writing/${slug}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating post:', error)
    return { error: 'Failed to update post' }
  }
} 
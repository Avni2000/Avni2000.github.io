import { getAllDraftPosts } from '@/lib/db'
import Link from 'next/link'
import { cookies } from 'next/headers'
import PostList from './PostList'

export default async function AdminDashboard() {
  const posts = await getAllDraftPosts()
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value

  if (!adminSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-8 text-center">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p>Please log in to access the admin dashboard.</p>
          <Link 
            href="/admin/login" 
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link 
              href="/admin/posts/new" 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              New Post
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              prefetch={false}
            >
              Logout
            </Link>
          </div>
        </div>

        <div className="bg-card shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Posts</h2>
          <PostList initialPosts={posts} />
        </div>
      </div>
    </div>
  )
}

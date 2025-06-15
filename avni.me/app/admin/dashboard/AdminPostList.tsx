'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deletePost } from '../actions'

type Post = {
  id: number
  title: string
  slug: string
  content: string
  created_at: string
  updated_at: string
  published: boolean
}

export default function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleDelete(slug: string) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      setIsDeleting(slug)
      await deletePost(slug)
      router.refresh()
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()} •{' '}
              {post.published ? 'Published' : 'Draft'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/admin/posts/${post.slug}/edit`}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-accent"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(post.slug)}
              disabled={isDeleting === post.slug}
              className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting === post.slug ? 'Deleting...' : 'Delete'}
            </button>
            <Link
              href={`/writing/${post.slug}`}
              target="_blank"
              className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
            >
              View
            </Link>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No posts yet. Create your first post!
        </p>
      )}
    </div>
  )
} 
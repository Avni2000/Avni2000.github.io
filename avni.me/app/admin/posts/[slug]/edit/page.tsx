import { getPost } from '@/lib/db'
import { notFound } from 'next/navigation'
import PostEditor from '../../PostEditor'

export default async function EditPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostEditor post={post} />
    </div>
  )
} 
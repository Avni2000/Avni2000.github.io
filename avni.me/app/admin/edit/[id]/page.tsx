import { PostForm } from "@/components/post-form"
import { getPosts, updatePost } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const posts = await getPosts()
  const post = posts.find((p) => p.id === parseInt(params.id))

  if (!post) {
    notFound()
  }

  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm action={updatePostWithId} post={post} />
    </div>
  )
}

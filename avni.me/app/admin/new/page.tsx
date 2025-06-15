import { PostForm } from "@/components/post-form"
import { createPost } from "@/lib/db"

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostForm action={createPost} />
    </div>
  )
}

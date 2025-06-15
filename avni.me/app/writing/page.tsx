import { getPosts, type Post } from "@/lib/db"
import Link from "next/link"

export default async function WritingPage() {
  const posts = await getPosts()

  return (
    <div className="pb-12">
      <h1 className="text-3xl font-bold mb-8">Writing</h1>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <Link href={`/writing/${post.slug}`} key={post.id} className="flex justify-between items-center py-2 group">
            <span className="group-hover:underline">{post.title}</span>
            <span className="text-sm text-foreground/60">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

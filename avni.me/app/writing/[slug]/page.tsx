import { getPost } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MdxContent } from "@/components/mdx-content"

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="pb-12">
      <Link href="/writing" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8">
        <ArrowLeft size={16} />
        Back to Writing
      </Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-foreground/60 mb-8">
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="leading-relaxed">
        <MdxContent source={post.content} />
      </div>
    </article>
  )
}

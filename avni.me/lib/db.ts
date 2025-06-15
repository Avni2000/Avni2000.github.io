import { kv } from "@vercel/kv"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface Post {
  id: string
  slug: string
  title: string
  content: string
  createdAt: number
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

export async function getPosts(): Promise<Post[]> {
  const postIds = await kv.zrange<string[]>("posts_by_date", 0, -1, { rev: true })
  if (!postIds.length) return []
  const posts = await kv.mget<Post[]>(...postIds.map((id) => `post:${id}`))
  return posts.filter(Boolean) as Post[]
}

export async function getPost(slug: string): Promise<Post | null> {
  const postId = await kv.get<string>(`slug:${slug}`)
  if (!postId) return null
  return await kv.get<Post>(`post:${postId}`)
}

export async function createPost(formData: FormData) {
  "use server"
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    return { error: "Title and content are required." }
  }

  const id = crypto.randomUUID()
  const slug = createSlug(title)
  const createdAt = Date.now()

  const post: Post = { id, slug, title, content, createdAt }

  await kv.set(`post:${id}`, post)
  await kv.set(`slug:${slug}`, id)
  await kv.zadd("posts_by_date", { score: createdAt, member: id })

  revalidatePath("/")
  revalidatePath("/writing")
  revalidatePath(`/writing/${slug}`)
  redirect("/admin/dashboard")
}

export async function updatePost(id: string, formData: FormData) {
  "use server"
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    return { error: "Title and content are required." }
  }

  const existingPost = await kv.get<Post>(`post:${id}`)
  if (!existingPost) {
    return { error: "Post not found." }
  }

  const newSlug = createSlug(title)
  const post: Post = { ...existingPost, title, content, slug: newSlug }

  await kv.set(`post:${id}`, post)
  if (existingPost.slug !== newSlug) {
    await kv.del(`slug:${existingPost.slug}`)
    await kv.set(`slug:${newSlug}`, id)
  }

  revalidatePath("/")
  revalidatePath("/writing")
  revalidatePath(`/writing/${newSlug}`)
  redirect("/admin/dashboard")
}

export async function deletePost(id: string) {
  "use server"
  const post = await kv.get<Post>(`post:${id}`)
  if (post) {
    await kv.del(`post:${id}`)
    await kv.del(`slug:${post.slug}`)
    await kv.zrem("posts_by_date", id)
  }
  revalidatePath("/admin/dashboard")
  revalidatePath("/writing")
}

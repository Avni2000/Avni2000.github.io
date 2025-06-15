import { getPosts, deletePost } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

export default async function AdminDashboard() {
  const posts = await getPosts()

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/new">New Post</Link>
          </Button>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-foreground/60">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/edit/${post.id}`}>Edit</Link>
              </Button>
              <form action={deletePost.bind(null, post.id)}>
                <Button variant="destructive" size="sm" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

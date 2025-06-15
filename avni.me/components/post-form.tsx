import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Post } from "@/lib/db"

type PostFormProps = {
  action: (formData: FormData) => Promise<any>
  post?: Post | null
}

export function PostForm({ action, post }: PostFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="content">Content (Markdown + LaTeX)</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={post?.content}
          required
          className="mt-1 min-h-[400px] font-mono"
          placeholder="Write your post here. Use Markdown for formatting and $...$ or $$...$$ for LaTeX."
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="submit">{post ? "Update Post" : "Create Post"}</Button>
        <Button variant="outline" asChild>
          <a href="/admin/dashboard">Cancel</a>
        </Button>
      </div>
    </form>
  )
}

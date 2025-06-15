import { deletePost } from '@/lib/db'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value

  // Check if user is authenticated
  if (!adminSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await deletePost(params.slug)
    
    // Revalidate related paths
    revalidatePath('/admin/dashboard')
    revalidatePath('/writing')
    revalidatePath(`/writing/${params.slug}`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
} 
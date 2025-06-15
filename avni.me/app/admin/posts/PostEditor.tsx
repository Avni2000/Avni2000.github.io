'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost, updatePost } from '../actions'

type PostEditorProps = {
  post?: {
    slug: string
    title: string
    content: string
    published: boolean
  }
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHelpText, setShowHelpText] = useState(false)

  const isEditing = !!post

  async function handleSubmitAsDraft(e: React.FormEvent) {
    e.preventDefault()
    await handleSave(false)
  }

  async function handleSubmitAsPublished(e: React.FormEvent) {
    e.preventDefault()
    await handleSave(true)
  }

  async function handleSave(isPublished: boolean) {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!title || !content) {
        setError('Title and content are required')
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        await updatePost(post.slug, title, content, isPublished)
      } else {
        await createPost(title, content, isPublished)
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred while saving the post')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Insert code block template at cursor position
  function insertCodeBlock() {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const language = 'javascript' // Default language
    
    const codeBlockTemplate = `\`\`\`${language}
// Your code here
\`\`\`

`
    
    const newContent = 
      content.substring(0, start) + 
      codeBlockTemplate + 
      content.substring(end)
    
    setContent(newContent)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + codeBlockTemplate.indexOf('// Your code here')
      textarea.setSelectionRange(newCursorPos, newCursorPos + 15)
    }, 0)
  }
  
  // Insert LaTeX template at cursor position
  function insertLatex(inline = true) {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    let latexTemplate
    if (inline) {
      latexTemplate = '$e = mc^2$'
    } else {
      latexTemplate = `$$
e = mc^2
$$

`
    }
    
    const newContent = 
      content.substring(0, start) + 
      latexTemplate + 
      content.substring(end)
    
    setContent(newContent)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + latexTemplate.indexOf('e = mc^2')
      textarea.setSelectionRange(newCursorPos, newCursorPos + 7)
    }, 0)
  }

  // Determine button labels
  const draftButtonLabel = isSubmitting
    ? 'Saving...'
    : isEditing && post.published
    ? 'Unpublish & Save as Draft'
    : 'Save as Draft'

  const publishButtonLabel = isSubmitting
    ? 'Saving...'
    : isEditing && post.published
    ? 'Update Published Post'
    : 'Publish'

  return (
    <div className="bg-card shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h2>
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 border border-border rounded hover:bg-accent"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Content (Markdown)
            </label>
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={() => setShowHelpText(!showHelpText)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showHelpText ? 'Hide Help' : 'Show Help'}
              </button>
              <button
                type="button"
                onClick={insertCodeBlock}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Insert Code Block
              </button>
              <button
                type="button"
                onClick={() => insertLatex(true)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Inline Math
              </button>
              <button
                type="button"
                onClick={() => insertLatex(false)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Block Math
              </button>
            </div>
          </div>
          
          {showHelpText && (
            <div className="mb-3 text-xs bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="font-medium mb-1">Markdown Tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code># Heading 1</code>, <code>## Heading 2</code>, etc. for headings</li>
                <li><code>**bold**</code> for <strong>bold</strong> text</li>
                <li><code>*italic*</code> for <em>italic</em> text</li>
                <li><code>[link text](url)</code> for links</li>
              </ul>
              
              <p className="font-medium mt-2 mb-1">Code Blocks:</p>
              <pre className="bg-gray-100 p-1 rounded overflow-x-auto">
                ```javascript<br/>
                // Your code here<br/>
                ```
              </pre>
              <p className="mt-1">Replace "javascript" with languages like python, typescript, css, html, etc.</p>
              
              <p className="font-medium mt-2 mb-1">LaTeX Examples:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>$e = mc^2$</code> for inline math</li>
                <li><code>$$<br/>e = mc^2<br/>$$</code> for block math</li>
              </ul>
            </div>
          )}
          
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className="w-full px-3 py-2 border border-border rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isEditing && (
          <div className="bg-accent/30 p-3 rounded">
            <p className="text-sm">
              Current status: <span className="font-medium">{post.published ? 'Published' : 'Draft'}</span>
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleSubmitAsDraft}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {draftButtonLabel}
          </button>
          <button
            type="button"
            onClick={handleSubmitAsPublished}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {publishButtonLabel}
          </button>
        </div>
      </form>
    </div>
  )
} 
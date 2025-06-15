'use client'

import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import "katex/dist/katex.min.css"
import styles from "./mdx-content.module.css"

// Syntax highlighting options
const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
  // Callback to customize the rendering
  onVisitLine(node: any) {
    // Prevent lines from collapsing in display: grid mode
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  // Callback to customize the rendering of code blocks
  onVisitHighlightedLine(node: any) {
    // Add a highlighted class to the line
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    // Add a highlighted class to the word
    node.properties.className = ['word']
  },
}

const options = {
  mdxOptions: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
      remarkMath, // For LaTeX math equations
    ],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions], // For code highlighting
      [rehypeKatex, { throwOnError: false, strict: false }], // For LaTeX rendering with more lenient options
    ],
  },
}

export function MdxContent({ source }: { source: string }) {
  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none ${styles.mdxContent}`}>
      {/* @ts-ignore */}
      <MDXRemote source={source} options={options} />
    </div>
  )
}

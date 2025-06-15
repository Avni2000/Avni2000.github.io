import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Leonard Tang",
  description: "Personal website and blog.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(GeistMono.variable, "bg-background")}>
      <body className="font-mono">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-12">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                Leonard Tang
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/#research" className="text-foreground/80 hover:text-foreground transition-colors">
                  Research
                </Link>
                <Link href="/writing" className="text-foreground/80 hover:text-foreground transition-colors">
                  Writing
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-12 text-center text-foreground/60 text-sm">
            © {new Date().getFullYear()} Leonard Tang. All Rights Reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Avni",
  description: "Personal website and blog.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-mono">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-12">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight">
                Avni Badiwale
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/writing" className="text-foreground/80 hover:text-foreground transition-colors">
                  Writing
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}

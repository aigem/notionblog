import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Analytics from '@/components/Analytics'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { generateBaseMetadata, generateWebsiteJsonLd } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateBaseMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteJsonLd = generateWebsiteJsonLd()

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col theme-transition`}>
        <ThemeProvider>
          <ErrorBoundary>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Analytics />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

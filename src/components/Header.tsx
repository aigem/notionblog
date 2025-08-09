'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThemeSelector from './ThemeSelector'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="theme-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center theme-glow-sm">
              <span className="text-background font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl text-text-primary theme-transition">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Dream Blog'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/" 
              className="text-text-secondary hover:text-primary theme-transition font-medium px-3 py-2 rounded-lg hover:bg-background-secondary"
            >
              首页
            </Link>
            <Link 
              href="/blog" 
              className="text-text-secondary hover:text-primary theme-transition font-medium px-3 py-2 rounded-lg hover:bg-background-secondary"
            >
              文章
            </Link>
            <Link 
              href="/search" 
              className="text-text-secondary hover:text-primary theme-transition font-medium px-3 py-2 rounded-lg hover:bg-background-secondary"
            >
              搜索
            </Link>
            <Link 
              href="/about" 
              className="text-text-secondary hover:text-primary theme-transition font-medium px-3 py-2 rounded-lg hover:bg-background-secondary"
            >
              关于
            </Link>
            
            {/* 主题切换器 */}
            <ThemeSelector />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary hover:bg-background-secondary theme-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t theme-border">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-text-secondary hover:text-primary hover:bg-background-secondary theme-transition font-medium px-4 py-3 rounded-lg mx-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>首页</span>
                </div>
              </Link>
              <Link 
                href="/blog" 
                className="text-text-secondary hover:text-primary hover:bg-background-secondary theme-transition font-medium px-4 py-3 rounded-lg mx-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>文章</span>
                </div>
              </Link>
              <Link 
                href="/search" 
                className="text-text-secondary hover:text-primary hover:bg-background-secondary theme-transition font-medium px-4 py-3 rounded-lg mx-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>搜索</span>
                </div>
              </Link>
              <Link 
                href="/about" 
                className="text-text-secondary hover:text-primary hover:bg-background-secondary theme-transition font-medium px-4 py-3 rounded-lg mx-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>关于</span>
                </div>
              </Link>
              
              {/* 移动端主题切换器 */}
              <div className="px-4 py-3 mx-2">
                <ThemeSelector />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

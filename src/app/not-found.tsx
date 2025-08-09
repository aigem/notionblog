'use client';

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          页面未找到
        </h1>

        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            返回首页
          </Link>

          <Link
            href="/blog"
            className="inline-block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            浏览文章
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            或者尝试搜索您要找的内容：
          </p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文章..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value
                  if (query.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`
                  }
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>常用链接：</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              关于我们
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
              文章列表
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/search" className="text-blue-600 hover:text-blue-800">
              搜索
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { isFeatureEnabled } from '@/lib/config'

interface CommentsProps {
  postId: string
  postTitle: string
}

export default function Comments({ postId, postTitle }: CommentsProps) {
  // 如果评论功能未启用，不渲染任何内容
  if (!isFeatureEnabled('comments')) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">评论</h3>
      
      {/* 评论表单 */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <form className="space-y-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              id="comment-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的姓名"
            />
          </div>
          
          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              id="comment-email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的邮箱"
            />
          </div>
          
          <div>
            <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1">
              评论内容
            </label>
            <textarea
              id="comment-content"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的评论..."
            />
          </div>
          
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            发表评论
          </button>
        </form>
      </div>
      
      {/* 评论列表占位符 */}
      <div className="space-y-4">
        <p className="text-gray-500 text-center py-8">
          暂无评论，快来发表第一条评论吧！
        </p>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 text-xs rounded">
          评论功能已启用 (PostID: {postId})
        </div>
      )}
    </div>
  )
}
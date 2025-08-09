'use client';

import { useState } from 'react';

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic';

export default function TestNotionPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notion/test');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: '请求失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts');
      const result = await response.json();
      setPosts(result);
    } catch (error) {
      setPosts({
        success: false,
        message: '获取文章失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Notion API 集成测试
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">连接测试</h2>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '测试中...' : '测试 Notion 连接'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-md ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ 连接成功' : '❌ 连接失败'}
              </h3>
              <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                {testResult.message}
              </p>
              {testResult.error && (
                <p className="text-red-600 text-sm mt-2">错误详情: {testResult.error}</p>
              )}
              {testResult.timestamp && (
                <p className="text-gray-500 text-sm mt-2">测试时间: {testResult.timestamp}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">文章数据测试</h2>
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '获取中...' : '获取文章列表'}
          </button>
          
          {posts && (
            <div className={`mt-4 p-4 rounded-md ${
              posts.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                posts.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {posts.success ? `✅ 获取成功 (${posts.total || 0} 篇文章)` : '❌ 获取失败'}
              </h3>
              {posts.success && posts.data && posts.data.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">文章列表:</h4>
                  <div className="space-y-2">
                    {posts.data.slice(0, 5).map((post: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-900">{post.title}</h5>
                        <p className="text-sm text-gray-600">{post.summary}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.publishDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {posts.data.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      还有 {posts.data.length - 5} 篇文章...
                    </p>
                  )}
                </div>
              ) : posts.success ? (
                <p className="text-gray-600 mt-2">暂无文章数据</p>
              ) : (
                <>
                  <p className="text-red-700">{posts.message}</p>
                  {posts.error && (
                    <p className="text-red-600 text-sm mt-2">错误详情: {posts.error}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 配置说明</h3>
          <p className="text-yellow-700 text-sm">
            请确保已在 <code className="bg-yellow-100 px-1 rounded">.env.local</code> 文件中配置了正确的 Notion API Key 和 Database ID。
          </p>
          <p className="text-yellow-700 text-sm mt-2">
            如果测试失败，请检查：
          </p>
          <ul className="text-yellow-700 text-sm mt-1 ml-4 list-disc">
            <li>Notion Integration 是否已创建并获得正确权限</li>
            <li>Database ID 是否正确</li>
            <li>Database 是否已共享给 Integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
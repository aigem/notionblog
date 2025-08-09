export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="prose prose-lg max-w-none">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            关于 Dream Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            记录生活点滴，分享思考感悟
          </p>
        </header>

        {/* 博客介绍 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">博客简介</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Dream Blog 是一个基于 Notion API 构建的现代化个人博客系统。这里记录着我的生活点滴、技术思考和人生感悟。
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              每一篇文章都是我对生活的观察和思考的结晶，希望能够与你分享这些珍贵的时刻和想法。
            </p>
            <p className="text-gray-700 leading-relaxed">
              在这个快节奏的时代，我相信慢下来记录和思考的价值。愿这个小小的空间能够给你带来一些启发和共鸣。
            </p>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">技术实现</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">前端技术</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 15 - React 全栈框架</li>
                <li>• TypeScript - 类型安全</li>
                <li>• Tailwind CSS - 样式框架</li>
                <li>• App Router - 现代路由系统</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">后端服务</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Notion API - 内容管理</li>
                <li>• Node.js - 服务端运行时</li>
                <li>• 静态生成 - 优化性能</li>
                <li>• 响应式设计 - 移动端适配</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 设计理念 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">设计理念</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">简约至上</h3>
                <p className="text-gray-600">采用黑白灰的极简配色方案，让内容成为主角，减少视觉干扰。</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">阅读体验</h3>
                <p className="text-gray-600">优化排版和字体，提供舒适的阅读体验，让每一次阅读都是享受。</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">性能优先</h3>
                <p className="text-gray-600">采用静态生成和现代化技术栈，确保快速的加载速度和流畅的交互。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">联系我</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-700 leading-relaxed mb-4">
              如果你对博客内容有任何想法或建议，欢迎与我交流。
            </p>
            <p className="text-gray-600">
              让我们一起在这个数字世界中，创造更多有意义的连接。
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

// 页面元数据
export const metadata = {
  title: '关于我 - Dream Blog',
  description: '了解 Dream Blog 的创建理念、技术实现和设计思路',
  keywords: ['关于', '博客介绍', 'Next.js', 'Notion API', '个人博客'],
}
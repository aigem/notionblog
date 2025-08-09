import BlogCard from '@/components/BlogCard'
import { getLatestPosts, getBlogStats, getAllCategories, getAllTags } from '@/lib/data'
import Link from 'next/link'

export default function HomePage() {
  const latestPosts = getLatestPosts(6)
  const stats = getBlogStats()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <div className="min-h-screen">
      {/* Hero区域 */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-900 rounded-full mb-4 sm:mb-6">
              <span className="text-white text-xl sm:text-2xl font-bold">D</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Dream Blog'}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION || '记录生活点滴，分享思考感悟'}
              <br className="hidden sm:block" />
              <span className="text-base sm:text-lg text-gray-500 block sm:inline mt-2 sm:mt-0">在这里，每一个想法都值得被珍藏</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link 
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-base sm:text-lg"
              >
                开始阅读
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 text-base sm:text-lg"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 统计信息 */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {stats.totalPosts}
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">总文章数</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">持续更新中</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {stats.publishedPosts}
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">已发布</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">精心编写</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600 font-medium text-sm sm:text-base">分类数量</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">涵盖多个领域</div>
            </div>
          </div>
        </section>

        {/* 最新文章 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">最新文章</h2>
              <p className="text-gray-600">探索最新的思考和分享</p>
            </div>
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              查看全部
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无文章</h3>
              <p className="text-gray-500">精彩内容正在准备中，敬请期待...</p>
            </div>
          )}
        </section>

        {/* 分类和标签展示 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 热门分类 */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">热门分类</h3>
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${encodeURIComponent(category)}`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200 group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">
                      {category}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无分类</p>
            )}
          </div>

          {/* 标签云 */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">标签云</h3>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="inline-block px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-sm font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无标签</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

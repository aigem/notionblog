'use client';

import { useState, useEffect, useMemo } from 'react';
import BlogCard from '@/components/BlogCard';
import { getPublishedPosts, getAllCategories, getAllTags } from '@/lib/data';
import { BlogPost } from '@/lib/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const postsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, categoriesData, tagsData] = await Promise.all([
          getPublishedPosts(),
          getAllCategories(),
          getAllTags()
        ]);
        
        setPosts(postsData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 过滤和排序文章
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
      
      const matchesTag = selectedTag === '' || 
        (post.tags && post.tags.includes(selectedTag));
      
      return matchesSearch && matchesCategory && matchesTag;
    });

    // 排序
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, selectedTag, sortBy]);

  // 分页计算
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSortBy('date');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">博客文章</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            探索技术、分享思考、记录成长的点点滴滴
          </p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 mb-4">
            {/* 搜索框 */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base sm:text-sm"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base sm:text-sm bg-white"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* 标签筛选 */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base sm:text-sm bg-white"
            >
              <option value="">所有标签</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>

            {/* 排序方式 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base sm:text-sm bg-white"
            >
              <option value="date">按日期排序</option>
              <option value="title">按标题排序</option>
            </select>
          </div>

          {/* 筛选状态和清除按钮 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              找到 {filteredAndSortedPosts.length} 篇文章
              {(searchTerm || selectedCategory || selectedTag) && (
                <span className="ml-2">
                  {searchTerm && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">搜索: {searchTerm}</span>}
                  {selectedCategory && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-1">分类: {selectedCategory}</span>}
                  {selectedTag && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">标签: {selectedTag}</span>}
                </span>
              )}
            </div>
            
            {(searchTerm || selectedCategory || selectedTag || sortBy !== 'date') && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* 文章列表 */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* 分页导航 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  <span className="hidden sm:inline">上一页</span>
                  <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // 在移动端显示更少的页码
                    const showOnMobile = page === 1 || page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    const showOnDesktop = page === 1 || page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (showOnDesktop) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          } ${!showOnMobile ? 'hidden sm:flex' : ''}`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 3 || page === currentPage + 3) &&
                      showOnDesktop
                    ) {
                      return (
                        <span key={page} className="px-3 py-2 text-sm text-gray-500 hidden sm:inline-flex items-center">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  <span className="hidden sm:inline">下一页</span>
                  <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          /* 空状态 */
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的文章</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory || selectedTag
                ? '尝试调整搜索条件或筛选器'
                : '暂时还没有发布任何文章'}
            </p>
            {(searchTerm || selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
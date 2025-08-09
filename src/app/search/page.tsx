'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import { getPublishedPosts, getAllCategories, getAllTags } from '@/lib/data';
import { BlogPost } from '@/lib/types';

interface SearchFilters {
  query: string;
  category: string;
  tag: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'relevance' | 'date' | 'title';
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: (searchParams.get('sortBy') as 'relevance' | 'date' | 'title') || 'relevance'
  });

  // 加载数据
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
        
        // 生成搜索建议
        const allTitles = postsData.map(post => post.title);
        const allWords = allTitles.join(' ').split(' ').filter(word => word.length > 2);
        setSuggestions([...new Set(allWords)].slice(0, 10));
      } catch (error) {
        console.error('Error loading search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)]; // 保留最近10条
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 计算搜索结果
  const searchResults = useMemo(() => {
    const filtered = posts.filter(post => {
      // 查询匹配
      const matchesQuery = !filters.query || 
        post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(filters.query.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(filters.query.toLowerCase()));
      
      // 分类匹配
      const matchesCategory = !filters.category || post.category === filters.category;
      
      // 标签匹配
      const matchesTag = !filters.tag || (post.tags && post.tags.includes(filters.tag));
      
      // 日期范围匹配
      const postDate = new Date(post.publishDate);
      const matchesDateFrom = !filters.dateFrom || postDate >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || postDate <= new Date(filters.dateTo);
      
      return matchesQuery && matchesCategory && matchesTag && matchesDateFrom && matchesDateTo;
    });

    // 排序
    filtered.sort((a, b) => {
      if (filters.sortBy === 'relevance') {
        // 简单的相关性排序：标题匹配优先
        const aRelevance = a.title.toLowerCase().includes(filters.query.toLowerCase()) ? 2 : 1;
        const bRelevance = b.title.toLowerCase().includes(filters.query.toLowerCase()) ? 2 : 1;
        if (aRelevance !== bRelevance) return bRelevance - aRelevance;
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else if (filters.sortBy === 'date') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [posts, filters]);

  // 高亮搜索关键词
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  // 处理搜索
  const handleSearch = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // 保存到搜索历史
    if (newFilters.query) {
      saveToHistory(newFilters.query);
    }
    
    // 更新URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载搜索数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">搜索文章</h1>
          <p className="text-xl text-gray-600">
            发现感兴趣的内容，探索知识的海洋
          </p>
        </div>

        {/* 搜索表单 */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          {/* 主搜索框 */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="输入关键词搜索文章..."
              value={filters.query}
              onChange={(e) => handleSearch({ query: e.target.value })}
              className="block w-full pl-10 pr-4 py-3 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* 搜索建议 */}
          {filters.query && suggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">搜索建议：</p>
              <div className="flex flex-wrap gap-2">
                {suggestions
                  .filter(suggestion => suggestion.toLowerCase().includes(filters.query.toLowerCase()))
                  .slice(0, 5)
                  .map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch({ query: suggestion })}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 搜索历史 */}
          {searchHistory.length > 0 && !filters.query && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">搜索历史：</p>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  清除历史
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 8).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch({ query: item })}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 高级搜索切换 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg className={`h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              高级搜索
            </button>
            
            <div className="text-sm text-gray-600">
              找到 {searchResults.length} 篇文章
            </div>
          </div>

          {/* 高级搜索选项 */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleSearch({ category: e.target.value })}
                    className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                  >
                    <option value="">所有分类</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* 标签筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                  <select
                    value={filters.tag}
                    onChange={(e) => handleSearch({ tag: e.target.value })}
                    className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                  >
                    <option value="">所有标签</option>
                    {tags.map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                </div>

                {/* 开始日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleSearch({ dateFrom: e.target.value })}
                    className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                  />
                </div>

                {/* 结束日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleSearch({ dateTo: e.target.value })}
                    className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* 排序方式 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {[
                    { value: 'relevance', label: '相关性' },
                    { value: 'date', label: '发布日期' },
                    { value: 'title', label: '标题' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center py-2 sm:py-0">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleSearch({ sortBy: e.target.value as 'relevance' | 'date' | 'title' })}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm sm:text-base">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索结果 */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {searchResults.map((post) => (
              <div key={post.id} className="relative">
                <BlogCard post={post} />
                {/* 搜索关键词高亮提示 */}
                {filters.query && (
                  <div className="mt-2 px-2 sm:px-0 text-sm text-gray-600">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: `匹配: ${highlightText(post.title, filters.query)}` 
                      }} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* 空状态 */
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的文章</h3>
            <p className="text-gray-500 mb-4">
              尝试使用不同的关键词或调整搜索条件
            </p>
            <button
              onClick={() => handleSearch({ query: '', category: '', tag: '', dateFrom: '', dateTo: '', sortBy: 'relevance' })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              清除所有筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载搜索页面中...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
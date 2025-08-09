import { BlogPost, BlogStats } from './types'
import postsData from '@/data/posts.json'
import publishedPostsData from '@/data/published-posts.json'
import statsData from '@/data/stats.json'

// 内存缓存
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// 缓存辅助函数
function getCachedData<T>(key: string, fetchFn: () => T, ttl: number = 300000): T {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < cached.ttl) {
    return cached.data
  }
  
  const data = fetchFn()
  cache.set(key, { data, timestamp: now, ttl })
  return data
}

// 获取所有文章
export function getAllPosts(): BlogPost[] {
  try {
    return postsData as BlogPost[]
  } catch (error) {
    console.error('获取所有文章失败:', error)
    return []
  }
}

// 获取已发布的文章
export function getPublishedPosts(): BlogPost[] {
  try {
    return publishedPostsData as BlogPost[]
  } catch (error) {
    console.error('获取已发布文章失败:', error)
    return []
  }
}

// 获取文章统计信息
export function getBlogStats(): BlogStats {
  try {
    const stats = statsData as any;
    return {
      totalPosts: stats.totalPosts || 0,
      publishedPosts: stats.publishedPosts || 0,
      draftPosts: stats.draftPosts || 0,
      lastUpdated: stats.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

// 根据ID获取单篇文章
export function getPostById(id: string): BlogPost | null {
  try {
    if (!id || typeof id !== 'string') {
      console.warn('getPostById: 无效的文章ID', id)
      return null
    }

    const posts = getAllPosts()
    const post = posts.find(post => post.id === id) || null
    
    if (!post) {
      console.info('getPostById: 文章未找到', id)
    }
    
    return post
  } catch (error) {
    console.error('getPostById: 获取文章失败', { id, error })
    return null
  }
}

// 获取最新的已发布文章
export function getLatestPosts(limit: number = 5): BlogPost[] {
  try {
    const publishedPosts = getPublishedPosts()
    return publishedPosts
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('获取最新文章失败:', error)
    return []
  }
}

// 根据分类获取文章
export function getPostsByCategory(category: string): BlogPost[] {
  try {
    if (!category) return []
    
    const publishedPosts = getPublishedPosts()
    return publishedPosts.filter(post => post.category === category)
  } catch (error) {
    console.error('根据分类获取文章失败:', { category, error })
    return []
  }
}

// 根据标签获取文章
export function getPostsByTag(tag: string): BlogPost[] {
  try {
    if (!tag) return []
    
    const publishedPosts = getPublishedPosts()
    return publishedPosts.filter(post => 
      post.tags && post.tags.includes(tag)
    )
  } catch (error) {
    console.error('根据标签获取文章失败:', { tag, error })
    return []
  }
}

// 获取所有分类 - 优化版本
export function getAllCategories(): string[] {
  return getCachedData('all_categories', () => {
    try {
      const publishedPosts = getPublishedPosts()
      const categories = publishedPosts
        .map(post => post.category)
        .filter((category): category is string => Boolean(category))
      
      return Array.from(new Set(categories)).sort()
    } catch (error) {
      console.error('获取所有分类失败:', error)
      return []
    }
  }, 600000) // 缓存10分钟
}

// 获取所有标签 - 优化版本
export function getAllTags(): string[] {
  return getCachedData('all_tags', () => {
    try {
      const publishedPosts = getPublishedPosts()
      const tags = publishedPosts
        .flatMap(post => post.tags || [])
        .filter(Boolean)
      
      return Array.from(new Set(tags)).sort()
    } catch (error) {
      console.error('获取所有标签失败:', error)
      return []
    }
  }, 600000) // 缓存10分钟
}

// 搜索文章 - 优化版本
export function searchPosts(query: string): BlogPost[] {
  try {
    if (!query.trim()) return []
    
    const cacheKey = `search_${query.toLowerCase()}`
    
    return getCachedData(cacheKey, () => {
      const publishedPosts = getPublishedPosts()
      const lowercaseQuery = query.toLowerCase()
      const searchTerms = lowercaseQuery.split(' ').filter(term => term.length > 0)
      
      return publishedPosts.filter(post => {
        const searchableText = [
          post.title,
          post.summary || '',
          post.category || '',
          ...(post.tags || [])
        ].join(' ').toLowerCase()
        
        // 支持多关键词搜索
        return searchTerms.every(term => searchableText.includes(term))
      }).sort((a, b) => {
        // 按相关性排序：标题匹配优先
        const aTitle = a.title.toLowerCase().includes(lowercaseQuery)
        const bTitle = b.title.toLowerCase().includes(lowercaseQuery)
        
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        
        // 按发布日期排序
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      })
    }, 60000) // 缓存1分钟
  } catch (error) {
    console.error('搜索文章失败:', { query, error })
    return []
  }
}

// 获取分类统计
export function getCategoryStats(): Record<string, number> {
  return getCachedData('category_stats', () => {
    try {
      const publishedPosts = getPublishedPosts()
      const stats: Record<string, number> = {}
      
      publishedPosts.forEach(post => {
        if (post.category) {
          stats[post.category] = (stats[post.category] || 0) + 1
        }
      })
      
      return stats
    } catch (error) {
      console.error('获取分类统计失败:', error)
      return {}
    }
  }, 600000)
}

// 获取标签统计
export function getTagStats(): Record<string, number> {
  return getCachedData('tag_stats', () => {
    try {
      const publishedPosts = getPublishedPosts()
      const stats: Record<string, number> = {}
      
      publishedPosts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            stats[tag] = (stats[tag] || 0) + 1
          })
        }
      })
      
      return stats
    } catch (error) {
      console.error('获取标签统计失败:', error)
      return {}
    }
  }, 600000)
}

// 清除缓存
export function clearCache(): void {
  cache.clear()
  console.info('数据缓存已清除')
}

// 获取缓存状态
export function getCacheStatus(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  }
}
// 博客文章类型
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  publishDate: string;
  lastEditTime: string;
  status: 'published' | 'draft';
  coverImage?: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  description?: string;
  postCount: number;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  postCount: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 博客统计类型
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  lastUpdated: string;
}

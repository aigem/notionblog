'use client';

import { lazy, Suspense } from 'react';

// 懒加载搜索组件
const SearchComponent = lazy(() => import('./SearchComponent'));

interface LazySearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function LazySearch({ onSearch, placeholder = "搜索文章..." }: LazySearchProps) {
  return (
    <Suspense 
      fallback={
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent animate-pulse"
            disabled
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      }
    >
      <SearchComponent onSearch={onSearch} placeholder={placeholder} />
    </Suspense>
  );
}
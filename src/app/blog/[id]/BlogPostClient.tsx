'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import Comments from '@/components/Comments';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface BlogPostClientProps {
  post: BlogPost;
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export default function BlogPostClient({ post, prevPost, nextPost }: BlogPostClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  // 阅读进度计算
  useEffect(() => {
    const updateReadingProgress = () => {
      try {
        // 添加安全检查
        if (typeof window === 'undefined' || !document.documentElement) {
          return;
        }
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 防止除零错误
        if (docHeight <= 0) {
          setReadingProgress(0);
          return;
        }
        
        const progress = (scrollTop / docHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } catch (error) {
        console.warn('Error calculating reading progress:', error);
        // 发生错误时设置为0，避免显示异常
        setReadingProgress(0);
      }
    };

    // 添加延迟，确保DOM完全加载
    const timeoutId = setTimeout(() => {
      updateReadingProgress();
      window.addEventListener('scroll', updateReadingProgress);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', updateReadingProgress);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 500; // 中文阅读速度
    const wordCount = content.length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case 'wechat':
        // 微信分享需要特殊处理，这里只是复制链接
        navigator.clipboard.writeText(url);
        alert('链接已复制到剪贴板，可以在微信中分享');
        return;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 返回按钮 */}
      <div className="fixed top-4 left-2 sm:left-4 z-40">
        <Link 
          href="/blog"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">返回博客</span>
          <span className="sm:hidden">返回</span>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 文章头部 */}
        <header className="mb-6 sm:mb-8">
          {/* 封面图片 */}
        {post.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={post.coverImage}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
                loading="eager"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}

          {/* 分类和标签 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {post.category && (
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
            )}
            {post.tags && post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs sm:text-sm font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* 文章元信息 */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.publishDate}>
                {formatDate(post.publishDate)}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>约 {estimateReadingTime(post.content)} 分钟阅读</span>
            </div>

          </div>

          {/* 摘要 */}
          {post.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6 sm:mb-8 rounded-r-lg">
              <p className="text-blue-800 text-base sm:text-lg leading-relaxed italic">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-8 sm:mb-12">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-12">
            <MarkdownRenderer 
              content={post.content} 
              className="text-sm sm:text-base"
            />
          </div>
        </div>

        {/* 社交分享 */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">分享这篇文章</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => sharePost('weibo')}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.586 21.414c-4.686-4.686-4.686-12.284 0-16.97L12 2.03l2.414 2.414c4.686 4.686 4.686 12.284 0 16.97L12 23.828l-2.414-2.414z"/>
              </svg>
              微博
            </button>
            
            <button
              onClick={() => sharePost('wechat')}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm7 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
              </svg>
              微信
            </button>
            
            <button
              onClick={() => sharePost('qq')}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              QQ
            </button>
          </div>
        </div>

        {/* 文章导航 */}
        <nav className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
            {/* 上一篇 */}
            <div>
              {prevPost ? (
                <div className="group p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-500">上一篇</span>
                  </div>
                  <Link 
                    href={`/blog/${prevPost.id}`}
                    className="font-medium text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 block"
                  >
                    {prevPost.title}
                  </Link>
                </div>
              ) : (
                <div className="p-3 sm:p-4 border border-gray-100 rounded-lg text-gray-400">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs sm:text-sm">上一篇</span>
                  </div>
                  <p className="font-medium text-sm sm:text-base">没有更多文章了</p>
                </div>
              )}
            </div>

            {/* 下一篇 */}
            <div>
              {nextPost ? (
                <div className="group p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-end gap-2 sm:gap-3 mb-2">
                    <span className="text-xs sm:text-sm text-gray-500">下一篇</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <Link 
                    href={`/blog/${nextPost.id}`}
                    className="font-medium text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 text-right block"
                  >
                    {nextPost.title}
                  </Link>
                </div>
              ) : (
                <div className="p-3 sm:p-4 border border-gray-100 rounded-lg text-gray-400">
                  <div className="flex items-center justify-end gap-2 sm:gap-3 mb-2">
                    <span className="text-xs sm:text-sm">下一篇</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-sm sm:text-base text-right">没有更多文章了</p>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* 评论区域 */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
          <Comments postId={post.id} postTitle={post.title} />
        </div>
      </article>
    </div>
  );
}
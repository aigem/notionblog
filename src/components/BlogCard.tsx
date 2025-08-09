import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 根据变体类型设置不同的样式
  const getCardStyles = () => {
    switch (variant) {
      case 'featured':
        return 'group theme-card hover:theme-glow-sm transform hover:-translate-y-1 h-full flex flex-col overflow-hidden rounded-xl';
      case 'compact':
        return 'group theme-card hover:theme-shadow transform hover:-translate-y-0.5 h-full flex flex-col overflow-hidden';
      default:
        return 'group theme-card hover:theme-shadow transform hover:-translate-y-0.5 h-full flex flex-col overflow-hidden';
    }
  };

  const getImageStyles = () => {
    switch (variant) {
      case 'featured':
        return 'w-full h-64 object-cover group-hover:scale-105 theme-transition-slow';
      case 'compact':
        return 'w-full h-40 object-cover group-hover:scale-102 theme-transition';
      default:
        return 'w-full h-48 object-cover group-hover:scale-105 theme-transition-slow';
    }
  };

  const getContentPadding = () => {
    switch (variant) {
      case 'featured':
        return 'p-8';
      case 'compact':
        return 'p-4';
      default:
        return 'p-6';
    }
  };

  return (
    <Link href={`/blog/${post.id}`} className="block">
      <article className={getCardStyles()}>
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="relative overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={variant === 'featured' ? 256 : variant === 'compact' ? 160 : 192}
              className={getImageStyles()}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            {/* 图片遮罩层 */}
            <div className="absolute inset-0 bg-background opacity-0 group-hover:opacity-10 theme-transition"></div>
          </div>
        )}

        {/* 内容区域 */}
        <div className={`${getContentPadding()} flex-1 flex flex-col`}>
          {/* 分类和标签 */}
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-tertiary text-text-primary group-hover:bg-primary group-hover:text-background theme-transition">
                {post.category}
              </span>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background theme-transition"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background-tertiary text-text-muted">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 标题 */}
          <h3 className={`font-bold text-text-primary group-hover:theme-text-gradient theme-transition mb-3 ${
            variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
          }`}>
            {variant === 'compact' ? truncateText(post.title, 50) : post.title}
          </h3>

          {/* 摘要 */}
          {post.summary && variant !== 'compact' && (
            <p className="text-text-secondary mb-4 leading-relaxed">
              {truncateText(post.summary, variant === 'featured' ? 150 : 120)}
            </p>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-sm text-text-muted">
            <div className="flex items-center gap-4">
              {/* 发布日期 */}
              <time dateTime={post.publishDate} className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.publishDate)}
              </time>

              {/* 阅读时间估算 */}
              {post.content && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {Math.ceil(post.content.length / 500)} 分钟阅读
                </span>
              )}
            </div>

            {/* 阅读更多指示器 */}
            <div className="flex items-center gap-1 text-primary group-hover:text-accent font-medium theme-transition">
              <span>阅读更多</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 悬停时的底部边框效果 */}
        <div className="h-1 theme-gradient transform scale-x-0 group-hover:scale-x-100 theme-transition-slow origin-left"></div>
      </article>
    </Link>
  );
}

import { Metadata } from 'next';
import { BlogPost } from './types';

// 网站基础信息
export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Dream Blog',
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'Dream Blog'} - 个人生活记录博客`,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '基于 Notion API 的现代化个人生活记录博客系统，记录生活点滴，分享技术心得',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME || '博主',
    email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'admin@dreamblog.com',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about`
  },
  keywords: process.env.NEXT_PUBLIC_KEYWORDS ? process.env.NEXT_PUBLIC_KEYWORDS.split(',') : ['博客', '生活记录', 'Notion', 'Next.js', '技术分享', '个人网站'],
  language: 'zh-CN',
  locale: 'zh_CN',
  type: 'website',
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@dreamblog',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || ''
  },
  features: {
    comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  }
};

// 生成基础 metadata
export function generateBaseMetadata(): Metadata {
  return {
    title: {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: SITE_CONFIG.url,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      images: ['/og-image.png'],
      creator: SITE_CONFIG.social.twitter
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    }
  };
}

// 生成文章页面 metadata
export function generateArticleMetadata(post: BlogPost): Metadata {
  const url = `${SITE_CONFIG.url}/blog/${post.id}`;
  const publishedTime = post.publishDate;
  const modifiedTime = post.lastEditTime || publishedTime;

  return {
    title: post.title,
    description: post.summary || `阅读关于"${post.title}"的文章`,
    keywords: [...SITE_CONFIG.keywords, ...(post.tags || [])],
    authors: [{ name: SITE_CONFIG.author.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: SITE_CONFIG.locale,
      url,
      title: post.title,
      description: post.summary || `阅读关于"${post.title}"的文章`,
      siteName: SITE_CONFIG.name,
      publishedTime,
      modifiedTime,
      authors: [SITE_CONFIG.author.name],
      tags: post.tags,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || `阅读关于"${post.title}"的文章`,
      images: [post.coverImage || '/og-image.png'],
      creator: '@dreamblog'
    }
  };
}

// 生成分类页面 metadata
export function generateCategoryMetadata(category: string, count: number): Metadata {
  const url = `${SITE_CONFIG.url}/category/${encodeURIComponent(category)}`;
  const title = `${category} - 分类文章`;
  const description = `浏览 ${category} 分类下的 ${count} 篇文章，发现更多精彩内容`;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, category, '分类', '文章列表'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png']
    }
  };
}

// 生成标签页面 metadata
export function generateTagMetadata(tag: string, count: number): Metadata {
  const url = `${SITE_CONFIG.url}/tag/${encodeURIComponent(tag)}`;
  const title = `${tag} - 标签文章`;
  const description = `浏览 ${tag} 标签下的 ${count} 篇文章，探索相关主题内容`;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, tag, '标签', '文章列表'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png']
    }
  };
}

// 生成搜索页面 metadata
export function generateSearchMetadata(query?: string): Metadata {
  const url = `${SITE_CONFIG.url}/search`;
  const title = query ? `搜索: ${query}` : '搜索文章';
  const description = query 
    ? `搜索关于"${query}"的文章，发现相关内容` 
    : '搜索博客文章，找到您感兴趣的内容';

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, '搜索', '查找文章'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png']
    },
    robots: {
      index: false, // 搜索页面通常不需要被索引
      follow: true
    }
  };
}

// 生成结构化数据
export function generateArticleJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.coverImage || `${SITE_CONFIG.url}/og-image.png`,
    datePublished: post.publishDate,
    dateModified: post.lastEditTime || post.publishDate,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.id}`
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    wordCount: post.content?.length || 0,
    inLanguage: SITE_CONFIG.language
  };
}

// 生成网站结构化数据
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url
    },
    inLanguage: SITE_CONFIG.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// 生成面包屑结构化数据
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
// 应用配置管理
export const APP_CONFIG = {
  // 功能开关
  features: {
    comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  
  // 社交媒体链接
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
  },
  
  // 网站基础信息
  site: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Dream Blog',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '基于 Notion API 的现代化个人生活记录博客系统',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    author: {
      name: process.env.NEXT_PUBLIC_AUTHOR_NAME || '博主',
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'admin@dreamblog.com',
    },
    keywords: process.env.NEXT_PUBLIC_KEYWORDS ? 
      process.env.NEXT_PUBLIC_KEYWORDS.split(',').map(k => k.trim()) : 
      ['博客', '生活记录', 'Notion', 'Next.js', '技术分享', '个人网站'],
  },
  
  // SEO 配置
  seo: {
    googleVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  }
};

// 检查功能是否启用的辅助函数
export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.features): boolean => {
  return APP_CONFIG.features[feature];
};

// 获取社交媒体链接的辅助函数
export const getSocialLink = (platform: keyof typeof APP_CONFIG.social): string => {
  return APP_CONFIG.social[platform];
};
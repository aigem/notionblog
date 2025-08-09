import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/lib/seo'

export const dynamic = 'force-static'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# 允许搜索引擎访问所有页面
Allow: /blog
Allow: /search
Allow: /about

# 禁止访问API路由和私有文件
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /.env*

# 站点地图位置
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# 爬取延迟（可选）
Crawl-delay: 1`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  })
}
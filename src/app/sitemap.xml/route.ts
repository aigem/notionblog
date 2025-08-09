import { NextResponse } from 'next/server'
import { getPublishedPosts, getAllCategories, getAllTags } from '@/lib/data'
import { SITE_CONFIG } from '@/lib/seo'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getPublishedPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${SITE_CONFIG.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 博客列表页 -->
  <url>
    <loc>${SITE_CONFIG.url}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 搜索页 -->
  <url>
    <loc>${SITE_CONFIG.url}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 关于页 -->
  <url>
    <loc>${SITE_CONFIG.url}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- 博客文章 -->
  ${posts.map(post => `
  <url>
    <loc>${SITE_CONFIG.url}/blog/${post.id}</loc>
    <lastmod>${new Date(post.publishDate).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- 分类页面 -->
  ${categories.map(category => `
  <url>
    <loc>${SITE_CONFIG.url}/blog?category=${encodeURIComponent(category)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
  
  <!-- 标签页面 -->
  ${tags.map(tag => `
  <url>
    <loc>${SITE_CONFIG.url}/blog?tag=${encodeURIComponent(tag)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
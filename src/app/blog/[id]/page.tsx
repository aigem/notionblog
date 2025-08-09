import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostById, getPublishedPosts } from '@/lib/data'
import { generateArticleMetadata, generateArticleJsonLd } from '@/lib/seo'
import type { BlogPost } from '@/lib/types'
import BlogPostClient from './BlogPostClient'

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = getPostById(resolvedParams.id)
  
  if (!post) {
    return {
      title: '文章未找到 - Dream Blog',
      description: '抱歉，您访问的文章不存在。'
    }
  }

  return generateArticleMetadata(post)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = getPostById(resolvedParams.id)
  
  if (!post) {
    notFound()
  }

  const allPosts = getPublishedPosts()
  
  // 获取相邻文章
  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  // 生成结构化数据
  const blogPostJsonLd = generateArticleJsonLd(post)

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      
      {/* 客户端组件 */}
      <BlogPostClient 
        post={post} 
        prevPost={prevPost} 
        nextPost={nextPost} 
      />
    </>
  )
}

// 生成静态路径
export async function generateStaticParams() {
  const posts = getPublishedPosts()
  
  return posts.map((post) => ({
    id: post.id,
  }))
}
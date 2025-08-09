import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/notion';

// 静态导出配置
export const dynamic = 'force-static';

export async function GET() {
  try {
    const posts = await getPublishedPosts();
    
    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json({
      success: false,
      message: '获取文章列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
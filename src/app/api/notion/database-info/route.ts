import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// 静态导出配置
export const dynamic = 'force-static';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export async function GET() {
  try {
    // 获取数据库信息
    const database = await notion.databases.retrieve({ 
      database_id: DATABASE_ID 
    });

    // 获取数据库中的页面（不使用过滤器和排序）
    const pages = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 5 // 只获取前5条记录用于测试
    });

    return NextResponse.json({
      success: true,
      database: {
        title: (database as any).title,
        properties: database.properties
      },
      pages: {
        count: pages.results.length,
        results: pages.results.map((page: any) => ({
          id: page.id,
          properties: page.properties,
          created_time: page.created_time,
          last_edited_time: page.last_edited_time
        }))
      }
    });
  } catch (error: any) {
    console.error('获取数据库信息失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
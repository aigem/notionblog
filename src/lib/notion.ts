import { Client } from '@notionhq/client';

// 初始化Notion客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notion数据库ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

// 博客文章类型定义
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  publishDate: string;
  lastEditTime: string;
  status: 'published' | 'draft';
  coverImage?: string;
}

// 获取所有已发布的博客文章
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: '发布状态',
        select: {
          equals: '已发布'
        }
      },
      sorts: [
        {
          property: '发布日期',
          direction: 'descending'
        }
      ]
    });

    return response.results.map(page => formatNotionPage(page));
  } catch (error) {
    console.error('获取博客文章失败:', error);
    return [];
  }
}

// 根据ID获取单篇文章
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    return formatNotionPage(page);
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}

// 获取文章内容
export async function getPageContent(pageId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });
    return response.results;
  } catch (error) {
    console.error('获取页面内容失败:', error);
    return [];
  }
}

// 格式化Notion页面数据
function formatNotionPage(page: any): BlogPost {
  const properties = page.properties;
  
  return {
    id: page.id,
    title: properties.标题?.title?.[0]?.plain_text || '无标题',
    content: properties.内容?.rich_text?.[0]?.plain_text || '',
    summary: properties.摘要?.rich_text?.[0]?.plain_text || '',
    tags: properties.标签?.multi_select?.map((tag: any) => tag.name) || [],
    category: properties.分类?.select?.name || '未分类',
    publishDate: properties.发布日期?.date?.start || '',
    lastEditTime: page.last_edited_time,
    status: properties.发布状态?.select?.name === '已发布' ? 'published' : 'draft',
    coverImage: properties.封面图片?.url || ''
  };
}

// 测试Notion连接
export async function testNotionConnection(): Promise<boolean> {
  try {
    await notion.databases.retrieve({ database_id: DATABASE_ID });
    return true;
  } catch (error) {
    console.error('Notion连接测试失败:', error);
    return false;
  }
}
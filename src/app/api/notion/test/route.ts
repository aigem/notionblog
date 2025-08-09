import { NextResponse } from 'next/server';
import { testNotionConnection } from '@/lib/notion';

export const dynamic = 'force-static'

export async function GET() {
  try {
    const isConnected = await testNotionConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Notion API连接成功',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Notion API连接失败，请检查配置'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API测试错误:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
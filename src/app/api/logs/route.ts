import { NextRequest, NextResponse } from 'next/server'

// 静态导出配置
export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { level, message, data, timestamp } = body

    // 在开发环境中直接输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '')
      return NextResponse.json({ success: true })
    }

    // 在生产环境中，这里可以集成真实的日志服务
    // 例如：Winston, Pino, 或者发送到外部服务如 Sentry, LogRocket 等
    
    // 简单的文件日志记录（仅作示例）
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    }

    // 这里可以写入文件或发送到日志服务
    console.log('生产环境日志:', JSON.stringify(logEntry, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('日志记录失败:', error)
    return NextResponse.json(
      { success: false, error: '日志记录失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: '日志API正常运行' },
    { status: 200 }
  )
}
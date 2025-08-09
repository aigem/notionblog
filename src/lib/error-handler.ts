import { logger } from './logger'

// 自定义错误类型
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly timestamp: string

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()

    Error.captureStackTrace(this, this.constructor)
  }
}

// 数据获取错误
export class DataFetchError extends AppError {
  constructor(message: string = '数据获取失败') {
    super(message, 500)
  }
}

// 文章未找到错误
export class PostNotFoundError extends AppError {
  constructor(id: string) {
    super(`文章未找到: ${id}`, 404)
  }
}

// 搜索错误
export class SearchError extends AppError {
  constructor(message: string = '搜索功能异常') {
    super(message, 500)
  }
}

// 错误处理函数
export function handleError(error: unknown, context?: string): AppError {
  let appError: AppError

  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message || '未知错误',
      500,
      false
    )
    appError.stack = error.stack
  } else {
    appError = new AppError(
      '系统发生未知错误',
      500,
      false
    )
  }

  // 记录错误日志
  logger.error(`错误处理 ${context ? `[${context}]` : ''}`, {
    message: appError.message,
    statusCode: appError.statusCode,
    isOperational: appError.isOperational,
    stack: appError.stack,
    timestamp: appError.timestamp
  })

  return appError
}

// 异步错误处理包装器
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, context)
      return null
    }
  }
}

// 同步错误处理包装器
export function withSyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  context?: string,
  fallback?: R
) {
  return (...args: T): R | typeof fallback => {
    try {
      return fn(...args)
    } catch (error) {
      handleError(error, context)
      return fallback as R
    }
  }
}

// 错误边界错误处理
export function handleBoundaryError(error: Error, errorInfo: any): void {
  logger.error('React错误边界捕获错误', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString()
  })

  // 在生产环境中发送错误报告
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    reportErrorToService(error, errorInfo)
  }
}

// 发送错误报告到服务
async function reportErrorToService(error: Error, errorInfo?: any): Promise<void> {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level: 'error',
        message: error.message,
        data: {
          stack: error.stack,
          errorInfo,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })
    })
  } catch (reportError) {
    logger.error('发送错误报告失败', reportError)
  }
}

// 全局未捕获错误处理
export function setupGlobalErrorHandlers(): void {
  if (typeof window !== 'undefined') {
    // 处理未捕获的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('未处理的Promise拒绝', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString()
      })
      
      // 阻止默认的控制台错误输出
      event.preventDefault()
    })

    // 处理未捕获的JavaScript错误
    window.addEventListener('error', (event) => {
      logger.error('未捕获的JavaScript错误', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      })
    })
  }
}

// 错误恢复策略
export const errorRecoveryStrategies = {
  // 数据获取失败时的恢复策略
  dataFetch: {
    retry: async <T>(
      fn: () => Promise<T>,
      maxRetries: number = 3,
      delay: number = 1000
    ): Promise<T | null> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn()
        } catch (error) {
          if (i === maxRetries - 1) {
            logger.error(`数据获取重试失败，已达到最大重试次数 ${maxRetries}`, error)
            return null
          }
          
          logger.warn(`数据获取失败，正在重试 (${i + 1}/${maxRetries})`, error)
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
      }
      return null
    }
  },

  // 缓存降级策略
  cache: {
    fallbackToCache: <T>(cacheKey: string, fallbackValue: T): T => {
      try {
        const cached = localStorage.getItem(cacheKey)
        return cached ? JSON.parse(cached) : fallbackValue
      } catch (error) {
        logger.warn('缓存读取失败，使用默认值', { cacheKey, error })
        return fallbackValue
      }
    }
  }
}
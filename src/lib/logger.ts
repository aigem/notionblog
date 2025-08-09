// 简化的日志记录工具
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
    }
    
    return `${prefix} ${message}`
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, data))
    }
  }

  info(message: string, data?: any): void {
    console.info(this.formatMessage('info', message, data))
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data))
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage('error', message, data))
    
    // 在生产环境中，可以发送错误到监控服务
    if (!this.isDevelopment && typeof window !== 'undefined') {
      this.sendErrorToService(message, data)
    }
  }

  private async sendErrorToService(message: string, data?: any): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 'error',
          message,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      // 静默处理日志发送失败
      console.error('发送日志失败:', error)
    }
  }
}

export const logger = new Logger()
/**
 * 性能监控和错误追踪配置
 * 用于生产环境的性能监控和错误报告
 */

// 性能监控接口
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

// 错误报告接口
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

class PerformanceMonitor {
  private isProduction: boolean;
  private apiEndpoint: string;
  private sampleRate: number;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.apiEndpoint = process.env.NEXT_PUBLIC_MONITORING_ENDPOINT || '';
    this.sampleRate = parseFloat(process.env.NEXT_PUBLIC_SAMPLE_RATE || '0.1');
  }

  /**
   * 初始化性能监控
   */
  init(): void {
    if (!this.isProduction || typeof window === 'undefined') {
      return;
    }

    // 监听页面加载性能
    this.observePageLoad();
    
    // 监听导航性能
    this.observeNavigation();
    
    // 监听资源加载性能
    this.observeResources();
    
    // 监听Core Web Vitals
    this.observeCoreWebVitals();
    
    // 监听错误
    this.observeErrors();
  }

  /**
   * 监听页面加载性能
   */
  private observePageLoad(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.reportMetric({
            name: 'page_load_time',
            value: navigation.loadEventEnd - navigation.fetchStart,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });

          this.reportMetric({
            name: 'dom_content_loaded',
            value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      }, 0);
    });
  }

  /**
   * 监听导航性能
   */
  private observeNavigation(): void {
    // 使用 Navigation API 或 History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.trackNavigation('pushState');
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.trackNavigation('replaceState');
      return originalReplaceState.apply(history, args);
    };

    window.addEventListener('popstate', () => {
      this.trackNavigation('popstate');
    });
  }

  /**
   * 监听资源加载性能
   */
  private observeResources(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // 只监控关键资源
          if (this.isKeyResource(resourceEntry.name)) {
            this.reportMetric({
              name: 'resource_load_time',
              value: resourceEntry.responseEnd - resourceEntry.fetchStart,
              timestamp: Date.now(),
              url: resourceEntry.name,
              userAgent: navigator.userAgent,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * 监听 Core Web Vitals
   */
  private observeCoreWebVitals(): void {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.reportMetric({
        name: 'largest_contentful_paint',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const eventEntry = entry as any; // 类型断言，因为 processingStart 只在特定的性能条目中存在
        this.reportMetric({
          name: 'first_input_delay',
          value: eventEntry.processingStart ? eventEntry.processingStart - entry.startTime : entry.duration || 0,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      });
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // 页面卸载时报告 CLS
    window.addEventListener('beforeunload', () => {
      this.reportMetric({
        name: 'cumulative_layout_shift',
        value: clsValue,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * 监听错误
   */
  private observeErrors(): void {
    // JavaScript 错误
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // Promise 拒绝错误
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * 跟踪导航
   */
  private trackNavigation(type: string): void {
    const startTime = performance.now();
    
    // 使用 requestIdleCallback 或 setTimeout 来测量导航时间
    const measureNavigation = () => {
      const endTime = performance.now();
      this.reportMetric({
        name: 'navigation_time',
        value: endTime - startTime,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(measureNavigation);
    } else {
      setTimeout(measureNavigation, 0);
    }
  }

  /**
   * 判断是否为关键资源
   */
  private isKeyResource(url: string): boolean {
    return (
      url.includes('.js') ||
      url.includes('.css') ||
      url.includes('.woff') ||
      url.includes('.woff2') ||
      url.includes('/_next/static/')
    );
  }

  /**
   * 报告性能指标
   */
  private reportMetric(metric: PerformanceMetric): void {
    if (!this.shouldSample()) {
      return;
    }

    if (this.apiEndpoint) {
      // 发送到监控服务
      fetch(`${this.apiEndpoint}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch((error) => {
        console.warn('Failed to report metric:', error);
      });
    }

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric);
    }
  }

  /**
   * 报告错误
   */
  private reportError(error: ErrorReport): void {
    if (this.apiEndpoint) {
      fetch(`${this.apiEndpoint}/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      }).catch((err) => {
        console.warn('Failed to report error:', err);
      });
    }

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', error);
    }
  }

  /**
   * 采样判断
   */
  private shouldSample(): boolean {
    return Math.random() < this.sampleRate;
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 自动初始化
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}

// 导出用于手动使用的函数
export const trackCustomMetric = (name: string, value: number) => {
  performanceMonitor['reportMetric']({
    name,
    value,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  });
};

export const trackCustomError = (message: string, stack?: string) => {
  performanceMonitor['reportError']({
    message,
    stack,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  });
};
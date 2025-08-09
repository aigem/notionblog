// 性能优化工具函数

/**
 * 生成模糊占位符数据URL
 */
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>`
  ).toString('base64')}`;
};

/**
 * 图片尺寸优化配置
 */
export const imageConfig = {
  blogCard: {
    default: { width: 400, height: 192 },
    featured: { width: 400, height: 256 },
    compact: { width: 400, height: 160 }
  },
  blogDetail: {
    cover: { width: 800, height: 400 }
  }
};

/**
 * 防抖函数 - 用于搜索输入优化
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数 - 用于滚动事件优化
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 懒加载观察器配置
 */
export const lazyLoadConfig = {
  rootMargin: '50px 0px',
  threshold: 0.1
};

/**
 * 预加载关键资源
 */
export const preloadCriticalResources = () => {
  // 预加载关键字体
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = '/fonts/inter-var.woff2';
  document.head.appendChild(fontLink);
};

/**
 * 内存优化 - 清理未使用的数据
 */
export const cleanupMemory = () => {
  // 清理本地存储中的过期数据
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('search_history_')) {
      const timestamp = parseInt(key.split('_')[2]);
      if (now - timestamp > maxAge) {
        localStorage.removeItem(key);
      }
    }
  });
};

/**
 * 性能监控
 */
export const performanceMonitor = {
  // 测量页面加载时间
  measurePageLoad: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    }
    return null;
  },

  // 测量组件渲染时间
  measureRender: (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    console.log(`${componentName} 渲染时间: ${(end - start).toFixed(2)}ms`);
  }
};

/**
 * 缓存管理
 */
export const cacheManager = {
  // 设置缓存
  set: (key: string, data: any, ttl: number = 3600000) => { // 默认1小时
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  // 获取缓存
  get: (key: string) => {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;

    const { data, timestamp, ttl } = JSON.parse(item);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return data;
  },

  // 清除缓存
  clear: (key?: string) => {
    if (key) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('cache_')) {
          localStorage.removeItem(k);
        }
      });
    }
  }
};
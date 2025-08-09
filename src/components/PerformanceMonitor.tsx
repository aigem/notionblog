'use client';

import { useEffect } from 'react';
import { trackCustomMetric } from '@/lib/monitoring';

interface PerformanceMonitorProps {
  pageName: string;
}

export default function PerformanceMonitor({ pageName }: PerformanceMonitorProps) {
  useEffect(() => {
    // 监控页面加载性能
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart,
            firstPaint: 0,
            firstContentfulPaint: 0
          };

          // 获取绘制时间
          const paintEntries = performance.getEntriesByType('paint');
          paintEntries.forEach((entry) => {
            if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
          });

          console.log(`${pageName} 页面性能指标:`, {
            页面: pageName,
            DOM内容加载时间: `${metrics.domContentLoaded.toFixed(2)}ms`,
            完全加载时间: `${metrics.loadComplete.toFixed(2)}ms`,
            首次绘制: `${metrics.firstPaint.toFixed(2)}ms`,
            首次内容绘制: `${metrics.firstContentfulPaint.toFixed(2)}ms`
          });

          // 使用监控系统记录指标
          trackCustomMetric(`${pageName}_dom_content_loaded`, metrics.domContentLoaded);
          trackCustomMetric(`${pageName}_load_complete`, metrics.loadComplete);
          trackCustomMetric(`${pageName}_first_contentful_paint`, metrics.firstContentfulPaint);

          // 性能警告
          if (metrics.firstContentfulPaint > 2000) {
            console.warn(`⚠️ ${pageName} 首次内容绘制时间过长: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
          }
          
          if (metrics.loadComplete > 3000) {
            console.warn(`⚠️ ${pageName} 完全加载时间过长: ${metrics.loadComplete.toFixed(2)}ms`);
          }
        }
      }
    };

    // 页面加载完成后测量性能
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [pageName]);

  // 在开发环境下显示性能信息
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
        性能监控: {pageName}
      </div>
    );
  }

  return null;
}

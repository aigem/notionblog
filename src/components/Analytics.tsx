'use client'

import { isFeatureEnabled } from '@/lib/config'
import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    // 只有在启用分析功能时才加载分析脚本
    if (isFeatureEnabled('analytics')) {
      console.log('Analytics enabled - would load analytics script here')
      // 这里可以添加 Google Analytics, 百度统计等分析代码
      // 例如：
      // gtag('config', 'GA_MEASUREMENT_ID')
    }
  }, [])

  // 如果分析功能未启用，不渲染任何内容
  if (!isFeatureEnabled('analytics')) {
    return null
  }

  return (
    <>
      {/* 这里可以放置分析相关的组件，比如 Google Analytics 脚本 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Analytics Enabled
        </div>
      )}
    </>
  )
}
import { ThemeConfig } from '@/types/theme';

/**
 * 主题模板 - 用于创建新主题的基础模板
 * 复制此文件并修改配置来创建你的自定义主题
 */

const customTheme: ThemeConfig = {
  // 基础信息
  name: 'custom-theme', // 主题名称，用于文件夹名和环境变量
  displayName: '自定义主题', // 显示名称
  description: '这是一个自定义主题的描述', // 主题描述
  isDark: false, // 是否为深色主题

  // 颜色配置
  colors: {
    // 主色调 - 用于按钮、链接等主要元素
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    
    // 次要颜色 - 用于次要元素
    secondary: '#64748b',
    
    // 强调色 - 用于特殊强调
    accent: '#8b5cf6',
    
    // 背景颜色系统
    background: '#ffffff',           // 主背景
    backgroundSecondary: '#f8fafc',  // 次要背景（卡片等）
    backgroundTertiary: '#f1f5f9',   // 第三级背景（输入框等）
    
    // 文本颜色系统
    textPrimary: '#0f172a',     // 主要文本
    textSecondary: '#334155',   // 次要文本
    textMuted: '#64748b',       // 弱化文本
    
    // 边框颜色
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    
    // 状态颜色
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    
    // 特效颜色
    glow: '#3b82f6',                    // 发光效果颜色
    shadow: 'rgba(15, 23, 42, 0.1)',   // 阴影颜色
  },

  // 字体配置
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // 间距配置
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },

  // 圆角配置
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  // 动画配置
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export default customTheme;

/**
 * 主题创建指南：
 * 
 * 1. 复制此模板文件到新的主题文件夹：
 *    src/themes/your-theme-name/config.ts
 * 
 * 2. 修改主题配置：
 *    - name: 设置为你的主题文件夹名
 *    - displayName: 设置用户友好的显示名称
 *    - description: 添加主题描述
 *    - isDark: 根据主题类型设置
 *    - colors: 自定义颜色方案
 * 
 * 3. 在 themeLoader.ts 中添加你的主题到可用主题列表
 * 
 * 4. 在 .env.local 中设置 NEXT_PUBLIC_THEME=your-theme-name 来测试
 * 
 * 5. 颜色设计建议：
 *    - 确保文本和背景有足够的对比度
 *    - primary 和 accent 颜色应该和谐搭配
 *    - 深色主题使用较暗的背景色和较亮的文本色
 *    - 浅色主题使用较亮的背景色和较暗的文本色
 * 
 * 6. 测试你的主题：
 *    - 检查所有组件的显示效果
 *    - 验证深色/浅色模式的切换
 *    - 确保响应式设计正常工作
 */
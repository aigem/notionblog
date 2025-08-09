import { ThemeConfig } from '@/types/theme';

const cyberCoolTheme: ThemeConfig = {
  name: 'cyber-cool',
  displayName: '简约酷炫',
  description: '深色背景配霓虹蓝紫渐变的现代化主题，适合夜间阅读和酷炫展示',
  isDark: true,
  colors: {
    // 主色调：优化的霓虹蓝
    primary: '#00f5ff',
    primaryHover: '#00e1ff',
    secondary: '#718096',
    accent: '#a855f7',
    
    // 深色背景系统 - 更加层次分明
    background: '#0d1117',
    backgroundSecondary: '#161b22',
    backgroundTertiary: '#21262d',
    
    // 文本颜色 - 更好的对比度
    textPrimary: '#f0f6fc',
    textSecondary: '#c9d1d9',
    textMuted: '#8b949e',
    
    // 边框颜色 - 更加协调
    border: '#30363d',
    borderHover: '#484f58',
    
    // 状态颜色 - 更加和谐
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    
    // 特效颜色 - 增强发光效果
    glow: '#00f5ff',
    shadow: 'rgba(0, 245, 255, 0.25)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
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
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  radius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  animation: {
    duration: {
      fast: '200ms',
      normal: '350ms',
      slow: '600ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export default cyberCoolTheme;
import { ThemeConfig } from '@/types/theme';

const defaultTheme: ThemeConfig = {
  name: 'default',
  displayName: '默认主题',
  description: '经典的浅色主题，适合日常阅读，现代化设计风格',
  isDark: false,
  colors: {
    // 主色调 - 更加现代的蓝色
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    
    // 背景系统 - 更加柔和
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    // 文本系统 - 更好的层次感
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    
    // 边框系统 - 更加精致
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    
    // 状态颜色 - 更加和谐
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // 特效颜色
    glow: '#3b82f6',
    shadow: 'rgba(17, 24, 39, 0.08)',
  },
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
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
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
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

export default defaultTheme;
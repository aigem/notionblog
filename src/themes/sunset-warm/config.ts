import { ThemeConfig } from '@/types/theme';

const sunsetWarmTheme: ThemeConfig = {
  name: 'sunset-warm',
  displayName: '温暖日落',
  description: '温暖的日落色调主题，橙红渐变配金色点缀，营造舒适的阅读氛围',
  isDark: false,
  colors: {
    // 主色调：温暖的橙红色
    primary: '#f97316',
    primaryHover: '#ea580c',
    secondary: '#78716c',
    accent: '#eab308',
    
    // 温暖的背景系统
    background: '#fefcfb',
    backgroundSecondary: '#fef7ed',
    backgroundTertiary: '#fed7aa',
    
    // 文本颜色 - 深棕色系
    textPrimary: '#431407',
    textSecondary: '#7c2d12',
    textMuted: '#a16207',
    
    // 边框颜色
    border: '#fdba74',
    borderHover: '#fb923c',
    
    // 状态颜色
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',
    
    // 特效颜色
    glow: '#f97316',
    shadow: 'rgba(249, 115, 22, 0.15)',
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

export default sunsetWarmTheme;
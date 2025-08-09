import { ThemeConfig } from '@/types/theme';

const techBlueTheme: ThemeConfig = {
  name: 'tech-blue',
  displayName: '科技蓝',
  description: '现代科技感的蓝色主题，适合技术博客和专业展示',
  isDark: false,
  
  colors: {
    // 主色调：科技蓝
    primary: '#1e40af',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    accent: '#0ea5e9',
    
    // 背景系统：清爽的蓝白色调
    background: '#f8fafc',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#e2e8f0',
    
    // 文本系统：深色文字确保可读性
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    
    // 边框系统：淡蓝色边框
    border: '#cbd5e1',
    borderHover: '#94a3b8',
    
    // 状态颜色：科技感配色
    success: '#0891b2',
    warning: '#0369a1',
    error: '#dc2626',
    
    // 特效颜色：蓝色发光
    glow: '#1e40af',
    shadow: 'rgba(30, 64, 175, 0.15)',
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

export default techBlueTheme;
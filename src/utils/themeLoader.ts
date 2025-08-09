import { ThemeConfig, ThemeName } from '@/types/theme';

// 主题加载器
export async function loadTheme(themeName: ThemeName): Promise<ThemeConfig> {
  try {
    // 动态导入主题配置
    const themeModule = await import(`@/themes/${themeName}/config`);
    return themeModule.default || themeModule.theme;
  } catch (error) {
    console.error(`Failed to load theme: ${themeName}`, error);
    
    // 如果加载失败且不是默认主题，则加载默认主题
    if (themeName !== 'default') {
      return loadTheme('default');
    }
    
    // 如果连默认主题都加载失败，返回一个基础主题
    return getBasicTheme();
  }
}

// 获取可用主题列表
export async function getAvailableThemes(): Promise<ThemeName[]> {
  // 在实际项目中，这里可以通过文件系统 API 或配置文件来获取
  // 目前先返回硬编码的主题列表
  return ['default', 'cyber-cool', 'sunset-warm', 'tech-blue'];
}

// 基础主题配置（作为后备方案）
function getBasicTheme(): ThemeConfig {
  return {
    name: 'basic',
    displayName: '基础主题',
    description: '系统基础主题',
    isDark: false,
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#6b7280',
      accent: '#8b5cf6',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      backgroundTertiary: '#f3f4f6',
      textPrimary: '#111827',
      textSecondary: '#374151',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      glow: '#3b82f6',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
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
}

// 验证主题配置的完整性
export function validateThemeConfig(theme: any): theme is ThemeConfig {
  const requiredFields = [
    'name', 'displayName', 'description', 'isDark',
    'colors', 'typography', 'spacing', 'radius', 'animation'
  ];
  
  return requiredFields.every(field => field in theme);
}

// 主题配置合并工具
export function mergeThemeConfig(baseTheme: ThemeConfig, overrides: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...baseTheme,
    ...overrides,
    colors: { ...baseTheme.colors, ...overrides.colors },
    typography: { ...baseTheme.typography, ...overrides.typography },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    radius: { ...baseTheme.radius, ...overrides.radius },
    animation: { ...baseTheme.animation, ...overrides.animation },
  };
}
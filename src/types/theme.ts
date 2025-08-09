// 主题配置接口定义
export interface ThemeColors {
  // 主要颜色
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  
  // 背景颜色
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // 文本颜色
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // 边框和分割线
  border: string;
  borderHover: string;
  
  // 状态颜色
  success: string;
  warning: string;
  error: string;
  
  // 特殊效果
  glow: string;
  shadow: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeAnimation {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  animation: ThemeAnimation;
  isDark: boolean;
}

export type ThemeName = string;

export interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
  isLoading: boolean;
}
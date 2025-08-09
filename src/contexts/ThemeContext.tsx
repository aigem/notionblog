'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, ThemeContextType, ThemeName } from '@/types/theme';
import { loadTheme, getAvailableThemes } from '@/utils/themeLoader';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme || 'default');
  const [availableThemes, setAvailableThemes] = useState<ThemeName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 应用 CSS 变量到文档根元素
  const applyCSSVariables = (theme: ThemeConfig) => {
    try {
      // 安全检查
      if (typeof document === 'undefined' || !document.documentElement) {
        return;
      }
      
      const root = document.documentElement;
      
      // 应用颜色变量
      Object.entries(theme.colors).forEach(([key, value]) => {
        try {
          root.style.setProperty(`--color-${key}`, value);
        } catch (error) {
          console.warn(`Error setting color variable --color-${key}:`, error);
        }
      });
    
    // 应用字体变量
    root.style.setProperty('--font-sans', theme.typography.fontFamily.sans.join(', '));
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono.join(', '));
    
    // 应用字体大小变量
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });
    
    // 应用字重变量
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
    
    // 应用行高变量
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--leading-${key}`, value);
    });
    
    // 应用间距变量
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // 应用圆角变量
    Object.entries(theme.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // 应用动画变量
    Object.entries(theme.animation.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });
    
    Object.entries(theme.animation.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value);
    });
    
    // 设置主题类名
    root.className = theme.isDark ? 'dark' : 'light';
    } catch (error) {
      console.error('Error applying CSS variables:', error);
    }
  };

  // 加载主题
  const loadAndApplyTheme = async (name: ThemeName) => {
    try {
      setIsLoading(true);
      const theme = await loadTheme(name);
      setCurrentTheme(theme);
      applyCSSVariables(theme);
      
      // 保存到 localStorage
      localStorage.setItem('selectedTheme', name);
    } catch (error) {
      console.error(`Failed to load theme: ${name}`, error);
      // 如果加载失败，尝试加载默认主题
      if (name !== 'default') {
        await loadAndApplyTheme('default');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 切换主题
  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    loadAndApplyTheme(name);
  };

  // 初始化
  useEffect(() => {
    const initializeTheme = async () => {
      // 获取可用主题列表
      const themes = await getAvailableThemes();
      setAvailableThemes(themes);
      
      // 确定要加载的主题
      let themeToLoad = defaultTheme || 'default';
      
      // 检查环境变量中的主题设置
      if (typeof window !== 'undefined') {
        const envTheme = process.env.NEXT_PUBLIC_THEME;
        if (envTheme && themes.includes(envTheme)) {
          themeToLoad = envTheme;
        } else {
          // 检查 localStorage 中保存的主题
          const savedTheme = localStorage.getItem('selectedTheme');
          if (savedTheme && themes.includes(savedTheme)) {
            themeToLoad = savedTheme;
          }
        }
      }
      
      setThemeName(themeToLoad);
      await loadAndApplyTheme(themeToLoad);
    };

    initializeTheme();
  }, [defaultTheme]);

  const contextValue: ThemeContextType = {
    currentTheme: currentTheme!,
    themeName,
    setTheme,
    availableThemes,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
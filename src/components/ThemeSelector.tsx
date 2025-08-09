'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function ThemeSelector() {
  const { currentTheme, themeName, setTheme, availableThemes, isLoading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-border animate-pulse"></div>
    );
  }

  const themeDisplayNames: Record<string, string> = {
    'default': '默认主题',
    'cyber-cool': '简约酷炫',
    'sunset-warm': '温暖日落',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-secondary border border-border hover:border-borderHover theme-transition"
        aria-label="选择主题"
      >
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: currentTheme?.colors.primary }}
        />
        <span className="text-sm font-medium text-text-primary">
          {themeDisplayNames[themeName] || themeName}
        </span>
        <svg
          className={`w-4 h-4 text-text-secondary theme-transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-background-secondary border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            {availableThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setTheme(theme);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-background-tertiary theme-transition flex items-center gap-3 ${
                  theme === themeName ? 'bg-background-tertiary' : ''
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: theme === 'cyber-cool' ? '#00d4ff' : '#2563eb'
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {themeDisplayNames[theme] || theme}
                  </div>
                  <div className="text-xs text-text-muted">
                    {theme === 'default' && '经典浅色主题'}
                    {theme === 'cyber-cool' && '深色霓虹主题'}
                    {theme === 'sunset-warm' && '温暖日落主题'}
                  </div>
                </div>
                {theme === themeName && (
                  <svg className="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
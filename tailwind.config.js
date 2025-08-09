/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 使用 CSS 变量定义颜色
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primaryHover)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-backgroundSecondary)',
          tertiary: 'var(--color-backgroundTertiary)',
        },
        text: {
          primary: 'var(--color-textPrimary)',
          secondary: 'var(--color-textSecondary)',
          muted: 'var(--color-textMuted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-borderHover)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        glow: 'var(--color-glow)',
      },
      // 使用 CSS 变量定义字体
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      // 使用 CSS 变量定义字体大小
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      // 使用 CSS 变量定义字重
      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      // 使用 CSS 变量定义行高
      lineHeight: {
        tight: 'var(--leading-tight)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },
      // 使用 CSS 变量定义间距
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      // 使用 CSS 变量定义圆角
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      // 使用 CSS 变量定义动画时长
      transitionDuration: {
        fast: 'var(--duration-fast)',
        DEFAULT: 'var(--duration-normal)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      // 使用 CSS 变量定义动画缓动
      transitionTimingFunction: {
        linear: 'var(--easing-linear)',
        in: 'var(--easing-easeIn)',
        out: 'var(--easing-easeOut)',
        'in-out': 'var(--easing-easeInOut)',
      },
      // 添加主题相关的阴影
      boxShadow: {
        glow: '0 0 20px var(--color-glow)',
        'glow-sm': '0 0 10px var(--color-glow)',
        'glow-lg': '0 0 30px var(--color-glow)',
        theme: '0 4px 6px -1px var(--color-shadow), 0 2px 4px -1px var(--color-shadow)',
      },
      // 添加渐变色
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        'gradient-glow': 'linear-gradient(135deg, var(--color-glow), var(--color-accent))',
      },
    },
  },
  plugins: [],
}
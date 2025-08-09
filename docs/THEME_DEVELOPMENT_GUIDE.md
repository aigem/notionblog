# 主题开发指南

本指南将帮助你为 Next.js 博客创建自定义主题。

## 🎨 主题系统概述

我们的主题系统基于现代化的 CSS 变量和 Tailwind CSS，提供了灵活且高性能的主题切换能力。

### 核心特性
- ✅ **CSS 变量驱动** - 使用 CSS Custom Properties 实现动态主题切换
- ✅ **TypeScript 支持** - 完整的类型定义和智能提示
- ✅ **环境变量配置** - 通过 `.env.local` 简单配置默认主题
- ✅ **热重载支持** - 开发时实时预览主题变化
- ✅ **响应式设计** - 自动适配各种设备尺寸

## 🚀 快速开始

### 1. 创建新主题

```bash
# 创建主题文件夹
mkdir src/themes/my-awesome-theme

# 复制模板文件
cp src/themes/theme-template.ts src/themes/my-awesome-theme/config.ts
```

### 2. 配置主题

编辑 `src/themes/my-awesome-theme/config.ts`：

```typescript
import { ThemeConfig } from '@/types/theme';

const myAwesomeTheme: ThemeConfig = {
  name: 'my-awesome-theme',
  displayName: '我的酷炫主题',
  description: '一个充满创意的自定义主题',
  isDark: true, // 设置为深色主题
  
  colors: {
    primary: '#ff6b6b',        // 主色调
    primaryHover: '#ff5252',   // 主色调悬停
    accent: '#4ecdc4',         // 强调色
    background: '#1a1a1a',     // 主背景
    // ... 其他颜色配置
  },
  
  // ... 其他配置
};

export default myAwesomeTheme;
```

### 3. 注册主题

在 `src/utils/themeLoader.ts` 中添加你的主题：

```typescript
export async function getAvailableThemes(): Promise<ThemeName[]> {
  return ['default', 'cyber-cool', 'my-awesome-theme']; // 添加你的主题
}
```

### 4. 测试主题

在 `.env.local` 中设置默认主题：

```env
NEXT_PUBLIC_THEME=my-awesome-theme
```

## 🎯 主题配置详解

### 颜色系统

```typescript
colors: {
  // 主色调系统
  primary: '#3b82f6',      // 按钮、链接等主要元素
  primaryHover: '#2563eb', // 悬停状态
  secondary: '#64748b',    // 次要元素
  accent: '#8b5cf6',       // 强调和特殊效果
  
  // 背景系统
  background: '#ffffff',          // 页面主背景
  backgroundSecondary: '#f8fafc', // 卡片、导航栏背景
  backgroundTertiary: '#f1f5f9',  // 输入框、代码块背景
  
  // 文本系统
  textPrimary: '#0f172a',   // 标题、重要文本
  textSecondary: '#334155', // 正文文本
  textMuted: '#64748b',     // 次要信息、时间戳
  
  // 边框系统
  border: '#e2e8f0',       // 默认边框
  borderHover: '#cbd5e1',  // 悬停边框
  
  // 状态颜色
  success: '#059669',      // 成功状态
  warning: '#d97706',      // 警告状态
  error: '#dc2626',        // 错误状态
  
  // 特效颜色
  glow: '#3b82f6',                  // 发光效果
  shadow: 'rgba(15, 23, 42, 0.1)', // 阴影颜色
}
```

### 字体系统

```typescript
typography: {
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',   // 紧凑行高
    normal: '1.5',   // 标准行高
    relaxed: '1.75', // 宽松行高
  },
}
```

## 🎨 设计最佳实践

### 1. 颜色对比度

确保文本和背景有足够的对比度：

```typescript
// ✅ 好的对比度
colors: {
  background: '#ffffff',
  textPrimary: '#111827', // 对比度 > 7:1
}

// ❌ 对比度不足
colors: {
  background: '#f3f4f6',
  textPrimary: '#d1d5db', // 对比度 < 3:1
}
```

### 2. 深色主题设计

```typescript
// 深色主题配色建议
const darkTheme = {
  isDark: true,
  colors: {
    background: '#0a0a0a',        // 深色背景
    backgroundSecondary: '#111111', // 稍亮的次要背景
    textPrimary: '#ffffff',       // 白色主文本
    textSecondary: '#e2e8f0',     // 稍暗的次要文本
    primary: '#00d4ff',           // 明亮的主色调
    // ...
  }
};
```

### 3. 浅色主题设计

```typescript
// 浅色主题配色建议
const lightTheme = {
  isDark: false,
  colors: {
    background: '#ffffff',        // 白色背景
    backgroundSecondary: '#f8fafc', // 浅灰次要背景
    textPrimary: '#0f172a',       // 深色主文本
    textSecondary: '#334155',     // 中等深度次要文本
    primary: '#2563eb',           // 适中的主色调
    // ...
  }
};
```

## 🛠️ 开发工具

### 主题预览

使用内置的主题选择器实时预览：

1. 启动开发服务器：`npm run dev`
2. 在页面右上角找到主题选择器
3. 切换不同主题查看效果

### 调试技巧

1. **检查 CSS 变量**：
   ```javascript
   // 在浏览器控制台中检查当前主题变量
   console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
   ```

2. **主题加载状态**：
   ```typescript
   // 在组件中检查主题加载状态
   const { isLoading, currentTheme } = useTheme();
   console.log('Theme loading:', isLoading, 'Current theme:', currentTheme?.name);
   ```

## 📱 响应式设计

主题系统自动支持响应式设计，但你可以为不同屏幕尺寸优化颜色：

```typescript
// 可以在 globals.css 中添加响应式主题调整
@media (max-width: 768px) {
  :root {
    --color-primary: #your-mobile-primary-color;
  }
}
```

## 🚀 性能优化

### 1. 颜色值优化

使用高效的颜色格式：

```typescript
// ✅ 推荐：使用 hex 或 hsl
primary: '#3b82f6',
primary: 'hsl(217, 91%, 60%)',

// ❌ 避免：复杂的 rgba 计算
primary: 'rgba(59, 130, 246, 0.95)',
```

### 2. 动画性能

合理设置动画时长：

```typescript
animation: {
  duration: {
    fast: '150ms',   // 快速交互
    normal: '300ms', // 标准动画
    slow: '500ms',   // 复杂动画
  },
}
```

## 🔧 故障排除

### 常见问题

1. **主题不生效**：
   - 检查主题名称是否正确
   - 确认主题已在 `themeLoader.ts` 中注册
   - 验证 CSS 变量是否正确应用

2. **颜色显示异常**：
   - 检查颜色值格式是否正确
   - 确认对比度是否足够
   - 验证 CSS 变量命名是否一致

3. **切换主题时闪烁**：
   - 确保在 `layout.tsx` 中正确包装了 `ThemeProvider`
   - 检查 CSS 过渡动画设置

## 📚 示例主题

查看现有主题作为参考：

- **默认主题**：`src/themes/default/config.ts` - 经典浅色主题
- **简约酷炫主题**：`src/themes/cyber-cool/config.ts` - 深色霓虹主题

## 🤝 贡献主题

如果你创建了一个优秀的主题，欢迎贡献给社区：

1. 确保主题符合设计规范
2. 添加完整的配置和文档
3. 测试在各种设备上的显示效果
4. 提交 Pull Request

---

**需要帮助？** 查看项目文档或在 GitHub 上提出 Issue。
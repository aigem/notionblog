# Notion Blog



一个基于 Next.js 15 和 Notion API 的现代化博客应用，支持静态导出和多平台部署。

## ✨ 特性

- 🚀 **Next.js 15** - 使用最新的 App Router 和 React Server Components
- 📝 **Notion 集成** - 使用 Notion 作为内容管理系统
- 🎨 **现代化设计** - 响应式设计，支持深色模式
- ⚡ **静态导出** - 支持完全静态部署，无需服务器
- 🔍 **SEO 优化** - 自动生成 sitemap 和 robots.txt
- 📱 **移动端友好** - 完全响应式设计
- 🔧 **TypeScript** - 完整的类型安全
- 📊 **性能监控** - 内置性能监控和错误处理

## 🛠️ 技术栈

- **框架**: Next.js 15.4.5
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容管理**: Notion API
- **部署**: 支持 Vercel、Netlify、GitHub Pages 等

## 📦 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd notion-blog

# 安装依赖
pnpm install
```

## ⚙️ 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 配置 Notion API：
```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

### 获取 Notion 配置

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 创建新的集成，获取 `NOTION_TOKEN`
3. 在你的 Notion 数据库页面，点击右上角的 "Share" → "Add connections" → 选择你的集成
4. 从数据库 URL 中获取 `NOTION_DATABASE_ID`

## 🚀 开发

```bash
# 启动开发服务器
pnpm dev

# 代码检查
pnpm lint
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 内容管理

博客内容通过 Notion 数据库管理，支持以下字段：

- **标题** (Title) - 文章标题
- **内容** (Content) - 文章正文
- **发布状态** (Published) - 是否发布
- **创建时间** (Created) - 创建日期
- **标签** (Tags) - 文章标签

## 🏗️ 构建和部署

### 开发构建
```bash
pnpm build
```

### 静态导出（推荐）
```bash
# 跨平台静态构建
pnpm run build:static
```

静态文件将生成在 `.next/out` 目录中，可以直接部署到任何静态托管服务。

### 部署选项

#### 1. Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### 2. Netlify
1. 将 `.next/out` 目录上传到 Netlify
2. 或连接 Git 仓库自动部署

#### 3. GitHub Pages
1. 运行 `pnpm run build:static`
2. 将 `.next/out` 内容推送到 `gh-pages` 分支

#### 4. 其他静态托管
将 `.next/out` 目录内容上传到任何静态文件服务器。

## 📁 项目结构

```
notion-blog/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── api/            # API 路由
│   │   ├── blog/           # 博客相关页面
│   │   └── ...
│   ├── components/         # React 组件
│   ├── lib/               # 工具函数和配置
│   └── data/              # 静态数据文件
├── public/                # 静态资源
├── scripts/               # 构建脚本
└── ...
```


## 📊 性能优化

- ✅ 静态生成 (SSG)
- ✅ 图片优化
- ✅ 代码分割
- ✅ 懒加载
- ✅ 缓存策略
- ✅ SEO 优化

## 🔧 配置文件

- `next.config.js` - Next.js 配置
- `next.config.export.js` - 静态导出配置
- `tailwind.config.js` - Tailwind CSS 配置
- `eslint.config.mjs` - ESLint 配置

## 🐛 故障排除

### 常见问题

1. **Notion API 连接失败**
   - 检查 `NOTION_TOKEN` 是否正确
   - 确认数据库已共享给集成

2. **构建失败**
   - 清理缓存：`rm -rf .next`
   - 重新安装依赖：`rm -rf node_modules && pnpm install`

3. **静态导出问题**
   - 确保所有 API 路由都配置了 `export const dynamic = 'force-static'`

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请创建 [Issue](https://github.com/your-username/notion-blog/issues)。
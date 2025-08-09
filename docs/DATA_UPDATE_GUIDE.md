# 📊 数据获取和更新指南

## 🚀 快速开始

### 1. 环境配置

确保你的 `.env.local` 文件包含以下配置：

```env
# Notion API 配置
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id

# 主题配置
NEXT_PUBLIC_THEME=cyber-cool
```

### 2. 获取 Notion 配置

#### 获取 Notion Token：
1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 "New integration"
3. 填写基本信息，选择工作区
4. 复制 "Internal Integration Token"

#### 获取 Database ID：
1. 打开你的 Notion 数据库页面
2. 复制页面 URL 中的数据库 ID
3. URL 格式：`https://notion.so/your-workspace/DATABASE_ID?v=...`

#### 数据库权限设置：
1. 在 Notion 数据库页面点击右上角 "..."
2. 选择 "Add connections"
3. 选择你创建的 Integration

## 📋 数据库结构要求

你的 Notion 数据库需要包含以下属性：

| 属性名称 | 类型 | 说明 |
|---------|------|------|
| 标题 | Title | 文章标题 |
| 内容 | Rich Text | 文章内容 |
| 摘要 | Rich Text | 文章摘要 |
| 标签 | Multi-select | 文章标签 |
| 分类 | Select | 文章分类 |
| 发布日期 | Date | 发布日期 |
| 发布状态 | Select | 已发布/草稿 |
| 封面图片 | URL | 封面图片链接 |
| 阅读时间 | Number | 预估阅读时间（分钟）|
| URL别名 | Rich Text | 自定义URL |
| SEO关键词 | Rich Text | SEO关键词 |
| 作者 | People | 文章作者 |

## 🔄 数据更新命令

### 基本命令

```bash
# 仅获取数据（不构建）
npm run fetch-data

# 获取数据并构建静态站点
npm run update-data

# 开发模式（实时预览）
npm run dev

# 构建静态站点
npm run build:static
```

### 详细说明

#### 1. `npm run fetch-data`
- 从 Notion 数据库获取最新数据
- 生成 JSON 数据文件到 `src/data/` 目录
- 包含文章内容、统计信息、元数据

#### 2. `npm run update-data`
- 执行 `fetch-data` 获取最新数据
- 自动构建静态站点到 `out/` 目录
- 适合部署前的完整更新

## 📁 生成的数据文件

数据获取后会在 `src/data/` 目录生成以下文件：

```
src/data/
├── posts.json              # 所有文章（包括草稿）
├── published-posts.json    # 已发布文章
├── stats.json             # 统计信息
└── metadata.json          # 元数据信息
```

### 文件内容说明

#### `posts.json` / `published-posts.json`
```json
[
  {
    "id": "notion-page-id",
    "title": "文章标题",
    "content": "文章内容（Markdown格式）",
    "summary": "文章摘要",
    "tags": ["标签1", "标签2"],
    "category": "分类名称",
    "publishDate": "2024-01-01",
    "status": "published",
    "coverImage": "图片URL",
    "readingTime": 5,
    "urlSlug": "article-slug",
    "seoKeywords": "关键词",
    "author": "作者名称"
  }
]
```

#### `stats.json`
```json
{
  "categories": [
    {"name": "技术", "count": 10},
    {"name": "生活", "count": 5}
  ],
  "tags": [
    {"name": "React", "count": 8},
    {"name": "Next.js", "count": 6}
  ],
  "totalPosts": 15,
  "publishedPosts": 12,
  "draftPosts": 3
}
```

#### `metadata.json`
```json
{
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "totalPosts": 15,
  "publishedPosts": 12,
  "draftPosts": 3
}
```

## 🔧 自动化工作流

### 1. 开发工作流
```bash
# 1. 在 Notion 中编写/更新文章
# 2. 获取最新数据
npm run fetch-data

# 3. 启动开发服务器预览
npm run dev
```

### 2. 部署工作流
```bash
# 1. 获取最新数据并构建
npm run update-data

# 2. 部署 out/ 目录到静态托管服务
# - Vercel: 自动部署
# - Netlify: 拖拽 out/ 文件夹
# - GitHub Pages: 推送到 gh-pages 分支
```

### 3. 定时更新（可选）

你可以设置 GitHub Actions 来定时更新数据：

```yaml
# .github/workflows/update-data.yml
name: Update Blog Data
on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时更新一次
  workflow_dispatch:       # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run update-data
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## 🐛 常见问题

### 1. 获取数据失败
```bash
❌ 获取文章失败: Unauthorized
```
**解决方案：**
- 检查 `NOTION_TOKEN` 是否正确
- 确认 Integration 已添加到数据库
- 验证数据库 ID 是否正确

### 2. 属性不匹配
```bash
❌ 无法读取属性 '标题'
```
**解决方案：**
- 检查 Notion 数据库属性名称是否与脚本中的一致
- 确保属性类型正确（Title、Rich Text、Select 等）

### 3. 构建失败
```bash
❌ 找不到数据文件
```
**解决方案：**
- 先运行 `npm run fetch-data` 获取数据
- 检查 `src/data/` 目录是否存在数据文件

## 📈 性能优化

### 1. 增量更新
脚本会自动处理增量更新，只获取变更的内容。

### 2. 缓存策略
- 本地数据文件作为缓存
- 只有在 Notion 内容变更时才重新获取

### 3. 构建优化
- 静态生成所有页面
- 图片优化和懒加载
- CSS 和 JS 压缩

## 🎯 最佳实践

1. **定期更新**：建议每天或每周定期更新数据
2. **备份数据**：定期备份 `src/data/` 目录
3. **版本控制**：将数据文件加入 Git 版本控制
4. **监控日志**：关注数据获取过程中的错误日志
5. **测试验证**：更新后在本地测试所有功能

## 🔗 相关链接

- [Notion API 文档](https://developers.notion.com/)
- [Next.js 静态导出](https://nextjs.org/docs/advanced-features/static-html-export)
- [主题开发指南](./THEME_DEVELOPMENT_GUIDE.md)
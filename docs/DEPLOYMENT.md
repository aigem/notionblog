# NotionBlog 部署指南

## 📋 部署概述

NotionBlog 是基于Notion及Next.js 15构建的个人博客系统，支持多种部署方式。本指南详细介绍部署的完整流程。

### 实际体验

#### [NotionBlog 体验主页](https://nb.2ii2.cn/)

## 🚀 快速部署

#### 前置要求
- Vercel
- GitHub
- Notion API Key 和 Database ID
- Pipedream

### 1. Notion准备

#### 注册登录Notion

#### Notion数据库
- 打开我的Notion 数据库，网址为：https://speckle-building-048.notion.site/247c5a0ebbe680c58136e04779dad0a9?v=247c5a0ebbe68071a408000cd1cfbd6a&source=copy_link
- 在页面右上角复制复刻这个数据库

#### 集成管理
- 右上角三点中打开，点击“集成”按钮

#### 获取到 Notion API Key

#### 获取 Database ID

### 2. Vercel 部署

#### 部署步骤

1. **Fork 项目到你的 GitHub**

[项目地址：https://github.com/aigem/notionblog](https://github.com/aigem/notionblog)

2. **配置环境变量**
- 在 Vercel 部署时设置以下环境变量：
```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

- 修改 .env.local 中的相关内容
```
按需按实际设置
```

3. **连接 Vercel**
- 登录 [Vercel](https://vercel.com)
- 点击 "New Project"
- 选择你的 GitHub 仓库
- 配置环境变量
- 点击 "Deploy"

4. **验证部署**
```bash
curl -f https://your-domain.vercel.app/
```


## 🔧 环境配置

### 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `NOTION_API_KEY` | ✅ | Notion API 密钥 | `secret_xxx` |
| `NOTION_DATABASE_ID` | ✅ | Notion 数据库 ID | `xxx-xxx-xxx` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 网站 URL | `https://blog.example.com` |
| `NEXT_PUBLIC_SITE_NAME` | ❌ | 网站名称 | `notion Blog` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | ❌ | 网站描述 | `个人博客` |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | Sentry DSN | `https://xxx@sentry.io/xxx` |

### Notion 数据库配置

确保你的 Notion 数据库包含以下字段：

| 字段名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `标题` | 标题 | ✅ | 文章标题 |
| `发布状态` | 选择 | ✅ | 已发布/草稿 |
| `分类` | 选择 | ❌ | 文章分类 |
| `标签` | 多选 | ❌ | 文章标签 |
| `发布时间` | 日期 | ❌ | 发布日期 |
| `封面图` | 文件 | ❌ | 封面图片 |

## 🔍 部署验证

### 健康检查
```bash
# 检查网站可访问性
curl -f https://your-domain.vercel.app/

# 检查 API 端点
curl -f https://your-domain.vercel.app/api/posts

# 检查 Notion 连接
curl -f https://your-domain.vercel.app/api/notion/test
```
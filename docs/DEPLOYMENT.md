# Dream Blog 部署指南

## 📋 部署概述

Dream Blog 是基于 Next.js 15 构建的个人博客系统，支持多种部署方式。本指南详细介绍了生产环境部署的完整流程。

## 🚀 快速部署

### 1. Vercel 部署（推荐）

#### 前置要求
- Vercel 账户
- GitHub 仓库
- Notion API Key 和 Database ID

#### 部署步骤

1. **Fork 项目到你的 GitHub**
```bash
git clone https://github.com/your-username/dream-blog.git
cd dream-blog
```

2. **配置环境变量**
在 Vercel 控制台中设置以下环境变量：
```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Dream Blog
NEXT_PUBLIC_SITE_DESCRIPTION=个人生活记录博客
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

### 2. 手动部署

#### 使用部署脚本
```bash
# 设置环境变量
export VERCEL_TOKEN=your_vercel_token
export NOTION_API_KEY=your_notion_api_key
export NOTION_DATABASE_ID=your_notion_database_id

# 执行部署
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### 手动构建
```bash
# 安装依赖
npm ci

# 获取数据
npm run fetch-data

# 运行测试
npm run test

# 构建项目
npm run build

# 部署到 Vercel
npx vercel --prod
```

## 🔧 环境配置

### 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `NOTION_API_KEY` | ✅ | Notion API 密钥 | `secret_xxx` |
| `NOTION_DATABASE_ID` | ✅ | Notion 数据库 ID | `xxx-xxx-xxx` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 网站 URL | `https://blog.example.com` |
| `NEXT_PUBLIC_SITE_NAME` | ❌ | 网站名称 | `Dream Blog` |
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

### 性能测试
```bash
# 使用 Lighthouse 测试
npx lighthouse https://your-domain.vercel.app/ --output=html

# 使用 WebPageTest
# 访问 https://www.webpagetest.org/
```

## 🚨 故障排除

### 常见问题

#### 1. Notion API 连接失败
```
错误: NotionAPIError: Unauthorized
```
**解决方案**:
- 检查 `NOTION_API_KEY` 是否正确
- 确认 Notion 集成已添加到数据库
- 验证数据库 ID 格式正确

#### 2. 构建失败
```
错误: Module not found
```
**解决方案**:
- 运行 `npm ci` 重新安装依赖
- 检查 Node.js 版本 (需要 18+)
- 清理缓存: `rm -rf .next node_modules`

#### 3. 环境变量未生效
```
错误: Environment variable not found
```
**解决方案**:
- 检查 Vercel 控制台中的环境变量设置
- 确认变量名拼写正确
- 重新部署项目

### 日志查看
```bash
# Vercel 部署日志
vercel logs your-deployment-url

# 本地开发日志
npm run dev
```

## 📊 监控和维护

### 性能监控
- **Vercel Analytics**: 自动启用
- **Google Analytics**: 配置 `NEXT_PUBLIC_GA_ID`
- **Sentry 错误追踪**: 配置 `NEXT_PUBLIC_SENTRY_DSN`

### 定期维护
1. **依赖更新**: 每月运行 `npm update`
2. **安全扫描**: 运行 `npm audit`
3. **性能检查**: 使用 Lighthouse 定期测试
4. **数据备份**: 定期备份 Notion 数据库

## 🔄 CI/CD 配置

项目包含 GitHub Actions 工作流，自动执行：
- 代码测试
- 类型检查
- 构建验证
- 自动部署

配置文件位置: `.github/workflows/deploy.yml`

## 📞 支持

如果遇到部署问题，请：
1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 查看 Vercel 部署日志
4. 联系项目维护者

---

**最后更新**: 2024年1月
**版本**: 1.0.0
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
}

// 提取纯文本内容
function extractPlainText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(item => item.plain_text || '').join('');
}

// 获取页面内容
async function getPageContent(pageId) {
  try {
    console.log(`  🔍 获取页面内容: ${pageId}`);
    
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    console.log(`  📦 找到 ${blocks.results.length} 个内容块`);

    let content = '';
    
    for (const block of blocks.results) {
      console.log(`  📝 处理块类型: ${block.type}`);
      
      switch (block.type) {
        case 'paragraph':
          const paragraphText = extractPlainText(block.paragraph.rich_text);
          if (paragraphText) {
            content += paragraphText + '\n\n';
          }
          break;
        case 'heading_1':
          const h1Text = extractPlainText(block.heading_1.rich_text);
          if (h1Text) {
            content += '# ' + h1Text + '\n\n';
          }
          break;
        case 'heading_2':
          const h2Text = extractPlainText(block.heading_2.rich_text);
          if (h2Text) {
            content += '## ' + h2Text + '\n\n';
          }
          break;
        case 'heading_3':
          const h3Text = extractPlainText(block.heading_3.rich_text);
          if (h3Text) {
            content += '### ' + h3Text + '\n\n';
          }
          break;
        case 'bulleted_list_item':
          const bulletText = extractPlainText(block.bulleted_list_item.rich_text);
          if (bulletText) {
            content += '- ' + bulletText + '\n';
          }
          break;
        case 'numbered_list_item':
          const numberText = extractPlainText(block.numbered_list_item.rich_text);
          if (numberText) {
            content += '1. ' + numberText + '\n';
          }
          break;
        case 'code':
          const language = block.code.language || '';
          const codeText = extractPlainText(block.code.rich_text);
          if (codeText) {
            content += '```' + language + '\n' + codeText + '\n```\n\n';
          }
          break;
        case 'quote':
          const quoteText = extractPlainText(block.quote.rich_text);
          if (quoteText) {
            content += '> ' + quoteText + '\n\n';
          }
          break;
        case 'divider':
          content += '---\n\n';
          break;
        case 'toggle':
          const toggleText = extractPlainText(block.toggle.rich_text);
          if (toggleText) {
            content += toggleText + '\n\n';
          }
          break;
        case 'to_do':
          const todoText = extractPlainText(block.to_do.rich_text);
          const checked = block.to_do.checked ? '[x]' : '[ ]';
          if (todoText) {
            content += `${checked} ${todoText}\n`;
          }
          break;
        case 'callout':
          const calloutText = extractPlainText(block.callout.rich_text);
          const calloutIcon = block.callout.icon?.emoji || '💡';
          if (calloutText) {
            content += `> ${calloutIcon} ${calloutText}\n\n`;
          }
          break;
        case 'image':
          // 处理图片块
          const imageUrl = block.image?.file?.url || block.image?.external?.url;
          const imageCaption = extractPlainText(block.image?.caption || []);
          if (imageUrl) {
            const altText = imageCaption || '图片';
            content += `![${altText}](${imageUrl})\n\n`;
            console.log(`  🖼️  添加图片: ${imageUrl.substring(0, 50)}...`);
          }
          break;
        case 'video':
          // 处理视频块
          const videoUrl = block.video?.file?.url || block.video?.external?.url;
          if (videoUrl) {
            content += `[视频链接](${videoUrl})\n\n`;
            console.log(`  🎥 添加视频: ${videoUrl.substring(0, 50)}...`);
          }
          break;
        case 'file':
          // 处理文件块
          const fileUrl = block.file?.file?.url || block.file?.external?.url;
          const fileName = block.file?.name || '文件';
          if (fileUrl) {
            content += `[${fileName}](${fileUrl})\n\n`;
            console.log(`  📎 添加文件: ${fileName}`);
          }
          break;
        case 'embed':
          // 处理嵌入块
          const embedUrl = block.embed?.url;
          if (embedUrl) {
            content += `[嵌入内容](${embedUrl})\n\n`;
            console.log(`  🔗 添加嵌入: ${embedUrl.substring(0, 50)}...`);
          }
          break;
        case 'bookmark':
          // 处理书签块
          const bookmarkUrl = block.bookmark?.url;
          const bookmarkCaption = extractPlainText(block.bookmark?.caption || []);
          if (bookmarkUrl) {
            const linkText = bookmarkCaption || bookmarkUrl;
            content += `[${linkText}](${bookmarkUrl})\n\n`;
            console.log(`  🔖 添加书签: ${bookmarkUrl.substring(0, 50)}...`);
          }
          break;
        case 'table':
          // 处理表格块（简化处理）
          content += `[表格内容]\n\n`;
          console.log(`  📊 添加表格`);
          break;
        default:
          // 处理其他类型的块
          console.log(`  ⚠️  未处理的块类型: ${block.type}`);
          if (block[block.type] && block[block.type].rich_text) {
            const defaultText = extractPlainText(block[block.type].rich_text);
            if (defaultText) {
              content += defaultText + '\n\n';
            }
          }
      }
    }

    const finalContent = content.trim();
    console.log(`  ✅ 内容长度: ${finalContent.length} 字符`);
    
    return finalContent;
  } catch (error) {
    console.error(`  ❌ 获取页面内容失败 (${pageId}):`, error.message);
    console.error(`  📋 错误详情:`, error);
    return '';
  }
}

// 处理属性值
function getPropertyValue(property) {
  if (!property) return null;

  switch (property.type) {
    case 'title':
      return extractPlainText(property.title);
    case 'rich_text':
      return extractPlainText(property.rich_text);
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      return property.multi_select?.map(item => item.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox;
    case 'number':
      return property.number;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'files':
      return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || '';
    default:
      return null;
  }
}

// 估算阅读时间（中文）
function estimateReadingTime(content) {
  const wordsPerMinute = 500; // 中文阅读速度
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 生成URL slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 获取所有文章
async function fetchPosts() {
  try {
    console.log('🚀 开始获取 Notion 数据...');
    
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 环境变量未设置');
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
        sorts: [
          {
            property: '发布日期',
            direction: 'descending',
          },
        ],
    });

    console.log(`📄 找到 ${response.results.length} 篇文章`);

    const posts = [];
    
    for (const page of response.results) {
      try {
        console.log(`📝 处理文章: ${getPropertyValue(page.properties.标题) || '无标题'}`);
        
        // 获取页面内容
        const content = await getPageContent(page.id);
        
        // 获取摘要作为备用内容
        const summary = getPropertyValue(page.properties.摘要) || '';
        
        // 如果页面内容为空但有摘要，使用摘要作为内容
        const finalContent = content || (summary ? `# ${getPropertyValue(page.properties.标题) || '无标题'}\n\n${summary}` : '');
        
        // 构建文章对象
        const post = {
          id: page.id,
          title: getPropertyValue(page.properties.标题) || '无标题',
          content: finalContent,
          summary: summary,
          tags: getPropertyValue(page.properties.标签) || [],
          category: getPropertyValue(page.properties.分类) || '未分类',
          publishDate: formatDate(getPropertyValue(page.properties.发布日期)),
          lastEditTime: page.last_edited_time,
          status: getPropertyValue(page.properties.发布状态) === '已发布' ? 'published' : 'draft',
          coverImage: getPropertyValue(page.properties.封面图片) || '',
          readingTime: estimateReadingTime(finalContent),
          urlSlug: getPropertyValue(page.properties.URL别名) || generateSlug(getPropertyValue(page.properties.标题) || ''),
          seoKeywords: getPropertyValue(page.properties.SEO关键词) || '',
          author: getPropertyValue(page.properties.作者) || '未知作者',
        };

        posts.push(post);
        
        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`处理文章失败 (${page.id}):`, error.message);
        continue;
      }
    }

    return posts;
  } catch (error) {
    console.error('获取文章失败:', error.message);
    throw error;
  }
}

// 生成统计数据
function generateStats(posts) {
  const stats = {
    categories: {},
    tags: {},
    totalPosts: posts.length,
    publishedPosts: posts.filter(post => post.status === 'published').length,
    draftPosts: posts.filter(post => post.status === 'draft').length,
  };

  // 统计分类
  posts.forEach(post => {
    if (post.category) {
      stats.categories[post.category] = (stats.categories[post.category] || 0) + 1;
    }
  });

  // 统计标签
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        stats.tags[tag] = (stats.tags[tag] || 0) + 1;
      });
    }
  });

  // 转换为数组格式
  return {
    categories: Object.entries(stats.categories).map(([name, count]) => ({ name, count })),
    tags: Object.entries(stats.tags).map(([name, count]) => ({ name, count })),
    totalPosts: stats.totalPosts,
    publishedPosts: stats.publishedPosts,
    draftPosts: stats.draftPosts,
  };
}

// 保存数据到文件
function saveData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`💾 已保存: ${filename}`);
}

// 主函数
async function main() {
  try {
    console.log('🔄 开始更新博客数据...\n');
    
    // 获取所有文章
    const allPosts = await fetchPosts();
    
    // 过滤已发布的文章
    const publishedPosts = allPosts.filter(post => post.status === 'published');
    
    // 生成统计数据
    const stats = generateStats(allPosts);
    
    // 生成元数据
    const metadata = {
      lastUpdated: new Date().toISOString(),
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: allPosts.length - publishedPosts.length,
    };

    // 保存数据文件
    saveData('posts.json', allPosts);
    saveData('published-posts.json', publishedPosts);
    saveData('stats.json', stats);
    saveData('metadata.json', metadata);

    console.log('\n✅ 数据更新完成!');
    console.log(`📊 总文章数: ${metadata.totalPosts}`);
    console.log(`📝 已发布: ${metadata.publishedPosts}`);
    console.log(`📄 草稿: ${metadata.draftPosts}`);
    console.log(`🕒 更新时间: ${metadata.lastUpdated}`);
    
  } catch (error) {
    console.error('❌ 数据更新失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { fetchPosts, generateStats, saveData };
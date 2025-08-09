const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
});

// 从 URL 中提取页面 ID
function extractPageId(url) {
  // URL 格式: https://www.notion.so/post-4-249c5a0ebbe68017867afe54d8fe8f2e
  const match = url.match(/([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i);
  if (match) {
    let id = match[1];
    // 如果是32位格式，转换为标准UUID格式
    if (id.length === 32) {
      id = id.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
    return id;
  }
  return null;
}

// 提取纯文本内容
function extractPlainText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(item => item.plain_text || '').join('');
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
    case 'people':
      return property.people?.map(person => person.name || person.id) || [];
    default:
      return null;
  }
}

// 获取页面基本信息
async function getPageInfo(pageId) {
  try {
    console.log(`🔍 获取页面信息: ${pageId}`);
    
    const page = await notion.pages.retrieve({
      page_id: pageId
    });

    console.log('\n📋 页面基本信息:');
    console.log(`ID: ${page.id}`);
    console.log(`创建时间: ${page.created_time}`);
    console.log(`最后编辑时间: ${page.last_edited_time}`);
    console.log(`URL: ${page.url}`);
    
    console.log('\n🏷️ 页面属性:');
    const properties = {};
    for (const [key, value] of Object.entries(page.properties)) {
      const propertyValue = getPropertyValue(value);
      properties[key] = propertyValue;
      console.log(`${key}: ${JSON.stringify(propertyValue)}`);
    }

    return {
      id: page.id,
      url: page.url,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      properties: properties,
      raw_properties: page.properties
    };

  } catch (error) {
    console.error('❌ 获取页面信息失败:', error.message);
    throw error;
  }
}

// 获取页面内容块
async function getPageBlocks(pageId) {
  try {
    console.log(`\n📦 获取页面内容块: ${pageId}`);
    
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    console.log(`找到 ${blocks.results.length} 个内容块\n`);

    const blockData = [];
    
    for (let i = 0; i < blocks.results.length; i++) {
      const block = blocks.results[i];
      console.log(`📝 块 ${i + 1}: ${block.type}`);
      
      let blockContent = '';
      let blockInfo = {
        id: block.id,
        type: block.type,
        created_time: block.created_time,
        last_edited_time: block.last_edited_time,
        has_children: block.has_children
      };

      switch (block.type) {
        case 'paragraph':
          blockContent = extractPlainText(block.paragraph.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.paragraph.rich_text;
          break;
        case 'heading_1':
          blockContent = extractPlainText(block.heading_1.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.heading_1.rich_text;
          break;
        case 'heading_2':
          blockContent = extractPlainText(block.heading_2.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.heading_2.rich_text;
          break;
        case 'heading_3':
          blockContent = extractPlainText(block.heading_3.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.heading_3.rich_text;
          break;
        case 'bulleted_list_item':
          blockContent = extractPlainText(block.bulleted_list_item.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.bulleted_list_item.rich_text;
          break;
        case 'numbered_list_item':
          blockContent = extractPlainText(block.numbered_list_item.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.numbered_list_item.rich_text;
          break;
        case 'code':
          blockContent = extractPlainText(block.code.rich_text);
          blockInfo.content = blockContent;
          blockInfo.language = block.code.language;
          blockInfo.rich_text = block.code.rich_text;
          break;
        case 'quote':
          blockContent = extractPlainText(block.quote.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.quote.rich_text;
          break;
        case 'toggle':
          blockContent = extractPlainText(block.toggle.rich_text);
          blockInfo.content = blockContent;
          blockInfo.rich_text = block.toggle.rich_text;
          break;
        case 'to_do':
          blockContent = extractPlainText(block.to_do.rich_text);
          blockInfo.content = blockContent;
          blockInfo.checked = block.to_do.checked;
          blockInfo.rich_text = block.to_do.rich_text;
          break;
        case 'callout':
          blockContent = extractPlainText(block.callout.rich_text);
          blockInfo.content = blockContent;
          blockInfo.icon = block.callout.icon;
          blockInfo.rich_text = block.callout.rich_text;
          break;
        case 'image':
          blockInfo.image_url = block.image.file?.url || block.image.external?.url;
          blockInfo.caption = extractPlainText(block.image.caption);
          blockContent = `[图片: ${blockInfo.caption || '无标题'}]`;
          break;
        case 'divider':
          blockContent = '---';
          break;
        default:
          blockContent = `[${block.type} 块]`;
          blockInfo.raw_data = block[block.type];
      }

      console.log(`   内容: ${blockContent.substring(0, 100)}${blockContent.length > 100 ? '...' : ''}`);
      
      blockData.push(blockInfo);
    }

    return blockData;

  } catch (error) {
    console.error('❌ 获取页面内容失败:', error.message);
    throw error;
  }
}

// 主函数
async function main() {
  const pageUrl = 'https://www.notion.so/post-4-249c5a0ebbe68017867afe54d8fe8f2e';
  
  try {
    console.log('🚀 开始获取 Notion 页面数据...');
    console.log(`📄 页面 URL: ${pageUrl}\n`);
    
    // 提取页面 ID
    const pageId = extractPageId(pageUrl);
    if (!pageId) {
      throw new Error('无法从 URL 中提取页面 ID');
    }
    
    console.log(`🆔 页面 ID: ${pageId}\n`);
    
    // 获取页面信息
    const pageInfo = await getPageInfo(pageId);
    
    // 获取页面内容块
    const blocks = await getPageBlocks(pageId);
    
    // 组合完整数据
    const fullData = {
      page_info: pageInfo,
      blocks: blocks,
      total_blocks: blocks.length,
      fetch_time: new Date().toISOString()
    };
    
    console.log('\n✅ 数据获取完成!');
    console.log(`📊 总计 ${blocks.length} 个内容块`);
    
    // 保存到文件
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '..', 'notion-page-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(fullData, null, 2), 'utf8');
    console.log(`💾 数据已保存到: ${outputPath}`);
    
    // 返回数据供查看
    return fullData;
    
  } catch (error) {
    console.error('💥 获取失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { main, getPageInfo, getPageBlocks };
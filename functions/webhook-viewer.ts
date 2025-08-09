/**
 * EdgeOne Pages Function: /webhook-viewer
 * 显示最近收到的webhook请求（简单版本，仅用于调试）
 */

// 简单的内存存储（重启后会丢失）
let recentRequests: any[] = [];
const MAX_REQUESTS = 50;

// 添加请求到历史记录
export function addRequest(requestData: any) {
  recentRequests.unshift({
    ...requestData,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
  
  // 只保留最近的请求
  if (recentRequests.length > MAX_REQUESTS) {
    recentRequests = recentRequests.slice(0, MAX_REQUESTS);
  }
}

// 获取请求历史
export function getRecentRequests() {
  return recentRequests;
}

// 处理GET请求 - 显示最近的webhook请求
export function onRequestGet() {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webhook 请求查看器</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: #007bff; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        .stats { 
            padding: 15px 20px; 
            background: #f8f9fa; 
            border-bottom: 1px solid #dee2e6;
        }
        .request-item { 
            border-bottom: 1px solid #eee; 
            padding: 15px 20px; 
        }
        .request-item:last-child { 
            border-bottom: none; 
        }
        .request-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 10px; 
        }
        .method { 
            background: #28a745; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: bold;
        }
        .timestamp { 
            color: #666; 
            font-size: 14px; 
        }
        .request-body { 
            background: #f8f9fa; 
            border: 1px solid #dee2e6; 
            border-radius: 4px; 
            padding: 10px; 
            margin: 10px 0; 
            font-family: 'Courier New', monospace; 
            font-size: 13px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .no-requests { 
            text-align: center; 
            padding: 40px; 
            color: #666; 
        }
        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        .refresh-btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔗 Webhook 请求查看器</h1>
            <p>实时查看发送到 /notion-webhook 的POST请求</p>
        </div>
        
        <div class="stats">
            <strong>总请求数:</strong> ${recentRequests.length} 
            <button class="refresh-btn" onclick="location.reload()">🔄 刷新</button>
        </div>
        
        <div class="requests">
            ${recentRequests.length === 0 ? 
                '<div class="no-requests">暂无请求记录<br><small>向 /notion-webhook 发送POST请求后，这里会显示内容</small></div>' :
                recentRequests.map(req => `
                    <div class="request-item">
                        <div class="request-header">
                            <div>
                                <span class="method">${req.method || 'POST'}</span>
                                <strong>${req.url || '/notion-webhook'}</strong>
                            </div>
                            <div class="timestamp">${new Date(req.timestamp).toLocaleString('zh-CN')}</div>
                        </div>
                        
                        ${req.parsedBody ? `
                            <div>
                                <strong>JSON 数据:</strong>
                                <div class="request-body">${JSON.stringify(req.parsedBody, null, 2)}</div>
                            </div>
                        ` : ''}
                        
                        ${req.rawBody ? `
                            <div>
                                <strong>原始数据:</strong>
                                <div class="request-body">${req.rawBody}</div>
                            </div>
                        ` : ''}
                        
                        <div>
                            <strong>请求头:</strong>
                            <div class="request-body">${JSON.stringify(req.headers || {}, null, 2)}</div>
                        </div>
                    </div>
                `).join('')
            }
        </div>
    </div>
    
    <script>
        // 每30秒自动刷新
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache'
    }
  });
}
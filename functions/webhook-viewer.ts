/**
 * EdgeOne Pages Function: /webhook-viewer
 * 显示最近收到的webhook请求
 */

// 使用全局存储
declare global {
  var webhookRequests: any[];
}

// 初始化全局存储
if (typeof globalThis.webhookRequests === 'undefined') {
  globalThis.webhookRequests = [];
}

// 处理GET请求 - 显示最近的webhook请求
export function onRequestGet() {
  const requests = globalThis.webhookRequests || [];
  
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
            <strong>总请求数:</strong> ${requests.length} 
            <button class="refresh-btn" onclick="window.location.reload()">🔄 刷新</button>
        </div>
        
        <div class="requests">
            ${requests.length === 0 ? 
                '<div class="no-requests">暂无请求记录<br><small>向 /notion-webhook 发送POST请求后，这里会显示内容</small></div>' :
                requests.map(req => {
                  const timestamp = req.timestamp ? new Date(req.timestamp).toLocaleString('zh-CN') : '未知时间';
                  const method = req.method || 'POST';
                  const url = req.url || '/notion-webhook';
                  
                  let bodySection = '';
                  if (req.parsedBody) {
                    try {
                      bodySection += `
                        <div>
                          <strong>JSON 数据:</strong>
                          <div class="request-body">${JSON.stringify(req.parsedBody, null, 2)}</div>
                        </div>
                      `;
                    } catch (e) {
                      // 忽略JSON序列化错误
                    }
                  }
                  
                  if (req.rawBody) {
                    bodySection += `
                      <div>
                        <strong>原始数据:</strong>
                        <div class="request-body">${req.rawBody}</div>
                      </div>
                    `;
                  }
                  
                  let headersSection = '';
                  if (req.headers) {
                    try {
                      headersSection = `
                        <div>
                          <strong>请求头:</strong>
                          <div class="request-body">${JSON.stringify(req.headers, null, 2)}</div>
                        </div>
                      `;
                    } catch (e) {
                      headersSection = `
                        <div>
                          <strong>请求头:</strong>
                          <div class="request-body">无法显示请求头</div>
                        </div>
                      `;
                    }
                  }
                  
                  return `
                    <div class="request-item">
                      <div class="request-header">
                        <div>
                          <span class="method">${method}</span>
                          <strong>${url}</strong>
                        </div>
                        <div class="timestamp">${timestamp}</div>
                      </div>
                      ${bodySection}
                      ${headersSection}
                    </div>
                  `;
                }).join('')
            }
        </div>
    </div>
    
    <script>
        // 每30秒自动刷新
        setTimeout(function() { 
            window.location.reload(); 
        }, 30000);
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
/**
 * EdgeOne Pages Function: /notion-webhook
 * 简化版本，专注于接收和记录 POST 请求
 */

const WEBHOOK_URL = 'https://pages-api.cloud.tencent.com/v1/webhook/925b3880bb6f19ce0dca0c5f0b43727c6f0e97b0fd1fecbde8b4f94d44fac2fe';

// 通用响应头
function getHeaders() {
  return {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// 处理 OPTIONS 预检请求
export function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: getHeaders(),
  });
}

// 处理 GET 请求 - 返回端点信息
export function onRequestGet() {
  const response = {
    status: 'active',
    endpoint: '/notion-webhook',
    methods: ['GET', 'POST'],
    description: 'Webhook endpoint for receiving and logging POST requests',
    timestamp: new Date().toISOString(),
    usage: {
      get: 'Returns this information',
      post: 'Logs received data and forwards to webhook'
    }
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: getHeaders(),
  });
}

// 处理 POST 请求 - 记录并转发数据
export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    // 获取请求信息
    const url = request.url;
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const contentType = request.headers.get('content-type') || 'unknown';
    
    // 读取请求体
    let body = '';
    let parsedBody = null;
    
    try {
      body = await request.text();
      if (contentType.includes('application/json') && body) {
        parsedBody = JSON.parse(body);
      }
    } catch (e) {
      console.log('Failed to parse request body:', e.message);
    }

    // 收集请求头信息
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      headers[key] = value;
    }

    // 记录到控制台
    const logData = {
      timestamp: new Date().toISOString(),
      method,
      url,
      userAgent,
      contentType,
      headers,
      rawBody: body,
      parsedBody,
    };

    console.log('=== Webhook POST Request Received ===');
    console.log(JSON.stringify(logData, null, 2));
    console.log('=====================================');

    // 准备转发的数据
    const forwardPayload = {
      source: 'notion-webhook-edgeone',
      receivedAt: new Date().toISOString(),
      originalRequest: {
        method,
        url,
        headers,
        body: parsedBody || body,
      },
      metadata: {
        userAgent,
        contentType,
      }
    };

    // 尝试转发到目标 webhook
    let forwardResult = null;
    try {
      const forwardResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forwardPayload),
      });

      forwardResult = {
        success: forwardResponse.ok,
        status: forwardResponse.status,
        statusText: forwardResponse.statusText,
      };

      console.log('Forward result:', forwardResult);
    } catch (forwardError) {
      forwardResult = {
        success: false,
        error: forwardError.message,
      };
      console.log('Forward failed:', forwardError.message);
    }

    // 返回处理结果
    const response = {
      status: 'received',
      timestamp: new Date().toISOString(),
      received: {
        method,
        contentType,
        bodyLength: body.length,
        hasJsonBody: !!parsedBody,
      },
      forward: forwardResult,
      message: 'Request logged successfully'
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: getHeaders(),
    });

  } catch (error) {
    console.error('Webhook error:', error);
    
    const errorResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      message: 'Failed to process webhook request'
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: getHeaders(),
    });
  }
}

// 兜底处理器 - 处理其他 HTTP 方法
export function onRequest(context) {
  const { request } = context;
  
  return new Response(JSON.stringify({
    status: 'method_not_allowed',
    method: request.method,
    message: 'Only GET, POST, and OPTIONS methods are supported',
    timestamp: new Date().toISOString(),
  }, null, 2), {
    status: 405,
    headers: getHeaders(),
  });
}

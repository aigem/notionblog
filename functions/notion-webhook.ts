/**
 * EdgeOne Pages Function: /notion-webhook
 * 简化版本，避免 EdgeOne 安全限制
 */

const WEBHOOK_URL = 'https://pages-api.cloud.tencent.com/v1/webhook/925b3880bb6f19ce0dca0c5f0b43727c6f0e97b0fd1fecbde8b4f94d44fac2fe';

// 简单的全局存储（用于在函数间共享数据）
declare global {
  var webhookRequests: any[];
}

// 初始化全局存储
if (typeof globalThis.webhookRequests === 'undefined') {
  globalThis.webhookRequests = [];
}

// 添加请求到历史记录
function addRequestToHistory(requestData: any) {
  const MAX_REQUESTS = 50;
  globalThis.webhookRequests.unshift({
    ...requestData,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
  
  // 只保留最近的请求
  if (globalThis.webhookRequests.length > MAX_REQUESTS) {
    globalThis.webhookRequests = globalThis.webhookRequests.slice(0, MAX_REQUESTS);
  }
}

// 通用响应头
function getHeaders() {
  return {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Cache-Control': 'no-cache',
    'X-Webhook-Status': 'active',
  };
}

// 处理 OPTIONS 预检请求
export function onRequestOptions() {
  console.log('OPTIONS request received');
  return new Response(null, {
    status: 204,
    headers: getHeaders(),
  });
}

// 处理 GET 请求 - 返回端点信息
export function onRequestGet(context: { request: Request; env?: any }) {
  const { request } = context;
  
  console.log('GET request received:', {
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString()
  });

  const response = {
    status: 'active',
    endpoint: '/notion-webhook',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Webhook endpoint for receiving and logging POST requests',
    timestamp: new Date().toISOString(),
    server: 'EdgeOne Pages Functions',
    usage: {
      get: 'Returns this information',
      post: 'Logs received data and forwards to webhook',
      example: 'curl -X POST -H "Content-Type: application/json" -d \'{"test":"data"}\' YOUR_DOMAIN/notion-webhook'
    }
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: getHeaders(),
  });
}

// 处理 POST 请求 - 记录并转发数据
export async function onRequestPost(context: { request: Request; env?: any }) {
  const { request } = context;
  
  console.log('POST request started at:', new Date().toISOString());
  
  try {
    // 基本请求信息
    const requestInfo = {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || 'unknown',
      contentType: request.headers.get('content-type') || 'unknown',
      timestamp: new Date().toISOString()
    };

    // 读取请求体
    let requestBody = '';
    let parsedBody = null;
    
    try {
      requestBody = await request.text();
      console.log('Raw request body:', requestBody);
      
      if (requestInfo.contentType.includes('application/json') && requestBody) {
        parsedBody = JSON.parse(requestBody);
        console.log('Parsed JSON body:', parsedBody);
      }
    } catch (parseError) {
      const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      console.log('Body parse error:', errorMsg);
    }

    // 收集所有请求头
    const allHeaders: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      allHeaders[key] = value;
    }

    // 完整的日志记录
    const fullLogData = {
      ...requestInfo,
      headers: allHeaders,
      rawBody: requestBody,
      parsedBody: parsedBody,
      bodyLength: requestBody.length
    };

    console.log('=== COMPLETE WEBHOOK DATA ===');
    console.log('=== COMPLETE WEBHOOK DATA ===');
    console.log(JSON.stringify(fullLogData, null, 2));
    console.log('=============================');

    // 记录到查看器
    // 记录到查看器
    try {
      addRequestToHistory({
        method: requestInfo.method,
        url: requestInfo.url,
        headers: allHeaders,
        rawBody: requestBody,
        parsedBody: parsedBody,
        userAgent: requestInfo.userAgent,
        contentType: requestInfo.contentType
      });
    } catch (e) {
      console.log('Failed to add request to viewer:', e);
    }

    // 准备转发数据
    const forwardData = {
      source: 'notion-webhook-edgeone',
      receivedAt: new Date().toISOString(),
      request: {
        method: requestInfo.method,
        url: requestInfo.url,
        headers: allHeaders,
        body: parsedBody || requestBody
      },
      metadata: {
        userAgent: requestInfo.userAgent,
        contentType: requestInfo.contentType,
        bodySize: requestBody.length
      }
    };

    // 尝试转发
    let forwardStatus = null;
    try {
      console.log('Attempting to forward to:', WEBHOOK_URL);
      
      const forwardResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EdgeOne-Webhook-Forwarder'
        },
        body: JSON.stringify(forwardData)
      });

      const responseText = await forwardResponse.text();
      
      forwardStatus = {
        success: forwardResponse.ok,
        status: forwardResponse.status,
        statusText: forwardResponse.statusText,
        responsePreview: responseText.slice(0, 500)
      };

      console.log('Forward completed:', forwardStatus);
      
    } catch (forwardError) {
      const errorMsg = forwardError instanceof Error ? forwardError.message : String(forwardError);
      forwardStatus = {
        success: false,
        error: errorMsg
      };
      console.log('Forward failed:', errorMsg);
    }

    // 返回成功响应
    const successResponse = {
      status: 'success',
      message: 'Webhook received and processed',
      timestamp: new Date().toISOString(),
      received: {
        method: requestInfo.method,
        contentType: requestInfo.contentType,
        bodyLength: requestBody.length,
        hasJsonBody: !!parsedBody,
        // 添加实际收到的数据到响应中
        receivedData: {
          rawBody: requestBody,
          parsedBody: parsedBody,
          headers: allHeaders
        }
      },
      forward: forwardStatus
    };

    console.log('Sending success response');
    
    return new Response(JSON.stringify(successResponse, null, 2), {
      status: 200,
      headers: getHeaders(),
    });

  } catch (mainError) {
    const errorMsg = mainError instanceof Error ? mainError.message : String(mainError);
    console.error('Main webhook error:', errorMsg);
    
    const errorResponse = {
      status: 'error',
      message: 'Webhook processing failed',
      error: errorMsg,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: getHeaders(),
    });
  }
}

// 默认处理器
export function onRequest(context: { request: Request; env?: any }) {
  const { request } = context;
  
  console.log('Unhandled request:', request.method, request.url);
  
  return new Response(JSON.stringify({
    status: 'method_not_supported',
    method: request.method,
    supportedMethods: ['GET', 'POST', 'OPTIONS'],
    message: 'This endpoint only supports GET, POST, and OPTIONS methods',
    timestamp: new Date().toISOString()
  }, null, 2), {
    status: 405,
    headers: getHeaders(),
  });
}
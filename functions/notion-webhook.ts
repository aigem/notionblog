/**
 * EdgeOne Pages Function: /notion-webhook
 * - GET: returns info about the endpoint
 * - POST: logs the received payload and forwards it to a specified webhook
 * - OPTIONS: CORS preflight support
 *
 * Routing:
 *   /functions/notion-webhook.ts  =>  https://your-pages-domain/notion-webhook
 */

const WEBHOOK_URL =
  'https://pages-api.cloud.tencent.com/v1/webhook/925b3880bb6f19ce0dca0c5f0b43727c6f0e97b0fd1fecbde8b4f94d44fac2fe';

function corsHeaders(): HeadersInit {
  return {
    'content-type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
  };
}

export function onRequestOptions(): Response {
  // CORS 预检
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function onRequestGet(): Response {
  const info = {
    message: 'notion-webhook endpoint is running',
    methods: ['GET', 'POST', 'OPTIONS'],
    description:
      'POST 任意数据到此端点，函数会在控制台输出收到的内容，并把整理后的数据转发到指定 webhook。',
    forwardedTo: WEBHOOK_URL,
    time: new Date().toISOString(),
    exampleCurl: `curl -X POST -H "Content-Type: application/json" -d "{\\"hello\\":\\"world\\"}" https://your-pages-domain/notion-webhook`,
  };

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function onRequestPost({ request, env }: { request: Request; env: Record<string, any> }): Promise<Response> {
  try {
    const contentType = request.headers.get('content-type') || '';
    // 统一读取原始文本
    const rawBody = await request.text();

    // 按需尝试解析 JSON
    let parsed: any = null;
    if (contentType.includes('application/json')) {
      try {
        parsed = JSON.parse(rawBody);
      } catch {
        // 非严格 JSON 时忽略解析错误，保留 rawBody
      }
    }

    // 记录请求头
    const headersObj: Record<string, string> = {};
    for (const [k, v] of request.headers.entries()) {
      headersObj[k.toLowerCase()] = v;
    }

    // 打印到函数控制台（在 EdgeOne 本地 dev 或平台日志中可见）
    console.log('[notion-webhook] Received POST:', {
      headers: headersObj,
      rawBody,
      parsed,
    });

    // 组织要转发到 webhook 的 payload（可随意自定义）
    const payload = {
      source: 'notion-webhook',
      receivedAt: new Date().toISOString(),
      headers: headersObj,
      rawBody,
      parsedBody: parsed,
      // 仅展示 env 的 key 名，避免敏感信息泄露
      envKeys: env ? Object.keys(env) : undefined,
      note: 'Forwarded by EdgeOne Pages Function',
    };

    // 转发到指定的 webhook
    const forwardResp = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let forwardText = '';
    try {
      forwardText = await forwardResp.text();
    } catch {
      // 忽略读取响应体失败
    }

    const result = {
      status: 'ok',
      forwarded: {
        url: WEBHOOK_URL,
        status: forwardResp.status,
        responseSnippet: forwardText?.slice(0, 2000),
      },
    };

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (err: any) {
    console.error('[notion-webhook] Error handling POST:', err);
    return new Response(
      JSON.stringify(
        {
          status: 'error',
          message: err?.message || 'Unknown error',
        },
        null,
        2,
      ),
      { status: 500, headers: corsHeaders() },
    );
  }
}
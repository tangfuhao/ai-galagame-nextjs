interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function fetchApi(url: string, options: FetchOptions = {}) {
  const { skipAuth = false, headers = {}, ...rest } = options;

  // 如果不是跳过认证，且存在 auth_token，则添加到请求头
  const finalHeaders = new Headers(headers);
  if (!skipAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      finalHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  // 如果 URL 是相对路径且以 /api 开头，使用完整 URL
  const fullUrl = url.startsWith('/api') 
    ? url 
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...rest,
    headers: finalHeaders,
  });

  return response;
}

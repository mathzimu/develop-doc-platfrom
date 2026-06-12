# 实战项目：类型安全的 API 客户端

从零构建一个类型安全的 HTTP 客户端，利用 TypeScript 泛型自动推导请求和响应类型。

## 定义 API 端点类型

```ts
interface Endpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, string>
  query?: Record<string, string | number | boolean>
  body?: unknown
  response: unknown
}
```

## 具体端点定义

```ts
interface GetUser extends Endpoint {
  method: 'GET'
  path: '/users/:id'
  params: { id: string }
  response: { id: string; name: string; email: string }
}

interface CreateUser extends Endpoint {
  method: 'POST'
  path: '/users'
  body: { name: string; email: string; age?: number }
  response: { id: string }
}

interface UpdateUser extends Endpoint {
  method: 'PUT'
  path: '/users/:id'
  params: { id: string }
  body: { name?: string; email?: string }
  response: { success: boolean }
}

interface ListUsers extends Endpoint {
  method: 'GET'
  path: '/users'
  query: { page?: number; limit?: number; search?: string }
  response: { items: Array<{ id: string; name: string }>; total: number }
}
```

## 泛型请求函数

```ts
type ExtractParams<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : P extends `${string}:${infer Param}`
      ? Param
      : never

type URLParams<E extends Endpoint> = E['params'] extends Record<string, string>
  ? { [K in keyof E['params']]: string }
  : Record<string, never>

type QueryParams<E extends Endpoint> = E['query'] extends Record<string, any>
  ? E['query']
  : Record<string, never>

async function request<E extends Endpoint>(
  endpoint: E,
  options: {
    params?: URLParams<E>
    query?: QueryParams<E>
    body?: E['body']
  } = {},
): Promise<E['response']> {
  let url = endpoint.path

  // Replace path params
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url = url.replace(`:${key}`, encodeURIComponent(value))
    }
  }

  // Build query string
  if (options.query) {
    const qs = new URLSearchParams()
    for (const [key, value] of Object.entries(options.query)) {
      qs.append(key, String(value))
    }
    url += `?${qs.toString()}`
  }

  const response = await fetch(url, {
    method: endpoint.method,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  return response.json()
}
```

## 错误处理

```ts
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(`API Error [${statusCode}]: ${message}`)
  }
}

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }

async function safeRequest<E extends Endpoint>(
  endpoint: E,
  options?: Parameters<typeof request<E>>[1],
): Promise<Result<E['response']>> {
  try {
    const data = await request(endpoint, options)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error }
    }
    throw error
  }
}
```

## 拦截器

```ts
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: Response) => Response | Promise<Response>

interface RequestConfig {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
}

class APIClient {
  private baseURL: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  async request<E extends Endpoint>(
    endpoint: E,
    options: {
      params?: URLParams<E>
      query?: QueryParams<E>
      body?: E['body']
    } = {},
  ): Promise<E['response']> {
    let url = `${this.baseURL}${endpoint.path}`
    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        url = url.replace(`:${key}`, encodeURIComponent(value))
      }
    }
    if (options.query) {
      const qs = new URLSearchParams()
      for (const [key, value] of Object.entries(options.query)) {
        qs.append(key, String(value))
      }
      url += `?${qs.toString()}`
    }

    let config: RequestConfig = {
      url,
      method: endpoint.method,
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
    }

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config)
    }

    let response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.body,
    })

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response)
    }

    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return response.json()
  }
}
```

## 完整示例

```ts
const api = new APIClient('https://api.example.com')

// 添加认证拦截器
api.addRequestInterceptor(config => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: `Bearer ${getToken()}`,
  },
}))

// 添加日志拦截器
api.addResponseInterceptor(async response => {
  console.log(`${response.status} ${response.url}`)
  return response
})

// 类型安全的 API 调用
async function main() {
  // GET /users/123 — 自动推导返回类型为 GetUser['response']
  const user = await api.request<GetUser>({
    method: 'GET',
    path: '/users/:id',
    params: { id: '123' },
  })
  console.log(user.name)  // ✓ 类型安全

  // POST /users — 自动推导 body 类型
  const created = await api.request<CreateUser>({
    method: 'POST',
    path: '/users',
    body: { name: 'Alice', email: 'alice@example.com' },
  })
  console.log(created.id)  // ✓ 类型安全

  // GET /users?page=1&limit=10
  const list = await safeRequest<ListUsers>({
    method: 'GET',
    path: '/users',
    query: { page: 1, limit: 10 },
  })

  if (list.success) {
    console.log(`Total: ${list.data.total}`)
  } else {
    console.error(list.error.message)
  }
}
```

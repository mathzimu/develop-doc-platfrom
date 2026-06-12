# React 工程实践

## 项目结构

```
src/
├── app/                  # 应用层
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx      # Context 提供者组合
├── features/             # 功能模块
│   ├── auth/
│   │   ├── api.ts
│   │   ├── components/
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── dashboard/
├── shared/               # 共享模块
│   ├── api/              # 通用 API 客户端
│   ├── components/       # 通用组件
│   ├── hooks/            # 通用 Hooks
│   ├── utils/            # 工具函数
│   └── types/            # 全局类型
├── layouts/              # 布局组件
├── styles/               # 全局样式
└── test/                 # 测试工具
```

## API 层封装

```ts
// shared/api/client.ts
import { create } from 'apisauce'
import { useAuthStore } from '@/features/auth/store'

const api = create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.addRequestTransform(request => {
  const token = useAuthStore.getState().token
  if (token) {
    request.headers!['Authorization'] = `Bearer ${token}`
  }
})

api.addResponseTransform(response => {
  if (response.status === 401) {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }
  if (response.status === 403) {
    navigate('/forbidden')
  }
})

async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, params)
  if (!response.ok) throw new ApiError(response)
  return response.data!
}

export const apiClient = { get, post, put, del }
```

## 全局状态 + 服务端状态

```ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'

function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get<User[]>('/users', params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 3,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('创建成功')
    },
    onError: (error: ApiError) => {
      toast.error(error.message)
    },
  })
}

// 乐观更新
function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.patch(`/todos/${id}`, { done: true }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData(['todos'])
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(t => t.id === id ? { ...t, done: true } : t)
      )
      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['todos'], context?.previous)
      toast.error('操作失败')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

## 表单处理

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(8, '密码至少8位').max(128),
  remember: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  })

  const mutation = useLogin()

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} aria-invalid={!!errors.email} />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <label>
        <input type="checkbox" {...register('remember')} />
        记住我
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
```

## 权限管理

```tsx
function usePermissions() {
  const { user } = useAuth()
  const permissions = user?.permissions ?? []

  return {
    can: (action: string, resource: string) =>
      permissions.includes(`${resource}:${action}`),
    canAny: (actions: string[], resource: string) =>
      actions.some(a => permissions.includes(`${resource}:${a}`)),
    role: user?.role,
    isAdmin: user?.role === 'admin',
  }
}

function RequireAuth({ permissions, children }: Props) {
  const { can } = usePermissions()
  const hasAccess = permissions.some(p => can(p.action, p.resource))

  if (!hasAccess) return <Navigate to="/forbidden" />
  return <>{children}</>
}

<RequireAuth permissions={[{ action: 'edit', resource: 'users' }]}>
  <UserEditPage />
</RequireAuth>
```

## 国际化

```tsx
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n.use(initReactI18next).use(Backend).init({
  fallbackLng: 'zh-CN',
  supportedLngs: ['zh-CN', 'en-US', 'ja-JP'],
  ns: ['common', 'auth', 'dashboard'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
})

import { useTranslation } from 'react-i18next'
function Welcome() {
  const { t, i18n } = useTranslation('auth')
  return <h1>{t('welcome', { name: user.name })}</h1>
}
```

## 监控与性能

```tsx
import { onLCP, onFID, onCLS, onINP } from 'web-vitals'

function reportWebVitals() {
  onLCP(metric => sendToAnalytics('LCP', metric.value))
  onFID(metric => sendToAnalytics('FID', metric.value))
  onCLS(metric => sendToAnalytics('CLS', metric.value))
  onINP(metric => sendToAnalytics('INP', metric.value))
}

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  if (actualDuration > 16) {
    console.warn(`Slow render: ${id} took ${actualDuration}ms`)
    sendToAnalytics('slow-render', { id, phase, duration: actualDuration })
  }
}

<Profiler id="UserList" onRender={onRenderCallback}>
  <UserList />
</Profiler>
```

## Sentry 集成

```tsx
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// 使用 Sentry ErrorBoundary
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <Sentry.ErrorBoundary fallback={<ErrorPage />}>
    <App />
  </Sentry.ErrorBoundary>
)

// 手动上报错误
try {
  someRiskyOperation()
} catch (error) {
  Sentry.captureException(error)
}
```

## 测试

使用 React Testing Library + Vitest 进行组件测试：

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>点击</Button>)
    expect(screen.getByText('点击')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>点击</Button>)
    fireEvent.click(screen.getByText('点击'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when loading', () => {
    render(<Button loading>提交</Button>)
    expect(screen.getByText('提交')).toBeDisabled()
  })
})
```

配置 `vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
```

## CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build
```

## 包体积分析

```sh
# 安装
npm install -D vite-bundle-visualizer

# 分析
npx vite-bundle-visualizer

# 在 package.json 中添加脚本
# "analyze": "vite-bundle-visualizer"
```

使用动态导入减少首屏体积：

```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Settings = React.lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

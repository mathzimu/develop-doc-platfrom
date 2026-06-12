# React 教程

React 是一个用于构建用户界面的 JavaScript 库，基于组件化的思想，由 Facebook 开发并维护。

```sh
# 创建 React 项目
npx create-react-app my-app
npm create vite@latest my-app -- --template react-ts  # Vite 方式
```

## 组件

### 函数组件

```tsx
// 组件是返回 JSX 的函数
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// 使用组件
function App() {
  return (
    <div>
      <Welcome name="React" />
      <Welcome name="World" />
    </div>
  )
}
```

### 组件 Props

```tsx
interface CardProps {
  title: string
  description?: string  // 可选 prop
  children?: React.ReactNode  // 子元素
  onAction?: () => void  // 事件回调
}

function Card({ title, description, children, onAction }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
      {onAction && <button onClick={onAction}>操作</button>}
    </div>
  )
}
```

### 条件渲染

```tsx
function Greeting({ isLoggedIn, name }: { isLoggedIn: boolean; name: string }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>欢迎回来, {name}!</h1>
      ) : (
        <button onClick={login}>登录</button>
      )}
    </div>
  )
}

// && 短路
function Notification({ message }: { message?: string }) {
  return <div>{message && <p>{message}</p>}</div>
}
```

### 列表渲染

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>  {/* key 必须唯一且稳定 */}
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  )
}
```

## Hooks

### useState

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)       // 基础状态
  const [user, setUser] = useState<User | null>(null)  // 复杂状态

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}
```

### useEffect

```tsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchUser() {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/${userId}`)
        const data = await res.json()
        if (!cancelled) setUser(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUser()

    return () => { cancelled = true }  // 清理函数
  }, [userId])  // 依赖项变化时重新执行

  if (loading) return <div>加载中...</div>
  return <div>{user?.name}</div>
}
```

### useRef

```tsx
import { useRef, useEffect } from 'react'

function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()  // 组件挂载后自动聚焦
  }, [])

  return <input ref={inputRef} type="text" />
}

// 存储可变值（不触发重渲染）
function Timer() {
  const countRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      countRef.current++
      console.log(countRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [])
}
```

### useMemo 与 useCallback

```tsx
import { useMemo, useCallback } from 'react'

function ExpensiveList({ items, filter }: Props) {
  // 缓存计算结果
  const filtered = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  )

  // 缓存函数引用
  const handleClick = useCallback(
    (id: number) => console.log('Clicked:', id),
    []
  )

  return filtered.map(item => (
    <div key={item.id} onClick={() => handleClick(item.id)}>
      {item.name}
    </div>
  ))
}
```

### useContext

```tsx
import { createContext, useContext, useState } from 'react'

// 创建 Context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

// Provider 提供值
function App() {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 消费 Context
function ToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <button onClick={toggleTheme}>当前: {theme}</button>
}
```

### useReducer

```tsx
import { useReducer } from 'react'

type State = { count: number }
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset'; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'decrement': return { count: state.count - 1 }
    case 'reset':     return { count: action.payload }
    default:          return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>重置</button>
    </div>
  )
}
```

## 自定义 Hook

```tsx
// 自定义 Hook 以 use 开头
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

## 事件处理

```tsx
function Form() {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交:', value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} />
      <button type="submit">提交</button>
    </form>
  )
}
```

## 样式方案

```tsx
// 1. CSS 类名
import './Button.css'
<button className="btn btn-primary">点击</button>

// 2. CSS Modules
import styles from './Button.module.css'
<button className={styles.primary}>点击</button>

// 3. 行内样式
<button style={{
  backgroundColor: 'blue',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '4px',
}}>点击</button>

// 4. Tailwind CSS
<button className="bg-blue-500 text-white px-4 py-2 rounded">点击</button>
```

## 性能优化

1. **使用 `React.memo`**：避免 props 未变时的重渲染
   ```tsx
   const UserCard = React.memo(({ user }: { user: User }) => {
     return <div>{user.name}</div>
   })
   ```
2. **使用 `useMemo` / `useCallback`**：缓存计算和函数引用
3. **虚拟列表**：大数据列表使用 `react-window` 或 `react-virtuoso`
4. **代码分割**：`React.lazy` + `Suspense`
   ```tsx
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
   <Suspense fallback={<div>加载中...</div>}>
     <HeavyComponent />
   </Suspense>
   ```
5. **避免不必要的状态提升**：状态尽量下沉
6. **key 属性**：列表项使用稳定且唯一的 key

---

# 企业级实践

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

// 请求拦截：注入 Token
api.addRequestTransform(request => {
  const token = useAuthStore.getState().token
  if (token) {
    request.headers!['Authorization'] = `Bearer ${token}`
  }
})

// 响应拦截：统一错误处理
api.addResponseTransform(response => {
  if (response.status === 401) {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }
  if (response.status === 403) {
    navigate('/forbidden')
  }
})

// 类型安全封装
async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, params)
  if (!response.ok) throw new ApiError(response)
  return response.data!
}

export const apiClient = { get, post, put, del }
```

## 全局状态 + 服务端状态

```ts
// 服务端状态使用 TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 查询
function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get<User[]>('/users', params),
    staleTime: 30_000,        // 30秒内不重新请求
    gcTime: 5 * 60_000,       // 5分钟缓存
    retry: 3,                 // 失败重试 3 次
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,  // 分页时保留旧数据
  })
}

// 变更
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

// 权限组件
function RequireAuth({ permissions, children }: Props) {
  const { can } = usePermissions()
  const hasAccess = permissions.some(p => can(p.action, p.resource))

  if (!hasAccess) return <Navigate to="/forbidden" />
  return <>{children}</>
}

// 使用
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

// 使用
import { useTranslation } from 'react-i18next'
function Welcome() {
  const { t, i18n } = useTranslation('auth')
  return <h1>{t('welcome', { name: user.name })}</h1>
}
```

## 监控与性能

```tsx
// Web Vitals 上报
import { onLCP, onFID, onCLS, onINP } from 'web-vitals'

function reportWebVitals() {
  onLCP(metric => sendToAnalytics('LCP', metric.value))
  onFID(metric => sendToAnalytics('FID', metric.value))
  onCLS(metric => sendToAnalytics('CLS', metric.value))
  onINP(metric => sendToAnalytics('INP', metric.value))
}

// 组件 Profiler
function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  if (actualDuration > 16) {  // 超过一帧（60fps）
    console.warn(`Slow render: ${id} took ${actualDuration}ms`)
    sendToAnalytics('slow-render', { id, phase, duration: actualDuration })
  }
}

<Profiler id="UserList" onRender={onRenderCallback}>
  <UserList />
</Profiler>
```

---

## 生态全景

```
┌─────────────────────────────────────────────┐
│              React 生态系统                    │
├──────────────────┬──────────────────────────┤
│   元框架          │  状态管理                 │
│   Next.js        │  Zustand, Jotai          │
│   Remix          │  Redux Toolkit           │
│   Gatsby         │  XState                  │
├──────────────────┼──────────────────────────┤
│   数据获取        │  样式                    │
│   TanStack Query │  Tailwind CSS            │
│   SWR            │  styled-components       │
│   RTK Query      │  CSS Modules             │
├──────────────────┼──────────────────────────┤
│   表单            │  测试                    │
│   React Hook Form│  Testing Library         │
│   Formik         │  Vitest                  │
│   TanStack Form  │  Playwright              │
├──────────────────┼──────────────────────────┤
│   动画            │  组件库                  │
│   Framer Motion  │  shadcn/ui               │
│   React Spring   │  Radix UI                │
│   GSAP           │  MUI, Ant Design         │
└──────────────────┴──────────────────────────┘
```

### 元框架选型

| 框架 | 路由 | 数据 | 部署 | 适用场景 |
|------|------|------|------|---------|
| **Next.js** | 文件路由 | RSC/SSR/SSG | Vercel | 全场景 |
| **Remix** | 文件路由 | Loader/Action | Fly.io | 数据密集 |
| **Gatsby** | 文件路由 | GraphQL | Netlify | 内容站点 |

### 组件库决策

```
shadcn/ui (推荐) —— 基于 Radix + Tailwind，可复制、可定制
Radix UI         —— 无样式、无障碍原语
Ark UI           —— 无样式、Chakra UI 团队新作
MUI             —— Material Design 完整实现
Ant Design      —— 企业级、中后台首选
Chakra UI       —— 主题系统强大
Headless UI     —— Tailwind 团队无样式组件
```

### 全栈脚手架

```sh
# Next.js 全栈
npx create-next-app@latest my-app --typescript --tailwind --app

# 依赖
npm install @tanstack/react-query zustand react-hook-form zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install -D @playwright/test vitest @testing-library/react
```

### Monorepo 结构的 React 项目

```
apps/
  web/        —— Next.js
  admin/      —— React + Vite
  mobile/     —— React Native
packages/
  ui/         —— 组件库
  utils/      —— 工具函数
  config/     —— ESLint/TypeScript 配置
```

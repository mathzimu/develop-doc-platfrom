# React 基础语法

React 是一个用于构建用户界面的 JavaScript 库，基于组件化的思想，由 Facebook 开发并维护。

```sh
# 创建 React 项目
npx create-react-app my-app
npm create vite@latest my-app -- --template react-ts  # Vite 方式
```

## 组件

### 函数组件

组件是返回 JSX 的函数，是 React 应用的基本构建单元。

::: tip
初次学习组件概念，建议阅读 [react.dev 官方教程](https://react.dev/learn)。
:::

```tsx
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

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

Props 是组件的输入参数，用于从父组件向子组件传递数据。Props 是只读的，子组件不应修改它。

```tsx
interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
  onAction?: () => void
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

React 中使用 JavaScript 的条件语句来控制渲染内容，常用三元表达式和 `&&` 短路运算。

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

// && 短路：当 message 为 falsy 时不渲染任何内容
function Notification({ message }: { message?: string }) {
  return <div>{message && <p>{message}</p>}</div>
}
```

### 列表渲染

使用 `map` 方法将数组转换为 JSX 元素，每个元素需要一个唯一的 `key` 属性帮助 React 进行高效的 DOM diff。

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  )
}
```

`key` 必须稳定且唯一，优先使用数据中的唯一 ID。避免使用数组索引作为 key（除非列表静态不变且无增删操作），因为索引变化会导致 React 错误地复用组件状态。

## Hooks

Hooks 是 React 16.8 引入的特性，允许在函数组件中使用状态和生命周期能力。详见 [React Hooks 参考](https://react.dev/reference/react/hooks)。

### useState

`useState` 是最基础的 Hook，用于声明组件的状态变量。调用 `setState` 会触发组件重新渲染。

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}
```

`setCount(c => c + 1)` 使用函数式更新，可以获取最新的 state 值，避免闭包陷阱。

### useEffect

`useEffect` 用于处理副作用：数据获取、订阅、手动修改 DOM、定时器等。返回值是清理函数，在组件卸载或依赖变化前执行。

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

    return () => { cancelled = true }
  }, [userId])

  if (loading) return <div>加载中...</div>
  return <div>{user?.name}</div>
}
```

依赖数组 `[userId]` 控制 effect 执行时机：
- 空数组 `[]`：仅在挂载时执行一次
- 有依赖项：依赖变化时重新执行
- 省略：每次渲染都执行（不推荐）

### useRef

`useRef` 返回一个可变的 ref 对象，`.current` 属性在组件的整个生命周期内保持不变。修改 ref 不会触发重新渲染。

```tsx
import { useRef, useEffect } from 'react'

function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
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

`useMemo` 缓存计算结果，`useCallback` 缓存函数引用。它们都只在依赖变化时才重新计算/创建，用于性能优化。

```tsx
import { useMemo, useCallback } from 'react'

function ExpensiveList({ items, filter }: Props) {
  const filtered = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  )

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

不要滥用这两个 Hook。只有当计算代价高昂或引用稳定性影响子组件渲染时才使用。

### useContext

`useContext` 用于消费 React Context，避免 props drilling（逐层传递 props）。

```tsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

function App() {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}

function ToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <button onClick={toggleTheme}>当前: {theme}</button>
}
```

### useReducer

`useReducer` 是 `useState` 的替代方案，适用于复杂的状态逻辑。通过 dispatch action 来触发状态更新，状态变更逻辑集中在一个 reducer 函数中。

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

自定义 Hook 是复用状态逻辑的方式。它以 `use` 开头，内部可以调用其他 Hook。

```tsx
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

React 事件使用驼峰命名，传入函数引用而非字符串。事件参数是合成事件（SyntheticEvent），跨浏览器兼容。

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

React 支持多种样式方案，根据项目需求选择合适的方式。

```tsx
// 1. CSS 类名
import './Button.css'
<button className="btn btn-primary">点击</button>

// 2. CSS Modules —— 自动生成唯一类名，避免冲突
import styles from './Button.module.css'
<button className={styles.primary}>点击</button>

// 3. 行内样式 —— 动态样式场景
<button style={{
  backgroundColor: 'blue',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '4px',
}}>点击</button>

// 4. Tailwind CSS —— 原子化 CSS
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
3. **虚拟列表**：大数据列表使用 `react-window` 或 `react-virtuoso`，只渲染可视区域
4. **代码分割**：`React.lazy` + `Suspense` 按需加载组件
   ```tsx
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
   <Suspense fallback={<div>加载中...</div>}>
     <HeavyComponent />
   </Suspense>
   ```
5. **避免不必要的状态提升**：状态尽量下沉到需要它的最近组件
6. **key 属性**：列表项使用稳定且唯一的 key，避免使用数组索引

::: tip
性能优化应基于实际测量（React DevTools Profiler），不要过早优化。
:::

## 官方文档与延伸阅读

- **官方文档**：[react.dev](https://react.dev/learn) · [中文文档](https://zh-hans.react.dev/learn)
- **API 参考**：[React Reference](https://react.dev/reference/react) · [Hooks 索引](https://react.dev/reference/react/hooks)
- **元框架**：[Next.js](https://nextjs.org/docs) · [React Router](https://reactrouter.com/) · [Remix](https://remix.run/docs)
- **状态管理**：[TanStack Query](https://tanstack.com/query/latest/docs) · [Zustand](https://zustand.docs.pmnd.rs/) · [Redux Toolkit](https://redux-toolkit.js.org/)
- **测试**：[Testing Library](https://testing-library.com/docs/react-testing-library/intro/) · [Playwright](https://playwright.dev/docs/intro)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

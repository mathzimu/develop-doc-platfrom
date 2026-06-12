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

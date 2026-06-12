# React 进阶深入

## React 渲染机制

### Fiber 架构

React 16 引入 Fiber 架构，将渲染过程拆分为可中断的小单元，实现了：

- **可中断渲染**：将渲染工作分割成小任务，通过 `requestIdleCallback` 在浏览器空闲时执行
- **优先级调度**：高优先级更新（如用户输入）可打断低优先级更新（如数据加载）
- **并发模式**：多个更新可以同时进行，React 根据优先级决定渲染顺序

Fiber 节点结构：
```ts
interface Fiber {
  tag: WorkTag          // 组件类型（函数组件、类组件等）
  key: string | null    // 列表 key
  type: any             // 组件本身
  stateNode: any        // 对应真实 DOM 或组件实例
  child: Fiber | null   // 第一个子节点
  sibling: Fiber | null // 下一个兄弟节点
  return: Fiber | null  // 父节点
  pendingProps: any     // 新的 props
  memoizedProps: any    // 上次渲染的 props
  memoizedState: any    // 上次渲染的状态（hooks 链表）
  effectTag: SideEffectTag // 副作用标记（插入、更新、删除）
  nextEffect: Fiber | null // 下一个有副作用的节点
}
```

### 协调（Reconciliation）

React 通过 Diff 算法比较两棵虚拟 DOM 树，确定需要更新的部分：

- **同层比较**：只对同一层级的节点进行比较
- **类型判断**：如果节点类型不同，直接卸载旧树并构建新树
- **key 属性**：通过 key 识别列表中哪些节点可以复用

```tsx
// 合理的 key 帮助 React 高效复用
{items.map(item => <ListItem key={item.id} item={item} />)}
```

key 值的原则：

- 必须是稳定且唯一的
- 优先使用数据 ID，而非数组索引
- 索引作为 key 时，在列表头部插入元素会导致全部重建

### 渲染阶段

1. **Render 阶段**：构建 Fiber 树，收集副作用（可中断）
2. **Commit 阶段**：将副作用提交到 DOM（不可中断）

## Hooks 原理

### 闭包陷阱（Stale Closure）

Hooks 依赖闭包保存状态，但每次渲染都会创建新的闭包。如果忘记更新依赖，闭包会捕获旧值。

```tsx
function BuggyCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1) // ❌ count 永远是 0
    }, 1000)
    return () => clearInterval(id)
  }, []) // 依赖数组为空
}

function FixedCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1) // ✅ 函数式更新
    }, 1000)
    return () => clearInterval(id)
  }, [])
}
```

解决方案：
- 使用函数式更新（`setCount(c => c + 1)`）
- 使用 `useRef` 保存最新值
- 正确填写依赖数组

### 自定义 Hook 组合模式

```tsx
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading }
}

function useUserActions(userId: string) {
  const queryClient = useQueryClient()

  const updateUser = useMutation({
    mutationFn: (data: Partial<User>) => api.patch(`/users/${userId}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] }),
  })

  return { updateUser }
}

// 组合使用
function UserProfile({ userId }: { userId: string }) {
  const { user, loading } = useUser(userId)
  const { updateUser } = useUserActions(userId)
  // ...
}
```

## Context 性能优化

Context 的值变化时，所有消费该 Context 的组件都会重新渲染。

### 拆分 Context

将变化频繁的值与不常变化的值拆分到不同的 Context 中：

```tsx
const ThemeContext = createContext('light')
const UserContext = createContext<User | null>(null)

function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
```

### 使用 useMemo 避免不必要的重新渲染

```tsx
function App() {
  const [theme, setTheme] = useState('light')

  const contextValue = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <Layout />
    </ThemeContext.Provider>
  )
}
```

## Error Boundary

Error Boundary 是类组件，用于捕获子组件树中的 JavaScript 错误，防止整个应用崩溃。

```tsx
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>出错了</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>重试</button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Portals

Portal 将子节点渲染到父组件之外的 DOM 节点中，常用于模态框、提示框、下拉菜单。

```tsx
import { createPortal } from 'react-dom'

function Modal({ isOpen, onClose, children }: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}
```

## Refs 进阶

### forwardRef

`forwardRef` 允许父组件直接访问子组件的 DOM 节点。

```tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)

function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <Input ref={inputRef} placeholder="聚焦我" />
}
```

### useImperativeHandle

`useImperativeHandle` 自定义暴露给父组件的实例值，限制父组件可访问的属性和方法。

```tsx
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  value: string
}

const CustomInput = forwardRef<CustomInputHandle, InputProps>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => { if (inputRef.current) inputRef.current.value = '' },
      get value() { return inputRef.current?.value ?? '' },
    }), [])

    return <input ref={inputRef} {...props} />
  }
)
```

## Suspense 与数据获取

Suspense 让组件在等待异步操作时可以"暂停"渲染，显示 fallback 内容。

```tsx
// 传统方式：手动管理 loading
function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileDetails />
      <Suspense fallback={<LoadingPosts />}>
        <ProfilePosts />
      </Suspense>
    </Suspense>
  )
}
```

使用 `use` Hook（React 19）或配合 TanStack Query 的 `suspense` 模式：

```tsx
function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),
    suspense: true,
  })
}
```

## React 18 新特性

### Concurrent Mode

并发模式允许 React 同时准备多个 UI 版本，根据优先级决定渲染顺序。

### useTransition

标记低优先级更新，允许被高优先级更新打断：

```tsx
import { useTransition, useState } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 输入框更新是高优先级
    startTransition(() => {
      // 列表过滤是低优先级
      setQuery(e.target.value)
    })
  }

  return (
    <div>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
      <SearchResults query={query} />
    </div>
  )
}
```

### useDeferredValue

延迟更新某个值，类似于 debounce 但由 React 调度控制：

```tsx
import { useDeferredValue } from 'react'

function SearchPage({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <SearchResults query={deferredQuery} />
    </div>
  )
}
```

### Automatic Batching

React 18 在微任务中也自动批处理状态更新，减少不必要的渲染：

```tsx
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18：一次重渲染
}

fetch('/api/data').then(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18：自动批处理 ✅
  // React 17：两次重渲染 ❌
})
```

## 高阶组件（HOC）vs Render Props vs Hooks

| 模式 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **HOC** | 逻辑复用、可组合 | 命名冲突、props 来源不明、调试困难 | 遗留项目、需要包装组件的场景 |
| **Render Props** | 灵活、职责清晰 | 嵌套地狱、代码冗长 | 需要完全控制渲染逻辑的场景 |
| **Hooks** | 简洁、类型安全、无嵌套 | 依赖数组管理、闭包陷阱 | 现代 React 首选方案 |

```tsx
// HOC
function withAuth<P>(Component: React.ComponentType<P & AuthProps>) {
  return function AuthenticatedComponent(props: P) {
    const auth = useAuth()
    if (!auth.user) return <Navigate to="/login" />
    return <Component {...props} {...auth} />
  }
}

// Render Props
function AuthGuard({ children }: { children: (auth: AuthContext) => React.ReactNode }) {
  const auth = useAuth()
  return <>{children(auth)}</>
}

// Hooks（推荐）
function Dashboard() {
  const { user, logout } = useAuth()
  return <div>Welcome {user?.name}</div>
}
```

## 状态管理方案对比

| 方案 | 理念 | 包体积 | 学习曲线 | 适用场景 |
|------|------|--------|---------|---------|
| **Zustand** | 轻量、hooks 原生 | ~1KB | 低 | 中小型项目、简单全局状态 |
| **Redux Toolkit** | 约定式、中间件 | ~12KB | 中 | 大型项目、复杂状态逻辑 |
| **Jotai** | 原子化、模块化 | ~3KB | 低 | 需要细粒度订阅的场景 |
| **XState** | 状态机驱动 | ~15KB | 高 | 复杂流程控制、状态图可视化 |

```ts
// Zustand 示例
import { create } from 'zustand'

interface BearStore {
  bears: number
  increase: () => void
  reset: () => void
}

const useBearStore = create<BearStore>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
  reset: () => set({ bears: 0 }),
}))
```

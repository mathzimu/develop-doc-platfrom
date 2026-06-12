# JavaScript 教程

JavaScript 是一种轻量级的解释型（或 JIT 编译）编程语言，是 Web 开发的三大核心技术之一，为网页添加交互与动态行为。

## 基础语法

### 变量声明

```js
// var - 函数作用域，避免使用
var old = '不推荐';

// let - 块级作用域，可重新赋值
let count = 0;
count = 1;

// const - 块级作用域，不可重新赋值
const PI = 3.14159;
const user = { name: 'Alice' };
user.name = 'Bob';  // 对象内容可修改
```

| 声明 | 作用域 | 可重新赋值 | 提升 | 推荐 |
|------|--------|-----------|------|------|
| `var` | 函数级 | 是 | 是 | 不推荐 |
| `let` | 块级 | 是 | 否（暂存死区） | 可变变量 |
| `const` | 块级 | 否 | 否（暂存死区） | 默认首选 |

### 数据类型

```js
// 基本类型（不可变）
const str = 'string'          // 字符串
const num = 42                // 数字
const big = 9007199254740991n // BigInt
const bool = true             // 布尔
const und = undefined          // 未定义
const nul = null               // 空值
const sym = Symbol('unique')  // 符号

// 引用类型（可变）
const arr = [1, 2, 3]         // 数组
const obj = { key: 'value' }  // 对象
const fn = () => {}           // 函数
const date = new Date()       // Date
const reg = /test/gi          // 正则
const map = new Map()         // Map
const set = new Set()         // Set

// 类型检查
typeof 'hello'        // 'string'
typeof 42            // 'number'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof null          // 'object'（历史遗留 bug）
typeof []            // 'object'
Array.isArray([])    // true
```

### 类型转换

```js
// 显式转换
String(123)          // '123'
Number('123')        // 123
Boolean(1)           // true
parseInt('42px')     // 42
parseFloat('3.14')   // 3.14

// 隐式转换（注意）
'5' - 2              // 3
'5' + 2              // '52'（+ 也是字符串拼接）
!'hello'             // false
!!'hello'            // true

// 假值
false, 0, '', null, undefined, NaN
```

### 运算符

```js
// 算术
+ - * / % **         // 加 减 乘 除 取余 幂

// 赋值
= += -= *= /= **=

// 比较
== != === !== > < >= <=

// 逻辑
&& || ??             // AND OR 空值合并
??=                  // 空值赋值

// 可选链
user?.address?.city  // 安全访问嵌套属性

// 展开
const copy = [...arr]
const merged = { ...obj1, ...obj2 }
```

## 字符串

```js
const str = 'Hello'
str.length                // 5
str[0]                    // 'H'
str.charAt(0)             // 'H'
str.includes('ell')       // true
str.startsWith('He')      // true
str.endsWith('lo')        // true
str.indexOf('l')          // 2
str.slice(0, 2)           // 'He'
str.substring(0, 2)       // 'He'
str.toUpperCase()         // 'HELLO'
str.toLowerCase()         // 'hello'
str.replace('l', 'x')     // 'Hexlo'
str.replaceAll('l', 'x')  // 'Hexxo'
str.trim()                // 去首尾空格
str.split(',')            // 拆分数组

// 模板字面量
const name = 'World'
const greeting = `Hello, ${name}!`  // 'Hello, World!'
const multiline = `
  多行
  字符串
`
```

## 数组

```js
const arr = [3, 1, 4, 1, 5]

arr.length               // 5
arr[0]                   // 3
arr.at(-1)               // 5（支持负数索引）
arr.push(9)              // 末尾添加，返回新长度
arr.pop()                // 末尾移除，返回移除元素
arr.unshift(0)           // 开头添加
arr.shift()              // 开头移除
arr.includes(1)          // true
arr.indexOf(4)           // 2
arr.find(x => x > 3)     // 4（第一个匹配）
arr.findIndex(x => x > 3) // 2
arr.some(x => x > 4)     // true（任一满足）
arr.every(x => x > 0)    // true（全部满足）

// 迭代方法（不修改原数组）
arr.forEach(x => console.log(x))
arr.map(x => x * 2)        // [6,2,8,2,10]
arr.filter(x => x > 2)     // [3,4,5]
arr.reduce((a, b) => a + b, 0) // 14
arr.sort((a, b) => a - b)  // [1,1,3,4,5]
arr.reverse()
arr.slice(1, 3)            // [1,4]

// 解构
const [first, second] = arr
const [head, ...tail] = arr  // head=3, tail=[1,4,1,5]
```

## 对象

```js
const user = {
  name: 'Alice',
  age: 30,
  'full-name': 'Alice Wang',  // 键名含连字符需引号
  greet() {                    // 方法简写
    return `Hi, I'm ${this.name}`
  },
}

// 访问
user.name          // 'Alice'
user['full-name']  // 'Alice Wang'

// 修改
user.age = 31
user.email = 'alice@example.com'
delete user.age

// 检查
'name' in user     // true
user.hasOwnProperty('name')  // true

// 遍历
Object.keys(user)      // ['name', 'age', ...]
Object.values(user)    // ['Alice', 30, ...]
Object.entries(user)   // [['name','Alice'], ['age',30], ...]

// 解构
const { name, age, email = 'default@email.com' } = user
const { name: userName } = user  // 重命名
```

## 函数

```js
// 函数声明（提升）
function add(a, b) { return a + b }

// 函数表达式
const add = function(a, b) { return a + b }

// 箭头函数（不绑定 this）
const add = (a, b) => a + b
const square = x => x * x
const noParam = () => 42

// 默认参数
function greet(name = 'Guest') { return `Hello ${name}` }

// 剩余参数
function sum(...nums) { return nums.reduce((a, b) => a + b) }

// 立即执行函数
;(function() { console.log('IIFE') })()
;(() => console.log('arrow IIFE'))()
```

## 闭包与作用域

```js
// 闭包：函数可以访问其外部作用域的变量
function createCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = createCounter()
counter()  // 1
counter()  // 2

// 实用的闭包：防抖
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
function throttle(fn, interval) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}
```

## this 绑定

```js
// 默认绑定（全局对象，严格模式为 undefined）
function show() { console.log(this) }

// 隐式绑定
const obj = { name: 'obj', show }
obj.show()  // obj

// 显式绑定
show.call(obj, arg1, arg2)
show.apply(obj, [arg1, arg2])
const bound = show.bind(obj)

// new 绑定
function Person(name) { this.name = name }

// 箭头函数：无 this，继承外层
const arrow = () => console.log(this)
```

## Promise 与异步

```js
// 创建 Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    success ? resolve('数据') : reject(new Error('失败'))
  }, 1000)
})

// 消费 Promise
fetchData
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('完成'))

// async/await（更优雅）
async function loadData() {
  try {
    const data = await fetchData
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

// 并发
const [users, posts] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
])

const result = await Promise.race([fetch('/api'), timeout(5000)])
const allSettled = await Promise.allSettled([...])  // 不 reject
```

## DOM 操作

```js
// 获取元素
document.getElementById('app')
document.querySelector('.container')    // 第一个匹配
document.querySelectorAll('.item')      // NodeList（可用 forEach）
document.getElementsByClassName('card') // HTMLCollection

// 创建与插入
const div = document.createElement('div')
div.textContent = 'Hello'
div.className = 'highlight'
div.id = 'myDiv'
div.setAttribute('data-id', '42')

parent.appendChild(div)
parent.prepend(div)        // 开头插入
parent.insertBefore(div, refNode)
parent.replaceChild(div, oldChild)
div.remove()

// 更现代的插入方式
div.insertAdjacentHTML('beforebegin', '<p>之前</p>')
div.insertAdjacentHTML('afterend', '<p>之后</p>')

// 类操作
el.classList.add('active')
el.classList.remove('hidden')
el.classList.toggle('visible')
el.classList.contains('active')

// 样式操作
el.style.color = 'red'
el.style.backgroundColor = '#f0f0f0'  // 驼峰命名
el.style.cssText = 'color: red; font-size: 16px;'
```

## 事件

```js
// 添加事件
element.addEventListener('click', handler, options)
element.addEventListener('click', handler, { once: true })  // 只执行一次
element.removeEventListener('click', handler)

// 事件对象
element.addEventListener('click', (e) => {
  e.preventDefault()      // 阻止默认行为
  e.stopPropagation()     // 阻止冒泡
  e.stopImmediatePropagation() // 阻止所有后续事件
  console.log(e.target)        // 触发元素
  console.log(e.currentTarget) // 绑定元素
})

// 事件委托
parent.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('点击了 item')
  }
})

// 常用事件
click, dblclick, mouseover, mouseout, mousedown, mouseup
keydown, keyup, keypress
submit, change, input, focus, blur
scroll, resize, load, DOMContentLoaded
touchstart, touchmove, touchend
```

## ES6+ 重要特性

### 模块

```js
// 导出 (math.js)
export const PI = 3.14
export function add(a, b) { return a + b }
export default class Calculator {}

// 导入 (app.js)
import Calculator, { PI, add as sum } from './math.js'
import * as Math from './math.js'
```

### 类

```js
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() { console.log(`${this.name} makes a sound`) }
  static create(name) { return new Animal(name) }
}

class Dog extends Animal {
  constructor(name) {
    super(name)
  }
  speak() { console.log('Woof!') }
}
```

### Map 与 Set

```js
const map = new Map()
map.set('key', 'value')
map.get('key')
map.has('key')
map.delete('key')

const set = new Set([1, 2, 2, 3])  // {1, 2, 3}
set.add(4)
set.has(2)
set.delete(1)
```

### 正则表达式

```js
const regex = /^[a-z]+@[a-z]+\.[a-z]{2,}$/i
regex.test('user@example.com')  // true
'hello123'.match(/\d+/)         // ['123']
'line1\nline2'.match(/^line/m)  // 多行模式
```

## 错误处理

```js
try {
  // 可能抛出错误的代码
  throw new Error('自定义错误')
} catch (err) {
  console.error(err.message)
  console.error(err.stack)
} finally {
  // 无论是否异常都执行
}

// 自定义错误类
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}
```

## 性能优化建议

1. **批量 DOM 操作**：使用 `documentFragment` 或拼接后一次性插入
2. **事件委托**：减少事件监听器数量
3. **防抖与节流**：控制高频触发的事件
4. **懒加载**：图片和组件按需加载
5. **缓存 DOM 查询**：重复使用的元素存为变量
6. **避免内存泄漏**：及时移除事件监听和定时器
7. **使用 `===` 而非 `==`**：避免隐式类型转换
8. **合理使用数据结构**：大量唯一值用 Set，键值对用 Map

---

# 企业级实践

## 项目架构

### Monorepo 策略

大型项目使用 monorepo 管理多个包：

```json
// package.json（根）
{
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "eslint packages/*/src"
  }
}
```

**流行工具**：

| 工具 | 特点 |
|------|------|
| **Nx** | 智能增量构建、任务编排、缓存 |
| **Turborepo** | 并行构建、远程缓存 |
| **pnpm workspace** | 节省磁盘空间、严格依赖隔离 |

```sh
# Nx 示例
npx nx create-nx-workspace my-workspace
npx nx run-many --target=build --parallel
npx nx affected:test            # 只测试受影响的部分
npx nx graph                    # 依赖关系可视化
```

### 微前端架构

```js
// Module Federation（Webpack 5）
// host/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js',
      },
    }),
  ],
}

// remote/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      exposes: {
        './Header': './src/Header',
        './Footer': './src/Footer',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
}
```

### 架构模式

```js
// 分层架构
// src/
//   ├── api/          —— API 调用层
//   ├── components/   —— 展示组件
//   ├── hooks/        —— 自定义 Hooks
//   ├── stores/       —— 状态管理
//   ├── utils/        —— 工具函数
//   └── types/        —— TypeScript 类型

// Feature-based 组织
// src/
//   ├── features/
//   │   ├── auth/         —— 认证功能
//   │   │   ├── api.ts
//   │   │   ├── components/
//   │   │   ├── hooks.ts
//   │   │   └── types.ts
//   │   └── dashboard/
//   └── shared/           —— 公共组件
```

## 状态管理

```js
// 企业级状态管理选型
// 1. Zustand —— 轻量、无模板代码
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      setUser: (user) => set({ user }),
      hasPermission: (perm) => get().permissions.includes(perm),
      fetchUser: async (id) => {
        const user = await api.getUser(id)
        set({ user, permissions: user.permissions })
      },
    }),
    { name: 'auth-storage' }
  )
)

// 2. XState —— 复杂状态机
import { createMachine, interpret } from 'xstate'

const paymentMachine = createMachine({
  id: 'payment',
  initial: 'idle',
  states: {
    idle: { on: { SUBMIT: 'loading' } },
    loading: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error',
      },
    },
    success: { type: 'final' },
    error: {
      on: { RETRY: 'loading' },
    },
  },
})

const service = interpret(paymentMachine).onTransition(state =>
  console.log(state.value)
)
service.start()
service.send('SUBMIT')
```

## 性能优化

### 代码分割

```js
// 路由级分割
const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))

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

// 组件级分割
const HeavyChart = lazy(() => import(/* webpackChunkName: "chart" */ './Chart'))

// 条件加载
const MarkdownEditor = lazy(() =>
  isAdmin
    ? import('./ProEditor')
    : import('./BasicEditor')
)
```

### Bundle 分析

```sh
# 分析包大小
npm install -g source-map-explorer
source-map-explorer dist/*.js

# Webpack Bundle Analyzer
npm install -D webpack-bundle-analyzer

# Rollup / Vite
npm install -D rollup-plugin-visualizer
```

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'
export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

### Tree Shaking 最佳实践

```js
// ✅ 正确：命名导出
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// ❌ 错误：默认导出整个对象
export default { add, subtract }

// ✅ 导入时只取所需
import { add } from './math'  // subtract 被 tree-shake 掉

// ✅ lodash 按需导入
import debounce from 'lodash/debounce'
// 而非 import { debounce } from 'lodash'
```

### 虚拟列表（大数据渲染）

```jsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 测试策略

### 测试金字塔

```
      ╱╲
     ╱ E2E ╲         ← Cypress, Playwright (少量)
    ╱────────╲
   ╱ Integration ╲   ← React Testing Library (适量)
  ╱────────────────╲
 ╱   Unit Tests    ╲  ← Vitest, Jest (大量)
╱────────────────────╲
```

```js
// 1. 单元测试（Vitest）
import { describe, it, expect } from 'vitest'
import { formatCurrency, validateEmail } from './utils'

describe('formatCurrency', () => {
  it('formats number to CNY', () => {
    expect(formatCurrency(1234.5)).toBe('¥1,234.50')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })
})

// 2. 组件测试（Testing Library）
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  it('shows error on invalid email', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText('邮箱'), 'invalid')
    await userEvent.click(screen.getByText('登录'))
    expect(screen.getByText('请输入有效邮箱')).toBeInTheDocument()
  })
})

// 3. E2E 测试（Playwright）
import { test, expect } from '@playwright/test'

test('user can complete purchase', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="checkout"]')
  await expect(page.locator('[data-testid="order-confirmed"]')).toBeVisible()
})
```

### Mock 策略

```js
// API Mock (MSW - Mock Service Worker)
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
    ])
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 错误监控

```js
// Sentry 集成
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://xxx@sentry.io/xxx',
  environment: import.meta.env.MODE,
  release: __APP_VERSION__,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,       // 生产采样 10%
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // 过滤敏感信息
    if (event.request?.data) {
      delete event.request.data.password
    }
    return event
  },
})

// 手动上报
Sentry.setUser({ id: userId, email: 'user@example.com' })
Sentry.setTag('feature', 'checkout')
Sentry.captureException(error)
Sentry.addBreadcrumb({ category: 'auth', message: 'User logged in' })
```

### 错误边界

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

## 构建与部署

```js
// vite.config.js —— 生产级配置
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,            // 生产禁用（或 hidden）
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd', '@ant-design/icons'],
          utils: ['lodash-es', 'dayjs'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 200,
  },
  server: {
    proxy: {
      '/api': 'https://backend.example.com',
    },
  },
})
```

## 安全实践

```js
// XSS 防护
// 1. 不信任用户输入
const userInput = '<script>alert("xss")</script>'
element.textContent = userInput      // ✅ 安全
element.innerHTML = userInput        // ❌ 危险

// 2. CSP Nonce
// <script nonce="随机值">...</script>
// Content-Security-Policy: script-src 'nonce-随机值'

// 3. 输入清洗
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(dirtyHTML)

// 4. OWASP 推荐编码
import { encode } from 'he'  // HTML entities
```

---

## 生态全景

### 运行环境

```js
// Node.js —— 服务端
const server = require('http').createServer()

// Deno —— 安全优先的运行时
// import { serve } from "https://deno.land/std/http/server.ts"

// Bun —— 高性能一站式
// Bun.serve({ fetch(req) { return new Response("Hello") } })
```

| 运行时 | 特点 | 适用 |
|--------|------|------|
| **Node.js** | 最大社区、最稳定 | 生产环境主流 |
| **Deno** | 安全默认、TypeScript 原生 | 新项目 |
| **Bun** | 极速启动、内置打包器 | 开发工具、边缘计算 |

### 构建工具

```
                          ┌──────────────────┐
                          │    Vite (推荐)    │
                          │  开发: esbuild    │
                          │  生产: Rollup     │
                          └────────┬─────────┘
                                   │
┌──────────────┐     ┌──────────────┴──────────┐    ┌──────────────┐
│   Webpack    │     │      Turbopack (Next)    │    │    esbuild   │
│   生态最大    │     │      增量编译极快        │    │   编译速度   │
│  配置复杂    │     │                          │    │     最快     │
└──────────────┘     └─────────────────────────┘    └──────────────┘
```

### 包管理器演进

```sh
npm —— 默认包管理器，npm 7+ 性能提升巨大
pnpm —— 磁盘空间节省，严格依赖隔离，Monorepo 首选
yarn  —— Berry 版本引入 PnP，Plug'n'Play 模式

# pnpm 优势
pnpm install          # 快（硬链接复用）
pnpm add lodash       # 节省磁盘（全局存储）
pnpm -r run build     # Monorepo 并行构建
```

### 测试栈

```js
// Vitest —— Vite 生态测试框架（推荐）
import { describe, it, expect } from 'vitest'

// Playwright —— 跨浏览器 E2E
test('login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@test.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('.dashboard')).toBeVisible()
})

// MSW —— API Mock（前后端解耦）
import { http, HttpResponse } from 'msw'
const handlers = [
  http.get('/api/user', () => HttpResponse.json({ id: 1 })),
]
```

### 框架生态

```
泛型框架        Meta 框架        状态管理        数据获取
React     →   Next.js         Zustand        TanStack Query
Vue       →   Nuxt            Pinia          vue-query
Svelte    →   SvelteKit       Svelte store   svelte-query
Solid     →   SolidStart      Signals         solid-query
Angular   →   Analog           Signals         RxJS

UI 组件库：shadcn/ui, Radix, Ark UI, MUI
动画：Framer Motion, GSAP, Motion One
表单：React Hook Form, TanStack Form
类型：TypeScript, Zod, Valibot, ArkType
```

### 全栈技术选型

```
┌──────────────────────────────────────┐
│               Tech Stack              │
├──────────────────────────────────────┤
│  前端: React / Vue + TypeScript       │
│  构建: Vite + pnpm + Turborepo       │
│  后端: Next.js / Hono + Prisma       │
│  数据库: PostgreSQL + Redis           │
│  测试: Vitest + Playwright + MSW     │
│  CI/CD: GitHub Actions               │
│  部署: Docker + Vercel / Railway     │
│  监控: Sentry + OpenTelemetry        │
│  API: tRPC / REST / GraphQL          │
└──────────────────────────────────────┘
```
```

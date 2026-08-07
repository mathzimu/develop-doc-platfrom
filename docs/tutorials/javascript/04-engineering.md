# JavaScript 工程实践

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

## CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
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

## 官方文档

| 主题 | 链接 |
|------|------|
| 项目规范 | [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) |
| Lint/Format | [ESLint](https://eslint.org/docs/latest/) · [Prettier](https://prettier.io/docs/) · [Biome](https://biomejs.dev/zh-cn/) |
| 测试 | [Vitest](https://vitest.dev/) · [Jest](https://jestjs.io/zh-Hans/) · [Playwright](https://playwright.dev/docs/intro) |
| 安全编码 | [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/) · [XSS 防护](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| 依赖安全 | [Dependabot](https://docs.github.com/zh/code-security/dependabot) · [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) |

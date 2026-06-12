# JavaScript 生态全景

## 运行环境

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

## 构建工具

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

## 包管理器演进

```sh
npm —— 默认包管理器，npm 7+ 性能提升巨大
pnpm —— 磁盘空间节省，严格依赖隔离，Monorepo 首选
yarn  —— Berry 版本引入 PnP，Plug'n'Play 模式

# pnpm 优势
pnpm install          # 快（硬链接复用）
pnpm add lodash       # 节省磁盘（全局存储）
pnpm -r run build     # Monorepo 并行构建
```

## 测试栈

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

## 框架生态

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

## 全栈技术选型

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

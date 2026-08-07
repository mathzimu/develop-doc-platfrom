# React 生态全景

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

## 元框架选型

| 框架 | 路由 | 数据 | 部署 | 适用场景 |
|------|------|------|------|---------|
| **Next.js** | 文件路由 | RSC/SSR/SSG | Vercel | 全场景 |
| **Remix** | 文件路由 | Loader/Action | Fly.io | 数据密集 |
| **Gatsby** | 文件路由 | GraphQL | Netlify | 内容站点 |

## 组件库决策

```
shadcn/ui (推荐) —— 基于 Radix + Tailwind，可复制、可定制
Radix UI         —— 无样式、无障碍原语
Ark UI           —— 无样式、Chakra UI 团队新作
MUI             —— Material Design 完整实现
Ant Design      —— 企业级、中后台首选
Chakra UI       —— 主题系统强大
Headless UI     —— Tailwind 团队无样式组件
```

## 全栈脚手架

```sh
# Next.js 全栈
npx create-next-app@latest my-app --typescript --tailwind --app

# 依赖
npm install @tanstack/react-query zustand react-hook-form zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install -D @playwright/test vitest @testing-library/react
```

## Monorepo 结构的 React 项目

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

推荐使用 Turborepo 或 Nx 管理 Monorepo：

```sh
npx create-turbo@latest my-monorepo
```

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 核心与 API | [react.dev](https://react.dev/learn) · [React API 参考](https://react.dev/reference/react) · [中文站](https://zh-hans.react.dev/learn) |
| 元框架 | [Next.js](https://nextjs.org/docs) · [Remix](https://remix.run/docs) · [Gatsby](https://www.gatsbyjs.com/docs/) |
| 状态管理 | [Zustand](https://zustand.docs.pmnd.rs/) · [Jotai](https://jotai.org/docs/) · [Redux Toolkit](https://redux-toolkit.js.org/) · [XState](https://stately.ai/docs) |
| 数据获取 | [TanStack Query](https://tanstack.com/query/latest/docs) · [SWR](https://swr.vercel.app/) |
| 表单 | [React Hook Form](https://react-hook-form.com/) · [Formik](https://formik.org/) · [TanStack Form](https://tanstack.com/form) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/docs) · [styled-components](https://styled-components.com/) |
| 测试 | [Testing Library](https://testing-library.com/docs/) · [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) |
| 组件库 | [shadcn/ui](https://ui.shadcn.com/) · [Radix UI](https://www.radix-ui.com/) · [MUI](https://mui.com/) · [Ant Design](https://ant.design/index-cn) |
| Monorepo | [Turborepo](https://turborepo.com/docs) · [Nx](https://nx.dev/getting-started/intro) |

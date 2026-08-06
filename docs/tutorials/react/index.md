# React 教程

本教程从基础到实战，系统学习 React 核心概念与工程实践。

## 目录

- **[基础语法](./01-basics)** — 组件、Props、条件渲染、列表、Hooks（useState / useEffect / useRef / useMemo / useCallback / useContext / useReducer）、自定义 Hook、事件处理、样式方案、性能优化
- **[进阶深入](./02-advanced)** — 渲染机制（Fiber）、Hooks 原理（闭包陷阱）、Context 性能优化、Error Boundary、Portals、Refs 进阶（forwardRef / useImperativeHandle）、Suspense、React 18 新特性、HOC vs Render Props vs Hooks、状态管理选型对比
- **[实战项目：GitHub 用户搜索](./03-project)** — React + Vite + TypeScript + TanStack Query + Tailwind CSS 完整实战
- **[工程实践](./04-engineering)** — 项目结构、API 层封装、状态管理、表单处理、权限管理、国际化、监控、测试、CI/CD、Sentry
- **[生态全景](./05-ecosystem)** — 元框架、组件库、数据获取、样式方案、全栈脚手架、Monorepo

::: tip
建议按顺序学习，基础部分掌握后可直接进入实战项目巩固。
:::

## 环境要求

- Node.js 18+
- React 18+（新项目建议 React 19）
- 构建工具：Vite 或 Next.js

## 前置知识

- 熟悉 [JavaScript](/tutorials/javascript/)（ES6+、数组方法、模块、异步）
- 了解 [TypeScript](/tutorials/typescript/) 基础类型（实战项目使用 TS）
- 了解 [HTML](/tutorials/html/) 与 [CSS](/tutorials/css/)

## 快速开始

```sh
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

## 官方文档

Hook 规则、渲染语义、并发特性等细节以官方文档为准。

| 类型 | 链接 |
|------|------|
| 官方文档 | [react.dev](https://react.dev/learn) · [中文文档](https://zh-hans.react.dev/learn) |
| API 参考 | [React Reference](https://react.dev/reference/react) · [Hooks 索引](https://react.dev/reference/react/hooks) |
| DOM 与事件 | [react-dom 参考](https://react.dev/reference/react-dom) |
| 服务端组件 | [Server Components](https://react.dev/reference/rsc/server-components) |
| 编译器 | [React Compiler](https://react.dev/learn/react-compiler) |
| 元框架 | [Next.js](https://nextjs.org/docs) · [React Router](https://reactrouter.com/) · [Remix](https://remix.run/docs) |
| 数据获取 | [TanStack Query](https://tanstack.com/query/latest/docs) · [SWR](https://swr.vercel.app/zh-CN) |
| 状态管理 | [Zustand](https://zustand.docs.pmnd.rs/) · [Redux Toolkit](https://redux-toolkit.js.org/) · [Jotai](https://jotai.org/docs/introduction) |
| 表单 | [React Hook Form](https://react-hook-form.com/get-started) |
| 测试 | [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) · [Playwright](https://playwright.dev/docs/intro) |
| 源码与 RFC | [facebook/react](https://github.com/facebook/react) · [reactjs/rfcs](https://github.com/reactjs/rfcs) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

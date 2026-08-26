# TypeScript 教程

TypeScript 是 JavaScript 的超集，添加了静态类型系统。TypeScript 代码需要编译为 JavaScript 后运行。

```sh
npm install -g typescript
tsc --version
tsc file.ts          # 编译为 file.js
tsc --init           # 生成 tsconfig.json
```

## 目录

- [基础语法](/tutorials/typescript/01-basics) — 类型、接口、泛型、枚举、模块等
- [进阶深入](/tutorials/typescript/02-advanced) — 条件类型、映射类型、模板字面量、逆变协变、装饰器、类型体操
- [实战项目：类型安全的 API 客户端](/tutorials/typescript/03-project) — 从零构建完整 API 客户端
- [工程实践](/tutorials/typescript/04-engineering) — 严格模式、声明文件、Monorepo、CI/CD、ESLint
- [生态全景](/tutorials/typescript/05-ecosystem) — 编译工具、运行时验证、tRPC、Zod

按顺序阅读效果最佳，也可直接跳转感兴趣的章节。

## 环境要求

- Node.js 18+
- TypeScript 5.x
- 编辑器内置 TS 支持（VS Code 推荐）

## 前置知识

- 熟悉 [JavaScript](/tutorials/javascript/)（ES6+ 语法、模块、异步）
- 了解 npm 与命令行基本操作

## 官方文档与延伸阅读

- **官方文档**：[TypeScript 官网](https://www.typescriptlang.org/docs/) · [TypeScript 中文站](https://www.typescriptlang.org/zh/docs/) · [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- **tsconfig 参考**：[tsconfig 选项全集](https://www.typescriptlang.org/tsconfig)
- **类型系统**：[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) · [Declaration Files 指南](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- **类型定义**：[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- **版本变更**：[Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- **在线试验**：[TS Playground](https://www.typescriptlang.org/play)
- **Lint 规则**：[typescript-eslint](https://typescript-eslint.io/getting-started/)
- **运行时校验**：[Zod](https://zod.dev/) · [Valibot](https://valibot.dev/guides/introduction/)
- **端到端类型**：[tRPC](https://trpc.io/docs)
- **直接执行 TS**：[tsx](https://tsx.is/) · [Node.js 类型剥离](https://nodejs.org/api/typescript.html)

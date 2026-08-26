# Node.js 教程

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，用于构建服务端应用。Node.js 使用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

## 目录

- [01 - Node.js 基础语法](/tutorials/nodejs/01-basics) — 入门、模块系统、核心模块（fs、path、http、events、stream）、包管理、Express 示例、环境变量、进程管理、调试与安全
- [02 - Node.js 进阶深入](/tutorials/nodejs/02-advanced) — Event Loop 详解、Streams 进阶、Child Process、Worker Threads、C++ Addon、Buffer、安全进阶、性能监控
- [03 - 实战项目：RESTful 博客 API](/tutorials/nodejs/03-project) — Express/Fastify + Prisma + Zod + JWT + PostgreSQL，完整 CRUD
- [04 - Node.js 工程实践](/tutorials/nodejs/04-engineering) — 企业级项目结构、生产配置、错误处理、结构化日志、数据验证、测试、CI/CD、Docker
- [05 - Node.js 生态全景](/tutorials/nodejs/05-ecosystem) — 框架、ORM、运行时生态、包管理选型对比

## 快速开始

```sh
node -v           # 检查版本
npm -v            # npm 版本
nvm install 20    # 使用 nvm 安装特定版本
```

```js
// hello.js
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello Node.js!' }))
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})
```

选择一个章节开始学习吧！

## 环境要求

- Node.js 18+（建议使用当前 LTS）
- npm / pnpm / yarn 任一包管理器
- 实战项目额外需要 PostgreSQL 与 Docker

## 前置知识

- 熟悉 [JavaScript](/tutorials/javascript/)（ES6+、Promise、async/await）
- 了解 HTTP 基本概念（方法、状态码、请求头）

## 官方文档与延伸阅读

- **API 文档**：[nodejs.org/api](https://nodejs.org/docs/latest/api/) · [中文站](https://nodejs.org/zh-cn)
- **版本与支持周期**：[Release Schedule](https://github.com/nodejs/release#release-schedule)
- **版本管理**：[nvm](https://github.com/nvm-sh/nvm) · [fnm](https://github.com/Schniz/fnm)
- **入门指南**：[Node.js Learn](https://nodejs.org/en/learn)
- **模块系统**：[ESM](https://nodejs.org/api/esm.html) · [CommonJS](https://nodejs.org/api/modules.html)
- **并发与流 / 线程**：[Worker Threads](https://nodejs.org/api/worker_threads.html) · [Stream](https://nodejs.org/api/stream.html)
- **测试与调试**：[node:test](https://nodejs.org/api/test.html) · [调试指南](https://nodejs.org/en/learn/getting-started/debugging)
- **框架**：[Express](https://expressjs.com/zh-cn/) · [Fastify](https://fastify.dev/docs/latest/) · [NestJS](https://docs.nestjs.com/) · [Hono](https://hono.dev/docs/)
- **ORM 与数据库**：[Prisma](https://www.prisma.io/docs) · [Drizzle](https://orm.drizzle.team/docs/overview) · [node-postgres](https://node-postgres.com/) · [TypeORM](https://typeorm.io/)
- **校验与鉴权**：[Zod](https://zod.dev/) · [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) · [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html)
- **日志与监控**：[Pino](https://getpino.io/) · [OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/)
- **其他运行时**：[Deno](https://docs.deno.com/) · [Bun](https://bun.sh/docs)
- **安全**：[Node.js 安全最佳实践](https://nodejs.org/en/learn/getting-started/security-best-practices) · [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

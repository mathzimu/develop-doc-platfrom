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

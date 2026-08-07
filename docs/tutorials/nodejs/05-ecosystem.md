# Node.js 生态全景

```
┌──────────────────────────────────────────┐
│           Node.js 生态系统                 │
├──────────────────┬───────────────────────┤
│   Web 框架        │   ORM                 │
│   Express        │   Prisma              │
│   Fastify        │   Drizzle ORM         │
│   NestJS         │   TypeORM             │
│   Hono           │   Sequelize           │
│   Koa            │                       │
├──────────────────┼───────────────────────┤
│   认证            │  实时通信              │
│   Passport.js    │   Socket.io           │
│   Lucia          │   WebSockets          │
│   next-auth      │   SSE                 │
│   JWT            │   WebRTC              │
├──────────────────┼───────────────────────┤
│   测试            │  工具                 │
│   Vitest         │   Zod                 │
│   Playwright     │   date-fns            │
│   Supertest      │   Lodash              │
│   Testcontainers │   Pino                │
├──────────────────┼───────────────────────┤
│   队列            │  监控                 │
│   BullMQ         │   Sentry              │
│   Bee-Queue      │   OpenTelemetry       │
│   Agenda         │   PM2                 │
└──────────────────┴───────────────────────┘
```

## 框架选型

| 框架 | 特点 | 适用 |
|------|------|------|
| **Express** | 最大社区、灵活 | 中小型 API |
| **Fastify** | 高性能、Schema 验证 | API 网关、微服务 |
| **NestJS** | 模块化、装饰器、DI | 企业级后端 |
| **Hono** | 超轻量、多运行时 | Edge、Serverless |
| **AdonisJS** | 全栈、Laravel 风格 | 全栈应用 |

## ORM 选型

```ts
// Prisma —— 类型安全、自动迁移（推荐）
// schema.prisma 定义模型 → prisma generate 生成客户端

// Drizzle ORM —— SQL 风格、零抽象
await db.select().from(users).where(eq(users.email, email))

// TypeORM —— 装饰器风格
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number
}
```

## 运行时生态

```js
// Edge Runtime —— 边缘计算
// Vercel Edge Functions, Cloudflare Workers

// Serverless
// AWS Lambda, Vercel Functions, Netlify Functions

// 进程管理
PM2          —— 进程守护、集群模式（推荐）
Forever      —— 简单进程守护
nodemon      —— 开发热重启

// 容器化
Docker + Node.js  —— 标准部署方式
```

## 包管理

```sh
# 开发工作流
npm init @fastify/my-app    # Fastify 脚手架
npx create-nest-app my-app   # NestJS 脚手架
npx prisma init              # Prisma 初始化
```

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 运行时 | [Node.js API](https://nodejs.org/docs/latest/api/) · [Release Schedule](https://github.com/nodejs/release#release-schedule) |
| Web 框架 | [Express](https://expressjs.com/zh-cn/) · [Fastify](https://fastify.dev/docs/latest/) · [NestJS](https://docs.nestjs.com/) · [Hono](https://hono.dev/docs/) · [AdonisJS](https://adonisjs.com/docs) · [Koa](https://koajs.com/) |
| ORM | [Prisma](https://www.prisma.io/docs) · [Drizzle](https://orm.drizzle.team/docs/overview) · [TypeORM](https://typeorm.io/) · [Sequelize](https://sequelize.org/) |
| 认证 | [Passport.js](https://www.passportjs.org/docs/) · [next-auth](https://next-auth.js.org/) · [lucia](https://lucia-auth.com/) |
| 实时通信 | [Socket.io](https://socket.io/docs/) · [WebRTC](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API) |
| 测试 | [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) · [Supertest](https://github.com/ladjs/supertest) · [Testcontainers](https://testcontainers.com/) |
| 队列 | [BullMQ](https://docs.bullmq.io/) · [Agenda](https://github.com/agenda/agenda) |
| 监控/日志 | [Pino](https://getpino.io/) · [Sentry](https://docs.sentry.io/) · [OpenTelemetry](https://opentelemetry.io/docs/) · [PM2](https://pm2.keymetrics.io/) |

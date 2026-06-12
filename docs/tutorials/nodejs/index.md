# Node.js 教程

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，用于构建服务端应用。Node.js 使用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

## 入门

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

## 模块系统

### CommonJS（默认）

```js
// math.js
const PI = 3.14159
function add(a, b) { return a + b }
module.exports = { PI, add }

// app.js
const { PI, add } = require('./math.js')
```

### ESM

在 `package.json` 中设置 `"type": "module"`，或将文件命名为 `.mjs`。

```js
// math.js
export const PI = 3.14159
export function add(a, b) { return a + b }
export default class Calculator {}

// app.js
import Calculator, { PI, add as sum } from './math.js'
```

## 内置核心模块

### fs - 文件系统

```js
import fs from 'fs/promises'
import fsSync from 'fs'

// 异步（推荐）
const data = await fs.readFile('file.txt', 'utf-8')
await fs.writeFile('output.txt', '内容')
await fs.appendFile('log.txt', '新行\n')
await fs.mkdir('newdir', { recursive: true })
await fs.rm('file.txt')

// 流式读取大文件
const reader = fsSync.createReadStream('large.txt', { encoding: 'utf-8' })
reader.on('data', chunk => console.log(chunk))
reader.on('end', () => console.log('完成'))

// 遍历目录
const files = await fs.readdir('./')
for (const file of files) {
  const stat = await fs.stat(file)
  console.log(file, stat.isDirectory() ? '[DIR]' : stat.size + 'B')
}
```

### path - 路径处理

```js
import path from 'path'

path.join('a', 'b', 'c.txt')         // 'a/b/c.txt'
path.resolve('src', '..', 'dist')    // 解析为绝对路径
path.basename('/a/b/file.txt')       // 'file.txt'
path.dirname('/a/b/file.txt')        // '/a/b'
path.extname('file.txt')             // '.txt'
path.parse('/a/b/file.txt')
// { root: '/', dir: '/a/b', base: 'file.txt', ext: '.txt', name: 'file' }
```

### http / https

```js
import http from 'http'
import https from 'https'

// 创建 API 服务
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.url === '/api/users' && req.method === 'GET') {
    const users = await db.query('SELECT * FROM users')
    res.end(JSON.stringify(users))
  } else {
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
})

server.listen(3000)

// 发起 HTTP 请求
const response = await fetch('https://api.example.com/data')
const data = await response.json()
```

### events - 事件触发器

```js
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

// 监听
emitter.on('data', (payload) => console.log(payload))
emitter.once('init', () => console.log('仅执行一次'))

// 触发
emitter.emit('data', { id: 1 })
emitter.emit('init')
```

### stream - 流

```js
import { Readable, Transform, pipeline } from 'stream'

// 转换流
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

// 管道
pipeline(
  fsSync.createReadStream('input.txt'),
  upperCase,
  fsSync.createWriteStream('output.txt'),
  (err) => console.log(err ?? '完成')
)
```

## 包管理

```json
// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "应用描述",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "~4.17.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

```sh
npm init -y                  # 初始化
npm install express          # 安装依赖
npm install -D typescript    # 开发依赖
npm uninstall lodash         # 卸载
npm update                   # 更新
npm ci                       # 根据 lock 文件精确安装（CI 环境）
npx create-vite@latest       # 执行命令而不全局安装
```

## 常用第三方包

| 包名 | 用途 |
|------|------|
| `express` | Web 框架 |
| `koa` | 轻量 Web 框架 |
| `fastify` | 高性能 Web 框架 |
| `prisma` | ORM（数据库操作） |
| `zod` | 数据验证 |
| `jsonwebtoken` | JWT 认证 |
| `bcrypt` | 密码哈希 |
| `socket.io` | WebSocket 通信 |
| `nodemailer` | 邮件发送 |
| `pino` / `winston` | 日志 |
| `lodash` | 工具函数 |
| `dayjs` | 日期处理 |
| `axios` | HTTP 客户端 |
| `sharp` | 图片处理 |

## Express 示例

```js
import express from 'express'

const app = express()
app.use(express.json())

// 中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// 路由
app.get('/api/users', async (req, res) => {
  const users = await getUsers()
  res.json(users)
})

app.post('/api/users', async (req, res) => {
  const user = await createUser(req.body)
  res.status(201).json(user)
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: '服务器错误' })
})

app.listen(3000)
```

## 环境变量

```sh
# .env 文件
PORT=3000
DATABASE_URL=postgresql://localhost/mydb
JWT_SECRET=your-secret-key
```

```js
// 使用 dotenv
import 'dotenv/config'

const port = process.env.PORT || 3000
const dbUrl = process.env.DATABASE_URL

// 数据验证
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
})

const env = envSchema.parse(process.env)
```

## 进程管理

```sh
# 生产环境进程管理
npm install -g pm2

pm2 start app.js -i max          # 集群模式（多核）
pm2 start app.js --name my-app
pm2 list
pm2 logs
pm2 monit
pm2 restart app
pm2 stop app
pm2 delete app
pm2 save                        # 保存进程列表
pm2 startup                     # 开机自启
```

## 调试与性能

```sh
# 内置检查器
node --inspect index.js
node --inspect-brk index.js      # 暂停在第一行

# 监视模式（Node 18+）
node --watch index.js

# 性能分析
node --prof index.js
node --prof-process isolate-*.log > profile.txt
```

## 安全实践

1. **使用 helmet**：设置安全 HTTP 头
2. **验证输入**：使用 zod 或 joi 验证请求数据
3. **避免注入**：使用参数化查询，避免字符串拼接 SQL
4. **速率限制**：使用 `express-rate-limit` 防止攻击
5. **依赖审计**：定期运行 `npm audit`
6. **环境变量**：敏感信息使用环境变量，不硬编码
7. **HTTPS**：生产环境强制使用 HTTPS
8. **日志安全**：不记录密码、token 等敏感信息

---

# 企业级实践

## 项目结构

```
src/
├── main.ts              # 入口
├── config/              # 配置
├── middleware/          # 中间件
├── routes/              # 路由
├── controllers/        # 控制器
├── services/           # 服务层
├── repositories/       # 数据访问
├── models/             # 数据模型
├── validators/         # 数据验证
├── utils/              # 工具
├── types/              # 类型
└── __tests__/
```

## Express 生产级配置

```ts
import express, { type Request, type Response, type NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { createLogger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// 安全
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}))

// 限流
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}))

// 压缩
app.use(compression())

// 解析
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 请求追踪
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID()
  next()
})

// 路由
app.use('/api/v1', routes)

// 错误处理
app.use(errorHandler)

const server = app.listen(process.env.PORT ?? 3000, () => {
  logger.info(`Server started on port ${process.env.PORT ?? 3000}`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...')
  server.close(() => {
    db.disconnect()
    process.exit(0)
  })
})
```

## 错误处理中间件

```ts
// middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../utils/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Zod 验证错误
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: '请求参数验证失败',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // 自定义错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      details: err.details,
    })
  }

  // 未知错误
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
  })

  return res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: '服务器内部错误',
    requestId: req.id,
  })
}
```

## 结构化日志

```ts
// utils/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'res.headers["set-cookie"]'],
    censor: '**[REDACTED]**',
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      duration: res.duration,
    }),
    err: pino.stdSerializers.err,
  },
})

export { logger }
```

## 数据验证（Zod）

```ts
// validators/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['user', 'admin']).default('user'),
})

export const updateUserSchema = createUserSchema.partial()

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  search: z.string().optional(),
})

// 中间件
function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validated = schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}
```

---

## 生态全景

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

### 框架选型

| 框架 | 特点 | 适用 |
|------|------|------|
| **Express** | 最大社区、灵活 | 中小型 API |
| **Fastify** | 高性能、Schema 验证 | API 网关、微服务 |
| **NestJS** | 模块化、装饰器、DI | 企业级后端 |
| **Hono** | 超轻量、多运行时 | Edge、Serverless |
| **AdonisJS** | 全栈、Laravel 风格 | 全栈应用 |

### ORM 选型

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

### 运行时生态

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

### 包管理

```sh
# 开发工作流
npm init @fastify/my-app    # Fastify 脚手架
npx create-nest-app my-app   # NestJS 脚手架
npx prisma init              # Prisma 初始化
```

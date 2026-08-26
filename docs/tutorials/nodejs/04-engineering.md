# Node.js 工程实践

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

## 测试

```ts
// __tests__/app.test.ts
import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../src/main'

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
  })
})

describe('POST /api/users', () => {
  it('returns 400 on invalid body', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR')
  })
})
```

```sh
# vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./__tests__/setup.ts'],
  },
})
```

## CI/CD（GitHub Actions）

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
      - run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          JWT_SECRET: test-secret-key-for-ci-at-least-32-chars
```

## Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## 官方文档与延伸阅读

- **API 文档**：[nodejs.org/api](https://nodejs.org/docs/latest/api/) · [中文站](https://nodejs.org/zh-cn)
- **版本管理**：[nvm](https://github.com/nvm-sh/nvm) · [fnm](https://github.com/Schniz/fnm)
- **错误处理**：[Node.js 错误处理](https://nodejs.org/en/learn/getting-started/errors-in-node) · [Express 错误处理(中文)](https://expressjs.com/zh-cn/guide/error-handling.html)
- **结构化日志**：[Pino](https://getpino.io/) · [pino-pretty](https://github.com/pinojs/pino-pretty)
- **数据验证**：[Zod](https://zod.dev/)
- **测试**：[node:test](https://nodejs.org/api/test.html) · [Vitest](https://vitest.dev/)
- **容器化**：[Docker for Node](https://nodejs.org/en/learn/docker/introduction) · [Node 镜像](https://hub.docker.com/_/node)
- **部署与监控**：[PM2](https://pm2.keymetrics.io/) · [OpenTelemetry](https://opentelemetry.io/docs/languages/js/)
- **其他运行时**：[Deno](https://docs.deno.com/) · [Bun](https://bun.sh/docs)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

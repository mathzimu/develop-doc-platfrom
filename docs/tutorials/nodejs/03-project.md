# 实战项目：RESTful 博客 API

使用 Express + Prisma + Zod + JWT + PostgreSQL 构建完整的 RESTful 博客 API。

## 项目结构

```
blog-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── services/
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── user.ts
│   └── lib/
│       └── prisma.ts
├── __tests__/
├── package.json
└── tsconfig.json
```

## Schema 设计

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 配置与环境变量

```ts
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

export const env = envSchema.parse(process.env)
```

## 数据库客户端

```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
})
```

## 认证（JWT）

```ts
// src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return next(new AppError(401, 'UNAUTHORIZED', '未提供认证 token'))

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload
    next()
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'token 无效或已过期'))
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'FORBIDDEN', '权限不足'))
    }
    next()
  }
}
```

```ts
// src/services/auth.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { env } from '../config/env'

export async function register(email: string, name: string, password: string) {
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, name, password: hashed } })
  return { id: user.id, email: user.email, name: user.name }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError(401, 'INVALID_CREDENTIALS', '邮箱或密码错误')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', '邮箱或密码错误')

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
  return { token, user: { id: user.id, email: user.email, name: user.name } }
}
```

## 数据验证

```ts
// src/middleware/validate.ts
import { z, type ZodSchema } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source])
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().optional().default(false),
})

export const updatePostSchema = createPostSchema.partial()

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
})
```

## CRUD 路由

```ts
// src/routes/posts.ts
import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'
import { validate, createPostSchema, updatePostSchema } from '../middleware/validate'

const router = Router()

// 公开：获取已发布的文章列表
router.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(posts)
  } catch (err) { next(err) }
})

// 公开：获取单篇文章
router.get('/:id', async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { id: true, name: true } } },
    })
    if (!post) return res.status(404).json({ error: 'NOT_FOUND', message: '文章不存在' })
    res.json(post)
  } catch (err) { next(err) }
})

// 需认证：创建文章
router.post('/', authenticate, validate(createPostSchema), async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: { ...req.body, authorId: req.user!.userId },
    })
    res.status(201).json(post)
  } catch (err) { next(err) }
})

// 需认证：更新文章（仅作者或管理员）
router.put('/:id', authenticate, validate(updatePostSchema), async (req, res, next) => {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'NOT_FOUND', message: '文章不存在' })
    if (existing.authorId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'FORBIDDEN', message: '无权修改' })
    }
    const post = await prisma.post.update({ where: { id: req.params.id }, data: req.body })
    res.json(post)
  } catch (err) { next(err) }
})

// 需认证：删除文章
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) { next(err) }
})

export { router as postRoutes }
```

## 错误处理

```ts
// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

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

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: '请求参数验证失败',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'CONFLICT', message: '数据已存在' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'NOT_FOUND', message: '资源不存在' })
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      details: err.details,
    })
  }

  console.error('Unhandled error:', err)
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: '服务器内部错误' })
}
```

## 入口文件

```ts
// src/index.ts
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env'
import { authRoutes } from './routes/auth'
import { postRoutes } from './routes/posts'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Blog API running on http://localhost:${env.PORT}`)
})
```

## 测试

```ts
// __tests__/posts.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/index'

describe('Posts API', () => {
  let token: string
  let postId: string

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', name: 'Test', password: 'password123' })
    expect(res.status).toBe(201)
  })

  it('should login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })
    expect(res.status).toBe(200)
    token = res.body.token
  })

  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Post', content: 'Hello World' })
    expect(res.status).toBe(201)
    postId = res.body.id
  })

  it('should list published posts', async () => {
    const res = await request(app).get('/api/posts')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should delete a post', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
  })
})
```

## 官方文档与延伸阅读

- **API 文档**：[nodejs.org/api](https://nodejs.org/docs/latest/api/) · [中文站](https://nodejs.org/zh-cn)
- **版本管理**：[nvm](https://github.com/nvm-sh/nvm) · [fnm](https://github.com/Schniz/fnm)
- **Web 框架**：[Express](https://expressjs.com/zh-cn/) · [Fastify](https://fastify.dev/docs/latest/) · [NestJS](https://docs.nestjs.com/) · [Hono](https://hono.dev/docs/)
- **ORM**：[Prisma](https://www.prisma.io/docs) · [Drizzle](https://orm.drizzle.team/docs/overview) · [TypeORM](https://typeorm.io/)
- **校验**：[Zod](https://zod.dev/)
- **鉴权**：[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) · [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html)
- **测试**：[Vitest](https://vitest.dev/) · [Supertest](https://github.com/ladjs/supertest)
- **数据库**：[PostgreSQL 官方文档](https://www.postgresql.org/docs/current/)
- **其他运行时**：[Deno](https://docs.deno.com/) · [Bun](https://bun.sh/docs)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

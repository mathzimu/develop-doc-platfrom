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

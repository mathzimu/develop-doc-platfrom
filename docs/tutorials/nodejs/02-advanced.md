# Node.js 进阶深入

## Event Loop 详解

Node.js 的事件循环分为多个 phase（阶段），每个 phase 维护一个 FIFO 回调队列：

```
   ┌───────────────────────────┐
┌─>│           timers          │ ← setTimeout / setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ ← I/O 回调延迟到下一轮
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ ← 获取新的 I/O 事件（核心阶段）
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ ← setImmediate 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │ ← socket.on('close', ...)
│  └───────────────────────────┘
└───────────────────────────────┘
```

### Microtask 与 Macrotask

```js
// 微任务优先级高于宏任务
// 微任务：process.nextTick > Promise.then
// 宏任务：timer > I/O > setImmediate > close

console.log('1')
setTimeout(() => console.log('2'), 0)
queueMicrotask(() => console.log('3'))
Promise.resolve().then(() => console.log('4'))
process.nextTick(() => console.log('5'))
console.log('6')
// 输出：1, 6, 5, 3, 4, 2
```

### process.nextTick 原理

`process.nextTick` 不在 Event Loop 的任何一个 phase 中，而是在每个 phase 切换之间执行，因此优先级最高。

```js
// 使用场景：在 I/O 之前执行、错误处理
function api(callback) {
  if (typeof callback !== 'function') {
    // 使用 nextTick 确保在异步上下文中抛出
    process.nextTick(() => { throw new TypeError('callback required') })
    return
  }
  // ...
}
```

## Streams 进阶

### Backpressure（背压）

当数据消费速度慢于生产速度时，流会自动通过 `highWaterMark` 控制内存占用：

```js
import { Readable, Writable } from 'stream'

const readable = new Readable({
  highWaterMark: 16 * 1024,  // 16KB
  read() {}
})

const writable = new Writable({
  highWaterMark: 16 * 1024,
  write(chunk, encoding, callback) {
    callback()
  }
})

// 检查背压状态
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk)
  if (!canContinue) {
    readable.pause()
    writable.once('drain', () => readable.resume())
  }
})
```

### Object Mode

默认 Stream 只处理 Buffer/string，objectMode 允许传递任意 JS 对象：

```js
const { Transform } = require('stream')

const filter = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    // chunk 是一个 JS 对象
    if (chunk.status === 'active') {
      this.push({ ...chunk, processed: true })
    }
    callback()
  }
})

// 使用 pipeline 处理对象流
pipeline(
  Readable.from([{ id: 1 }, { id: 2 }]),
  filter,
  new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      console.log(chunk)
      callback()
    }
  }),
  (err) => {}
)
```

### 四种流类型

| 类型 | 接口 | 用途 |
|------|------|------|
| Readable | `read()`、`data` 事件 | 数据源（文件、HTTP 响应） |
| Writable | `write()`、`end()` | 数据目标（文件、HTTP 请求） |
| Transform | `transform()` | 转换数据（压缩、加密） |
| Duplex | 同时实现 R + W | 双向通信（TCP socket） |

```js
import { Duplex } from 'stream'

// Duplex 示例——内存中的双端通信
const duplex = new Duplex({
  write(chunk, encoding, callback) {
    console.log('写入:', chunk.toString())
    callback()
  },
  read(size) {
    this.push(String(Date.now()))
    this.push(null) // 结束
  }
})

duplex.on('data', (chunk) => console.log('读取:', chunk.toString()))
duplex.write('hello')
```

## Child Process

```js
import { spawn, exec, fork } from 'child_process'

// spawn — 流式输出，适合大量数据
const child = spawn('ls', ['-lh', '/usr'])
child.stdout.on('data', (data) => process.stdout.write(data))
child.stderr.on('data', (data) => console.error(data))
child.on('exit', (code) => console.log(`exit ${code}`))

// exec — 缓存输出，适合少量数据
exec('cat package.json', { maxBuffer: 1024 * 1024 }, (err, stdout) => {
  if (err) throw err
  console.log(stdout)
})

// fork — 创建 Node.js 子进程（通信）
// parent.js
const child2 = fork('./worker.js')
child2.send({ task: 'compute' })
child2.on('message', (result) => console.log(result))

// worker.js
process.on('message', (msg) => {
  process.send({ result: msg.task + ' done' })
  process.exit()
})

// cluster — 多核利用
import cluster from 'cluster'
import os from 'os'

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker) => cluster.fork()) // 自动重启
} else {
  http.createServer((req, res) => res.end('ok')).listen(3000)
}
```

## Worker Threads（多线程 CPU 密集任务）

Node.js Worker Threads 用于 CPU 密集型任务，不阻塞主线程：

```js
// main.js
import { Worker } from 'worker_threads'

const worker = new Worker('./heavy.js', { workerData: { iterations: 1e9 } })
worker.on('message', (result) => console.log(result))
worker.on('error', (err) => console.error(err))
worker.postMessage('start')

// heavy.js
import { parentPort, workerData } from 'worker_threads'

parentPort.on('message', (msg) => {
  let sum = 0
  for (let i = 0; i < workerData.iterations; i++) {
    sum += Math.sqrt(i)
  }
  parentPort.postMessage({ sum })
})
```

### 线程池模式

```js
// 使用 Worker Pool 处理并发任务
import { Worker } from 'worker_threads'
import { cpus } from 'os'

class WorkerPool {
  constructor(workerFile, size = cpus().length) {
    this.workers = []
    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(workerFile))
    }
  }
  // 通过轮询分配任务
}
```

## C++ Addon 基础（N-API）

```c
// addon.c
#include <node_api.h>
napi_value Hello(napi_env env, napi_callback_info info) {
  napi_value result;
  napi_create_string_utf8(env, "Hello from C++", NAPI_AUTO_LENGTH, &result);
  return result;
}
NAPI_MODULE_INIT() {
  napi_value fn;
  napi_create_function(env, NULL, 0, Hello, NULL, &fn);
  return fn;
}
```

```json
// binding.gyp
{ "targets": [{ "target_name": "addon", "sources": ["addon.c"] }] }
```

```sh
node-gyp configure && node-gyp build
```

```js
const addon = require('./build/Release/addon')
console.log(addon()) // 'Hello from C++'
```

## Buffer 与 TypedArray

```js
// Buffer（Node.js 特有）
const buf = Buffer.alloc(10, 0)       // 创建 10 字节零填充
const buf2 = Buffer.from('hello', 'utf-8')
const buf3 = Buffer.from([0x48, 0x65, 0x6c])

buf.write('world', 0, 'utf-8')
console.log(buf.toString('utf-8'))    // 'world'
console.log(buf.toJSON())             // { type: 'Buffer', data: [...] }

// TypedArray（JS 标准）
const arr = new Uint8Array(10)
arr[0] = 255
const view = new DataView(arr.buffer)

// Buffer 与 TypedArray 转换
const buf4 = Buffer.from(arr.buffer)
const arr2 = new Uint8Array(buf4.buffer, buf4.byteOffset, buf4.byteLength)
```

## 安全进阶

```js
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

const app = express()

// CSP（内容安全策略）
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'strict-dynamic'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:"],
  }
}))

// CORS 严格策略
app.use(cors({
  origin: ['https://example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 预检请求缓存 24h
}))

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: '请求过于频繁' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
})
app.use('/api', limiter)

// 输入验证（防注入）
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().max(200).transform(s => s.replace(/[<>"'&]/g, '')),
  page: z.coerce.number().int().positive().default(1),
})

app.get('/search', (req, res) => {
  const params = searchSchema.parse(req.query)
  // 安全使用 params.q 查询数据库
})
```

## 性能监控

```sh
# clinic.js — 可视化的性能诊断
npm install -g clinic
clinic doctor -- node server.js
clinic flame -- node server.js
clinic bubbleprof -- node server.js

# 0x — 火焰图生成
npm install -g 0x
0x server.js

# Node.js 内置 profiling
node --prof --prof-log-file=profile.log server.js
node --prof-process profile.log > flame.txt

# 火焰图分析
# 通过 clinick flame 或 0x 生成的火焰图可以直观看到：
# - 哪些函数占用 CPU 时间最长
# - 调用栈深度和频率
# - 同步阻塞的位置
```

### 性能监控最佳实践

```js
// 使用 perf_hooks 进行精确测量
import { performance, PerformanceObserver } from 'perf_hooks'

const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`)
  }
})
obs.observe({ entryTypes: ['measure'], buffered: false })

// 自定义测量
performance.mark('query-start')
await db.query('SELECT ...')
performance.mark('query-end')
performance.measure('DB Query', 'query-start', 'query-end')
```

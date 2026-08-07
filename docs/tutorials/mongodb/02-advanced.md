# MongoDB 进阶深入

## Change Streams（实时数据监听）

Change Streams 允许应用实时监听数据库变更，可用于事件驱动架构、缓存同步、实时通知等场景。

```js
const { MongoClient } = require('mongodb')

async function watchCollection() {
  const client = await MongoClient.connect('mongodb://localhost:27017')
  const db = client.db('mydb')
  const collection = db.collection('orders')

  // 监听 orders 集合的变更
  const changeStream = collection.watch([
    { $match: { 'fullDocument.status': 'completed' } }
  ])

  changeStream.on('change', (change) => {
    console.log('变更类型:', change.operationType)
    console.log('文档内容:', change.fullDocument)
  })
}

watchCollection()
```

| 事件类型 | 说明 |
|---------|------|
| `insert` | 文档插入 |
| `update` | 文档更新 |
| `replace` | 文档替换 |
| `delete` | 文档删除 |

## Transaction（多文档事务）

从 MongoDB 4.0 开始支持多文档事务，保证 ACID 特性。需使用副本集或分片集群。

```js
const { MongoClient } = require('mongodb')

async function transferMoney(fromId, toId, amount) {
  const client = await MongoClient.connect('mongodb://localhost:27017/mydb')
  const session = client.startSession()

  try {
    session.startTransaction()

    const accounts = client.db().collection('accounts')

    // 扣款
    await accounts.updateOne(
      { _id: fromId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session }
    )

    // 入账
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: amount } },
      { session }
    )

    await session.commitTransaction()
    console.log('转账成功')
  } catch (err) {
    await session.abortTransaction()
    console.log('转账失败，已回滚:', err.message)
  } finally {
    session.endSession()
    client.close()
  }
}
```

## Atlas Search（全文搜索）

Atlas Search 基于 Lucene 引擎，提供比文本索引更强大的全文搜索能力。

```js
// 创建 Atlas Search 索引（通过 Atlas UI 或 API）
// {
//   "mappings": {
//     "fields": {
//       "title": { "type": "string" },
//       "description": { "type": "string" },
//       "price": { "type": "number" }
//     }
//   }
// }

// 使用 $search 聚合阶段
db.products.aggregate([
  {
    $search: {
      index: "default",
      compound: {
        must: [
          { text: { query: "laptop", path: "title", fuzzy: { maxEdits: 1 } } }
        ],
        filter: [
          { range: { path: "price", gte: 1000, lte: 5000 } }
        ]
      }
    }
  },
  { $limit: 10 },
  {
    $project: {
      title: 1,
      price: 1,
      score: { $meta: "searchScore" }
    }
  }
])
```

| 功能 | 文本索引 | Atlas Search |
|------|---------|-------------|
| 分词 | 基础 | 高级（支持多语言） |
| 模糊搜索 | 不支持 | 支持 |
| 同义词 | 不支持 | 支持 |
| 自动补全 | 不支持 | 支持 |
| 打分排序 | 简单 | 可定制 |

## MongoDB Realm（后端即服务）

Realm 提供后端服务、用户认证、无服务器函数等能力。

```js
// Realm SDK 示例（Web）
import * as Realm from "realm-web"

const app = new Realm.App({ id: "your-app-id" })

// 匿名登录
const credentials = Realm.Credentials.anonymous()
const user = await app.logIn(credentials)

// 调用 Realm 函数
const result = await user.functions.callFunction("getProducts", {
  category: "electronics",
  page: 1
})

// MongoDB 直接访问
const mongodb = user.mongoClient("mongodb-atlas")
const collection = mongodb.db("store").collection("products")
const products = await collection.find({ price: { $lt: 100 } })
```

## Time Series（时序集合）

MongoDB 5.0+ 提供专门的时序集合，优化 IoT、监控等时序数据存储。

```js
// 创建时序集合
db.createCollection("sensor_data", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "seconds"  // seconds | minutes | hours
  }
})

// 插入时序数据
db.sensor_data.insertMany([
  { timestamp: new Date(), metadata: { sensor: "temp-01", room: "A1" }, value: 22.5 },
  { timestamp: new Date(), metadata: { sensor: "temp-01", room: "A1" }, value: 22.7 },
  { timestamp: new Date(), metadata: { sensor: "humidity-01", room: "A1" }, value: 55.2 },
])

// 时序聚合查询
db.sensor_data.aggregate([
  { $match: { "metadata.sensor": "temp-01" } },
  {
    $group: {
      _id: { $dateTrunc: { date: "$timestamp", unit: "hour" } },
      avgTemp: { $avg: "$value" },
      minTemp: { $min: "$value" },
      maxTemp: { $max: "$value" }
    }
  },
  { $sort: { _id: 1 } }
])
```

## 加密

### Encryption at Rest（静态加密）

通过 WiredTiger 存储引擎的加密功能实现。

```
# mongod.conf
security:
  enableEncryption: true
  encryptionKeyFile: /path/to/keyfile
  encryptionCipherMode: AES256-CBC
```

### Client-side Field Level Encryption（客户端字段级加密）

```js
const { MongoClient, ClientEncryption } = require('mongodb')

const kmsProviders = {
  local: {
    key: Buffer.from('...64位十六进制密钥...', 'hex')
  }
}

const client = await MongoClient.connect('mongodb://localhost:27017', {
  autoEncryption: {
    kmsProviders,
    keyVaultNamespace: 'encryption.__keyVault',
    schemaMap: {
      'mydb.patients': {
        bsonType: 'object',
        encryptMetadata: {
          keyId: [null],
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
        },
        properties: {
          ssn: { encrypt: { bsonType: 'string' } },
          medicalRecords: { encrypt: { bsonType: 'array' } }
        }
      }
    }
  }
})

// 数据插入时自动加密
await client.db('mydb').collection('patients').insertOne({
  name: 'John Doe',
  ssn: '123-45-6789',          // 自动加密
  medicalRecords: ['...'],      // 自动加密
  hospital: 'General Hospital'  // 明文存储
})
```

## 数据降级策略

当数据库节点故障或网络分区时，确保系统可用性。

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **读偏好降级** | 主节点不可用时读从节点 | 读多写少、允许最终一致性 |
| **写关注降级** | 降低写确认级别确保写入可用 | 高写入吞吐、容忍少量数据丢失 |
| **缓存回退** | DB 不可用时用缓存兜底 | 读密集型、可接受脏数据 |
| **降级响应** | 返回简化数据或错误提示 | API 网关、微服务 |
| **熔断** | 失败率达到阈值时快速拒绝 | 防止雪崩 |

```js
// 读偏好降级配置
const client = new MongoClient(uri, {
  readPreference: 'primaryPreferred',  // 优先主节点，不可用则读从节点
  readPreferenceTags: [
    { region: 'us-east' },
    {}
  ]
})

// 写关注降级
db.orders.insertOne(
  { item: 'Laptop', qty: 100 },
  { writeConcern: { w: 1, wtimeout: 3000 } }  // 仅等待主节点确认
)

// 熔断模式示例
class CircuitBreaker {
  constructor(options = {}) {
    this.failureCount = 0
    this.threshold = options.threshold || 5
    this.timeout = options.timeout || 30000
    this.state = 'CLOSED'
    this.lastFailureTime = null
  }

  async call(fn, fallback) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        return fallback()
      }
    }

    try {
      const result = await fn()
      this.failureCount = 0
      this.state = 'CLOSED'
      return result
    } catch (err) {
      this.failureCount++
      this.lastFailureTime = Date.now()
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN'
      }
      return fallback()
    }
  }
}
```

## 官方文档

Change Streams、事务、时序集合、分片与加密细节以 MongoDB Manual 为准。

| 主题 | 链接 |
|------|------|
| 聚合与管道 | [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) · [聚合阶段参考](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/) |
| Change Streams | [Change Streams](https://www.mongodb.com/docs/manual/changeStreams/) |
| 事务 | [Transactions](https://www.mongodb.com/docs/manual/core/transactions/) |
| 时序集合 | [Time Series](https://www.mongodb.com/docs/manual/core/timeseries-collections/) |
| 搜索 | [Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search/) · [Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/) |
| 加密 | [Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/) · [Encryption at Rest](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) |
| 数据建模 | [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) |

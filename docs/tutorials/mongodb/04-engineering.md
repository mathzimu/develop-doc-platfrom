# MongoDB 工程实践

## 数据建模

### 引用 vs 嵌入

```js
// 嵌入（适合：子文档变化少、查询总是一起获取）
{
  _id: ObjectId("..."),
  name: "Alice",
  orders: [
    { product: "Laptop", amount: 9999, date: ISODate("2025-01-15") },
    { product: "Mouse", amount: 99, date: ISODate("2025-01-20") },
  ]
}

// 引用（适合：子文档独立变化、频繁修改）
// users collection
{ _id: ObjectId("..."), name: "Alice" }

// orders collection
{ _id: ObjectId("..."), user_id: ObjectId("..."), product: "Laptop", amount: 9999 }
```

### 设计模式

```js
// 1. 预聚合模式（避免频繁计算）
// 将统计数据预存到文档中
{
  _id: ObjectId("..."),
  name: "Alice",
  order_stats: {
    total_orders: 42,
    total_spent: 150000,
    avg_order: 3571,
    last_order_date: ISODate("2025-03-01"),
  }
}

// 2. 分桶模式（时序数据）
{
  sensor_id: "temp-001",
  hour: ISODate("2025-03-01T00:00:00Z"),
  readings: [
    { t: "00:01:00", v: 22.5 },
    { t: "00:02:00", v: 22.7 },
    // ... 60 条每分钟数据
  ],
  stats: { min: 22.1, max: 23.2, avg: 22.6 }
}

// 3. 多态模式（不同类型共享集合）
{
  _id: ObjectId("..."),
  type: "customer",
  name: "Alice",
  company: null,
  discount: 0
}
{
  _id: ObjectId("..."),
  type: "corporate",
  name: "Bob Corp",
  contact_person: "Bob",
  discount: 0.15
}
```

## 分片集群

```js
// 启用分片
sh.enableSharding("mydb")

// 对集合分片（选择合适的分片键）
sh.shardCollection("mydb.orders", { user_id: "hashed" })

// 分片键选择原则
// 1. 高基数（大量不同值）
// 2. 均匀分布（避免热点）
// 3. 查询包含分片键

// 分片键不好的选择
sh.shardCollection("mydb.logs", { status: 1 })   // 基数低，分布不均

// 好的选择
sh.shardCollection("mydb.orders", { order_id: "hashed" })
```

## 副本集

```js
// 初始化副本集
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", arbiterOnly: true },
  ]
})

// 读写关注
// 写关注：确认写入到多数节点
db.orders.insertOne(
  { item: "Laptop", qty: 100 },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
)

// 读偏好：从次级节点读取
db.orders.find().readPref("secondaryPreferred")

// 驱动配置
const client = new MongoClient(uri, {
  replicaSet: "rs0",
  readPreference: "secondaryPreferred",
  writeConcern: { w: "majority" },
})
```

## 聚合管道优化

```js
// 优化原则：
// 1. $match 和 $limit 尽早执行
// 2. 使用索引支持的 $match 和 $sort
// 3. $project 只保留需要的字段
// 4. 避免 $unwind 大数组

// ❌ 低效
db.orders.aggregate([
  { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" }},
  { $match: { "user.status": "active" }},
  { $unwind: "$items" },
  { $group: { _id: "$user_id", total: { $sum: "$items.price" }}},
])

// ✅ 高效
db.orders.aggregate([
  { $match: { created_at: { $gte: ISODate("2025-01-01") }}},
  { $lookup: {
      from: "users",
      let: { uid: "$user_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$uid"] }, status: "active" }},
        { $project: { _id: 1 }},
      ],
      as: "user"
  }},
  { $match: { "user.0": { $exists: true }}},
  { $unwind: "$items" },
  { $group: { _id: "$user_id", total: { $sum: "$items.price" }}},
  { $sort: { total: -1 }},
  { $limit: 20 },
])
```

## 监控与告警

```js
// 查看操作缓慢的查询
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find({ millis: { $gt: 200 } }).sort({ ts: -1 }).limit(10)

// 查看索引使用情况
db.orders.aggregate([
  { $indexStats: {} }
])

// MongoDB Atlas 监控指标
// 1. 操作数/秒
// 2. 连接数
// 3. 内存使用
// 4. 磁盘 I/O
// 5. 复制延迟
// 6. 扫描与返回行数比
```

## 备份自动化

```sh
#!/bin/bash
# scripts/backup.sh — 自动备份 MongoDB

BACKUP_DIR="/backups/mongodb"
DB_NAME="mydb"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 创建备份
mongodump --db "$DB_NAME" --out "$BACKUP_DIR/$DATE" --gzip

# 压缩
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# 清理过期备份
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 上传到 S3（可选）
# aws s3 cp "$BACKUP_DIR/$DATE.tar.gz" "s3://my-backups/mongodb/"

echo "Backup completed: $DATE"
```

```js
// Node.js 定时备份脚本
import { execSync } from 'child_process'
import { schedule } from 'node-cron'

schedule('0 3 * * *', () => {
  const date = new Date().toISOString().slice(0, 10)
  const cmd = `mongodump --db mydb --out /backups/${date} --gzip`
  execSync(cmd)
  console.log(`Backup ${date} completed`)
})
```

## 持续集成（CI/CD）

```yaml
# .github/workflows/mongodb-tests.yml
name: MongoDB Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # 执行数据迁移
          mongosh "mongodb+srv://${{ secrets.ATLAS_URI }}" --file ./scripts/migrate.js
          # 滚动重启应用
          curl -X POST ${{ secrets.DEPLOY_WEBHOOK }}
```

## 官方文档

| 主题 | 链接 |
|------|------|
| 数据建模 | [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) |
| 分片 | [Sharding](https://www.mongodb.com/docs/manual/sharding/) · [分片键选择](https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/) |
| 副本集 | [Replication](https://www.mongodb.com/docs/manual/replication/) |
| 索引优化 | [Indexes](https://www.mongodb.com/docs/manual/indexes/) |
| 监控 | [mongostat/mongotop](https://www.mongodb.com/docs/database-tools/) · [Atlas Performance Advisor](https://www.mongodb.com/docs/atlas/performance-advisor/) |
| 安全 | [Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/) |

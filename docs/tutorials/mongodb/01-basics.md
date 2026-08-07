# MongoDB 基础语法

MongoDB 是一种 NoSQL 文档数据库，将数据存储为 JSON 风格的 BSON 文档。它采用灵活的文档模型，不需要预定义表结构。

## 核心概念

MongoDB 属于文档型 NoSQL 数据库，数据以 **BSON**（Binary JSON）形式存储在集合中。与关系型数据库相比，它没有固定表结构（schema-less），同一集合中的文档可以拥有不同的字段，更适合快速迭代与存储结构易变的数据。

| 关系型数据库 | MongoDB |
|-------------|---------|
| Database（数据库） | Database（数据库） |
| Table（表） | Collection（集合） |
| Row（行） | Document（文档） |
| Column（列） | Field（字段） |
| Primary Key | `_id`（自动生成 ObjectId） |

::: tip 关键概念
- **文档（Document）** 是 MongoDB 的最小数据单元，等价于一行记录，用 BSON 表示。
- **集合（Collection）** 是一组文档的容器，等价于表，但不需要预先定义字段。
- **`_id`** 是集合内唯一的主键，未指定时 Mongo 会自动生成 12 字节的 ObjectId（含时间戳，可粗略按时间排序）。
:::

## 基本数据类型

```
String, Number, Boolean, Array, Object, Null
ObjectId, Date, Binary, Regex, Code
```

::: tip 易混淆点
- **Number** 默认是双精度浮点（`double`）；需要整数时用 `Int32`/`Int64`，高精度货币用 `Decimal128`。
- **Array / Object** 让文档可以嵌套，这是文档库相比行表的优势——一次查询即可拿到关联数据，减少 join。
- **ObjectId** 不是字符串，比较时要用 `ObjectId("...")` 而非普通字符串。
:::

## 安装与连接

```sh
# macOS
brew install mongodb-community
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongo mongo:7

# 连接
mongosh  # 默认连接 localhost:27017
```

## 数据库与集合

```js
// 查看数据库
show dbs
use mydb            // 切换/创建数据库
db                  // 当前数据库

// 集合操作
db.createCollection("users")
show collections
db.users.drop()     // 删除集合
```

## 文档操作（CRUD）

MongoDB 的读写操作都以 **集合** 为作用对象，方法名采用 `操作 + One/Many` 的命名（如 `insertOne` / `insertMany`）。所有写入操作默认返回 `{ acknowledged: true, insertedId }` 等结果对象。

### 创建

```js
// 插入单条
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  tags: ["developer", "admin"],
  address: {
    city: "Beijing",
    street: "Main St"
  }
})

// 插入多条
db.users.insertMany([
  { name: "Bob", email: "bob@example.com", age: 25 },
  { name: "Carol", email: "carol@example.com", age: 28 },
])
```

### 查询

`find()` 返回游标（cursor），不会立即把全部数据载入内存；`pretty()` 仅用于 shell 美化输出。条件对象采用 **查询操作符**（`$gt`/`$lt`/`$in` 等）表达范围与逻辑。

```js
// 查询所有
db.users.find()
db.users.find().pretty()

// 条件查询
db.users.find({ age: 30 })
db.users.find({ age: { $gt: 25 } })         // 大于
db.users.find({ age: { $gte: 25, $lte: 35 } })  // 范围
db.users.find({ name: /^A/ })               // 正则
db.users.find({ tags: "admin" })            // 数组包含

// 逻辑操作
db.users.find({
  $and: [{ age: { $gt: 25 } }, { tags: "admin" }]
})
db.users.find({
  $or: [{ age: { $lt: 20 } }, { age: { $gt: 40 } }]
})

// 投影（选择字段）
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排序与分页
db.users.find().sort({ age: -1 }).limit(10).skip(20)

// 计数
db.users.countDocuments({ age: { $gt: 25 } })

// 聚合
db.users.aggregate([
  { $match: { age: { $gt: 20 } } },
  { $group: { _id: "$city", avgAge: { $avg: "$age" }, count: { $sum: 1 } } },
  { $sort: { avgAge: -1 } },
  { $limit: 5 }
])
```

### 更新

```js
// 更新单条
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 31, updatedAt: new Date() } }
)

// 更新多条
db.users.updateMany(
  { age: { $lt: 20 } },
  { $set: { status: "junior" } }
)

// 替换文档
db.users.replaceOne(
  { name: "Alice" },
  { name: "Alice", email: "new@example.com", age: 32 }
)

// 数组操作
db.users.updateOne(
  { name: "Alice" },
  {
    $push: { tags: "vip" },        // 添加元素
    $pull: { tags: "old-tag" },    // 移除元素
    $addToSet: { tags: "unique" }, // 不重复添加
  }
)

// 递增
db.users.updateOne(
  { name: "Alice" },
  { $inc: { loginCount: 1 } }
)
```

### 删除

```js
db.users.deleteOne({ name: "Bob" })
db.users.deleteMany({ status: "inactive" })
db.users.deleteMany({})    // 删除全部（保留集合）
```

## 索引

索引用于加速查询、约束唯一性。没有合适索引时，MongoDB 会执行 **全集合扫描（COLLSCAN）**，数据量大时极慢。索引建立在字段上，`1` 表示升序、`-1` 表示降序（单字段索引方向不影响结果，仅影响复合索引的排序匹配）。

```js
// 单字段索引
db.users.createIndex({ email: 1 })           // 1: 升序, -1: 降序
db.users.createIndex({ email: 1 }, { unique: true })  // 唯一索引

// 复合索引
db.users.createIndex({ city: 1, age: -1 })

// 文本索引
db.users.createIndex({ name: "text", bio: "text" })
db.users.find({ $text: { $search: "developer" } })

// 查看索引
db.users.getIndexes()

// 删除索引
db.users.dropIndex("email_1")
```

## 聚合管道

聚合管道（Aggregation Pipeline）是一组 **有序的阶段（stage）** 组成的处理链，前一个阶段的输出是后一个阶段的输入，类似 Unix 管道。常用阶段包括 `$match`（筛选）、`$group`（分组聚合）、`$sort`、`$limit`、`$lookup`（关联）、`$unwind`（展开数组）。当查询涉及统计、分组、连表时，优先使用聚合管道而非在应用层循环处理。

```js
db.orders.aggregate([
  // 阶段 1：筛选
  { $match: { status: "completed" } },

  // 阶段 2：分组计算
  {
    $group: {
      _id: "$productId",
      totalSales: { $sum: "$amount" },
      avgAmount: { $avg: "$amount" },
      count: { $sum: 1 },
      maxAmount: { $max: "$amount" }
    }
  },

  // 阶段 3：排序
  { $sort: { totalSales: -1 } },

  // 阶段 4：限制
  { $limit: 10 },

  // 阶段 5：关联其他集合
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },

  // 阶段 6：展开数组
  { $unwind: "$product" }
])
```

## Mongoose（Node.js ODM）

Mongoose 是 Node.js 生态最流行的 ODM（对象文档映射）库。它在原生驱动之上提供 **Schema 校验、中间件、虚拟字段、类型转换**，让代码更符合面向对象习惯。在生产项目中，建议用 Mongoose 定义 Schema 约束写入结构，而非直接调用原生 `db.collection`。

```js
import mongoose from 'mongoose'

// 连接
await mongoose.connect('mongodb://localhost:27017/mydb')

// 定义 Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  tags: [String],
  address: {
    city: String,
    street: String,
  },
}, { timestamps: true })

// 创建 Model
const User = mongoose.model('User', userSchema)

// 操作
const user = await User.create({ name: 'Alice', email: 'a@a.com' })
const users = await User.find({ age: { $gte: 18 } }).sort('-age').limit(10)
const updated = await User.findByIdAndUpdate(id, { $set: { age: 31 } }, { new: true })
const deleted = await User.findByIdAndDelete(id)
```

## 备份与恢复

```sh
# 导出
mongodump --db mydb --out ./backup
mongoexport --db mydb --collection users --out users.json

# 导入
mongorestore --db mydb ./backup/mydb
mongoimport --db mydb --collection users --file users.json
```

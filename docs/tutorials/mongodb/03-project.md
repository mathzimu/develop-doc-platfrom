# 实战项目：图书管理系统

使用 Node.js + Mongoose + Express 构建完整的图书管理系统 API。

## 项目结构

```
book-manager/
├── package.json
├── src/
│   ├── index.js          # 入口
│   ├── models/
│   │   ├── Book.js
│   │   ├── Author.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── books.js
│   │   ├── authors.js
│   │   └── orders.js
│   └── middleware/
│       └── error.js
└── scripts/
    └── seed.js           # 测试数据
```

## Schema 设计

```js
// models/Book.js
import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true, index: 'text' },
  isbn:        { type: String, unique: true, required: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  category:    { type: String, enum: ['Fiction', 'Science', 'History', 'Tech', 'Art'] },
  price:       { type: Number, min: 0, required: true },
  stock:       { type: Number, default: 0, min: 0 },
  published:   { type: Date },
  tags:        [String],
  ratings:     [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating:   { type: Number, default: 0 },
}, { timestamps: true })

// 复合索引：按分类和价格查询
bookSchema.index({ category: 1, price: -1 })

export const Book = mongoose.model('Book', bookSchema)
```

```js
// models/Author.js
const authorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  bio:         String,
  birthDate:   Date,
  nationality: String,
  books:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
}, { timestamps: true })

export const Author = mongoose.model('Author', authorSchema)
```

```js
// models/Order.js
const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:   [{
    book:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    qty:    { type: Number, min: 1 },
    price:  { type: Number },
  }],
  total:   { type: Number, required: true },
  status:  {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  address: {
    province: String,
    city: String,
    detail: String,
    zip: String,
  },
}, { timestamps: true })

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export const Order = mongoose.model('Order', orderSchema)
```

## CRUD API

```js
// routes/books.js
import { Router } from 'express'
import { Book } from '../models/Book.js'

const router = Router()

// 创建图书
router.post('/', async (req, res) => {
  const book = await Book.create(req.body)
  res.status(201).json(book)
})

// 获取图书列表（分页+筛选）
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, category, minPrice, maxPrice } = req.query
  const filter = {}
  if (category) filter.category = category
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Book.countDocuments(filter)
  ])

  res.json({ data: books, total, page: Number(page), pages: Math.ceil(total / limit) })
})

// 获取单本图书
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('author', 'name nationality')
    .populate('ratings.user', 'name')
  if (!book) return res.status(404).json({ error: '图书不存在' })
  res.json(book)
})

// 更新图书
router.put('/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!book) return res.status(404).json({ error: '图书不存在' })
  res.json(book)
})

// 删除图书
router.delete('/:id', async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id)
  if (!book) return res.status(404).json({ error: '图书不存在' })
  res.json({ message: '删除成功' })
})

export default router
```

## 复杂查询

```js
// routes/books.js — 高级搜索
router.get('/search', async (req, res) => {
  const { q, tags, sortBy = 'avgRating', order = 'desc' } = req.query
  const filter = {}

  // 全文搜索
  if (q) filter.$text = { $search: q }

  // 标签筛选
  if (tags) filter.tags = { $all: tags.split(',') }

  const books = await Book.find(filter)
    .populate('author', 'name')
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .limit(20)

  res.json(books)
})

// routes/orders.js — 用户订单统计
router.get('/stats/:userId', async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.params.userId) } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalAmount: { $sum: '$total' },
    }},
    { $sort: { count: -1 } },
  ])
  res.json(stats)
})
```

## 聚合管道

```js
// routes/books.js — 分类销售排行
router.get('/top-sellers', async (req, res) => {
  const topSellers = await Order.aggregate([
    { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
    { $unwind: '$items' },
    { $group: {
      _id: '$items.book',
      totalSold: { $sum: '$items.qty' },
      revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
    }},
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    { $lookup: {
      from: 'books',
      localField: '_id',
      foreignField: '_id',
      as: 'book',
    }},
    { $unwind: '$book' },
    { $project: {
      _id: 0,
      title: '$book.title',
      totalSold: 1,
      revenue: 1,
      category: '$book.category',
    }},
  ])
  res.json(topSellers)
})

// routes/books.js — 作者作品统计
router.get('/author-stats', async (req, res) => {
  const stats = await Book.aggregate([
    { $group: {
      _id: '$author',
      bookCount: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      totalStock: { $sum: '$stock' },
    }},
    { $sort: { bookCount: -1 } },
    { $lookup: {
      from: 'authors',
      localField: '_id',
      foreignField: '_id',
      as: 'author',
    }},
    { $unwind: '$author' },
    { $project: {
      authorName: '$author.name',
      bookCount: 1,
      avgPrice: { $round: ['$avgPrice', 2] },
      totalStock: 1,
    }},
  ])
  res.json(stats)
})
```

## 索引优化

```js
// 为查询场景创建索引
// 1. 分类 + 价格筛选 → 复合索引
// bookSchema.index({ category: 1, price: -1 })

// 2. 全文搜索 → 文本索引
// bookSchema.index({ title: 'text', 'author.name': 'text' })

// 3. 状态 + 时间排序
// orderSchema.index({ status: 1, createdAt: -1 })

// 4. 查看索引使用情况
db.books.aggregate([{ $indexStats: {} }])

// 5. 分析查询执行计划
db.books.find({ category: 'Tech', price: { $lte: 50 } }).explain('executionStats')
```

```js
// scripts/seed.js — 生成测试数据
import mongoose from 'mongoose'
import { Book } from '../src/models/Book.js'
import { Author } from '../src/models/Author.js'

await mongoose.connect('mongodb://localhost:27017/bookstore')

const author = await Author.create({
  name: 'J.K. Rowling',
  nationality: 'British',
  bio: 'Author of the Harry Potter series',
})

const books = await Book.insertMany([
  { title: 'Harry Potter and the Philosopher\'s Stone', isbn: '9780747532699', author: author._id, category: 'Fiction', price: 29.9, stock: 100, tags: ['fantasy', 'magic'] },
  { title: 'Harry Potter and the Chamber of Secrets', isbn: '9780747538493', author: author._id, category: 'Fiction', price: 32.9, stock: 80, tags: ['fantasy', 'magic'] },
])

author.books = books.map(b => b._id)
await author.save()

console.log('测试数据已导入')
await mongoose.disconnect()
```

## 官方文档

| 主题 | 链接 |
|------|------|
| CRUD | [MongoDB CRUD 指南](https://www.mongodb.com/docs/manual/crud/) |
| 聚合 | [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) |
| 索引 | [MongoDB 索引](https://www.mongodb.com/docs/manual/indexes/) |
| ODM | [Mongoose](https://mongoosejs.com/docs/guide.html) |
| 数据建模 | [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) |

# MongoDB 生态全景

## ODM（对象文档映射）

| 工具 | 语言 | Star | 特点 |
|------|------|------|------|
| **[Mongoose](https://mongoosejs.com)** | Node.js | 27k+ | 最成熟，Schema 校验、中间件、虚拟字段 |
| **[Prisma](https://www.prisma.io)** | Node.js / TS | 40k+ | 类型安全、自动迁移、关系查询 |
| **[TypeORM](https://typeorm.io)** | Node.js / TS | 34k+ | 支持 MongoDB + SQL，Decorator 风格 |
| **[Beanie](https://beanie-odm.dev)** | Python | 2k+ | 基于 Pydantic，异步支持 |
| **[Mongoid](https://mongoid.org)** | Ruby | 4k+ | Rails 生态，成熟稳定 |
| **[MongoEngine](http://mongoengine.org)** | Python | 4k+ | 经典 Python ODM |

## GUI 工具

| 工具 | 平台 | 价格 | 特点 |
|------|------|------|------|
| **[MongoDB Compass](https://www.mongodb.com/products/compass)** | Win / Mac / Linux | 免费 | 官方工具，可视化查询、索引建议 |
| **[Studio 3T](https://studio3t.com)** | Win / Mac / Linux | 商业 | SQL 查询、数据导入导出、代码生成 |
| **[NoSQLBooster](https://nosqlbooster.com)** | Win / Mac / Linux | 免费/商业 | 智能补全、查询历史、MongoDB Shell |
| **[TablePlus](https://tableplus.com)** | Win / Mac | 商业 | 轻量级，支持多种数据库 |
| **[Navicat for MongoDB](https://www.navicat.com)** | Win / Mac | 商业 | 数据建模、同步、备份 |

## 云服务

| 服务商 | 说明 | 免费层 | 适用场景 |
|--------|------|--------|---------|
| **[MongoDB Atlas](https://www.mongodb.com/atlas)** | 官方云服务 | 512MB，共享集群 | 生产首选，全球多区域 |
| **[DigitalOcean](https://www.digitalocean.com/products/managed-databases/)** | 托管 MongoDB | 无 | 与 DO 生态集成 |
| **[AWS DocumentDB](https://aws.amazon.com/documentdb/)** | MongoDB 兼容 | 无 | AWS 生态，MongoDB 3.6/4.0 兼容 |
| **[Azure Cosmos DB](https://azure.microsoft.com/products/cosmos-db/)** | MongoDB API | 1000 RU/s | 全球分布，多模型 |
| **[Google Cloud Memorystore](https://cloud.google.com/memorystore)** | 托管 MongoDB | 无 | GCP 生态 |

## CLI 工具

| 命令 | 说明 | 常用参数 |
|------|------|---------|
| `mongosh` | MongoDB Shell（新版） | `--eval`, `--file`, `--quiet` |
| `mongodump` | 二进制导出 | `--db`, `--collection`, `--out`, `--gzip`, `--archive` |
| `mongorestore` | 二进制导入 | `--db`, `--collection`, `--drop`, `--gzip`, `--archive` |
| `mongoexport` | JSON/CSV 导出 | `--db`, `--collection`, `--out`, `--type=csv`, `--fields` |
| `mongoimport` | JSON/CSV 导入 | `--db`, `--collection`, `--file`, `--drop`, `--headerline` |
| `mongostat` | 实时状态监控 | `--host`, `--port`, `--discover`, `--rowcount` |
| `mongotop` | 读写耗时监控 | `--host`, `--port`, `--locks` |
| `mongofiles` | GridFS 文件操作 | `--db`, `--local`, `--put`, `--get` |

### 常用命令组合

```sh
# 全量备份与恢复
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/mydb" --gzip --archive > backup.gz
mongorestore --gzip --archive < backup.gz

# 集合导出为 CSV
mongoexport --db mydb --collection users --type csv --fields name,email,age --out users.csv

# 批量导入
mongoimport --db mydb --collection products --file products.json --drop

# 实时监控
mongostat --host localhost:27017 --rowcount 10 2
```

## 官方文档与延伸阅读

- **官方手册**：[MongoDB Manual](https://www.mongodb.com/docs/manual/) · [CRUD 与聚合参考](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)
- **驱动**：[Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/) · [PyMongo](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/) · [Java Sync Driver](https://www.mongodb.com/docs/drivers/java/sync/)
- **ODM/工具**：[Mongoose](https://mongoosejs.com/docs/guide.html) · [mongosh](https://www.mongodb.com/docs/mongodb-shell/) · [Compass](https://www.mongodb.com/docs/compass/current/) · [Database Tools](https://www.mongodb.com/docs/database-tools/)
- **云服务**：[MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- **数据建模**：[Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
- **安全**：[Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

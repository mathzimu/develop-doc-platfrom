# SQL 生态全景

## 数据库选型

```
关系型                    NoSQL                     时序/分析
PostgreSQL  ──── Redis   ────   MongoDB    ────   ClickHouse
MySQL       ──── Memcached      DynamoDB   ────   DuckDB
SQLite      ──── Elasticsearch  Cassandra  ────   TimescaleDB
SQL Server                     Couchbase          Materialize
Oracle                          Firestore          Apache Druid
```

| 场景 | 推荐数据库 |
|------|-----------|
| 通用业务 | PostgreSQL / MySQL |
| 嵌入式/移动 | SQLite |
| 缓存/会话 | Redis |
| 文档/JSON | MongoDB |
| 全文搜索 | Elasticsearch |
| 时序数据 | TimescaleDB / ClickHouse |
| 分析查询 | DuckDB / ClickHouse |
| 高并发写 | Cassandra |

## ORM 生态

```python
# Python
# SQLAlchemy 2.0 —— 企业级 ORM
# Django ORM —— Django 内置
# Tortoise ORM —— 异步
# Peewee —— 轻量
# PonyORM —— 语法简洁

// TypeScript/JavaScript
// Prisma —— 类型安全（推荐）
// Drizzle ORM —— 轻量、SQL 风格
// TypeORM —— 功能完整
// Sequelize —— 传统选择
// Knex.js —— SQL 查询构建器

// Java
// Hibernate —— JPA 标准
// MyBatis —— SQL 映射

// Go
// GORM —— 流行 ORM
// sqlx —— SQL 扩展
// Ent —— Facebook 出品
```

### Prisma 示例

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  published Boolean  @default(false)
}
```

## 迁移工具

| 语言 | 工具 |
|------|------|
| Python | **Alembic**（SQLAlchemy）、Django Migrations |
| TypeScript | **Prisma Migrate**、Drizzle Kit、TypeORM Migrations |
| Java | **Flyway**、Liquibase |
| Go | **golang-migrate**、Goose |
| Ruby | ActiveRecord Migrations |

## 连接池与代理

```yaml
# PgBouncer —— PostgreSQL 连接池（推荐）
[databases]
mydb = host=primary port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
default_pool_size = 50
max_client_conn = 200

# ProxySQL —— MySQL 代理
# 支持读写分离、查询缓存、防火墙
```

## 监控与分析

```sql
-- pg_stat_statements —— 查询性能分析
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC LIMIT 10;

-- MySQL slow query log
-- SET GLOBAL slow_query_log = 'ON';
-- SET GLOBAL long_query_time = 1;
```

```

```

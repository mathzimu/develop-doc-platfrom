# MongoDB 教程

MongoDB 是一种 NoSQL 文档数据库，将数据存储为 JSON 风格的 BSON 文档。它采用灵活的文档模型，不需要预定义表结构。

## 目录

- [MongoDB 基础语法](/tutorials/mongodb/01-basics) — 核心概念、数据类型、安装、CRUD、索引、聚合管道、Mongoose、备份恢复
- [MongoDB 进阶深入](/tutorials/mongodb/02-advanced) — Change Streams、事务、Atlas Search、Realm、时序集合、加密、数据降级
- [实战项目：图书管理系统](/tutorials/mongodb/03-project) — Node.js + Mongoose + Express 完整项目
- [MongoDB 工程实践](/tutorials/mongodb/04-engineering) — 数据建模、分片、副本集、聚合优化、监控、CI/CD
- [MongoDB 生态全景](/tutorials/mongodb/05-ecosystem) — ODM、GUI 工具、云服务、CLI 工具

::: tip
本教程假设你已有基础的 JavaScript / Node.js 知识。所有代码均可直接复制运行。
:::

## 环境要求

- MongoDB 7.0+（本地部署或 [Atlas](https://www.mongodb.com/docs/atlas/) 免费集群）
- `mongosh` 命令行工具
- Node.js 18+（实战项目使用 Mongoose）

## 前置知识

- 熟悉 [JavaScript](/tutorials/javascript/) 与 [Node.js](/tutorials/nodejs/) 基础
- 了解 JSON 数据结构
- 了解关系型数据库概念有助于对比理解（见 [SQL 教程](/tutorials/sql/)）

## 官方文档

聚合操作符、索引类型、分片策略与版本差异以官方文档为准。

| 类型 | 链接 |
|------|------|
| 官方文档 | [MongoDB Manual](https://www.mongodb.com/docs/manual/) · [中文文档](https://www.mongodb.com/zh-cn/docs/manual/) |
| CRUD 操作 | [CRUD 指南](https://www.mongodb.com/docs/manual/crud/) · [查询操作符](https://www.mongodb.com/docs/manual/reference/operator/query/) |
| 聚合 | [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) · [聚合阶段参考](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/) |
| 索引 | [Indexes](https://www.mongodb.com/docs/manual/indexes/) · [索引策略](https://www.mongodb.com/docs/manual/applications/indexes/) |
| 数据建模 | [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/) · [设计模式](https://www.mongodb.com/blog/post/building-with-patterns-a-summary) |
| 事务 | [Transactions](https://www.mongodb.com/docs/manual/core/transactions/) |
| 复制与分片 | [Replication](https://www.mongodb.com/docs/manual/replication/) · [Sharding](https://www.mongodb.com/docs/manual/sharding/) |
| Change Streams | [Change Streams](https://www.mongodb.com/docs/manual/changeStreams/) |
| 时序集合 | [Time Series](https://www.mongodb.com/docs/manual/core/timeseries-collections/) |
| 全文检索 | [Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search/) · [Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/) |
| 驱动与 ODM | [Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/) · [Mongoose](https://mongoosejs.com/docs/guide.html) · [PyMongo](https://pymongo.readthedocs.io/en/stable/) |
| 命令行与工具 | [mongosh](https://www.mongodb.com/docs/mongodb-shell/) · [Database Tools](https://www.mongodb.com/docs/database-tools/) · [Compass](https://www.mongodb.com/docs/compass/current/) |
| 安全 | [Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/) |
| BSON 规范 | [bsonspec.org](https://bsonspec.org/spec.html) |

更多入口见 [官方文档索引](/reference/official-docs)。

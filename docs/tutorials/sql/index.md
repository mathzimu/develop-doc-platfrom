# SQL 教程

本教程涵盖 SQL 基础语法、进阶技巧、实战项目与工程实践。

## 目录

| 章节 | 内容 |
|------|------|
| [01 - SQL 基础语法](/tutorials/sql/01-basics) | SELECT、WHERE、JOIN、子查询、DML、DDL、索引、事务、视图、函数 |
| [02 - SQL 进阶深入](/tutorials/sql/02-advanced) | 查询性能分析、索引策略、分区表、主从复制、窗口函数、CTE |
| [03 - 实战项目：电商数据库设计](/tutorials/sql/03-project) | 从需求分析到建表、索引、查询优化的完整电商数据库设计 |
| [04 - SQL 工程实践](/tutorials/sql/04-engineering) | 迁移策略、SQL Lint、CI/CD 工作流、备份自动化、监控 |
| [05 - SQL 生态全景](/tutorials/sql/05-ecosystem) | 数据库选型、ORM 生态、迁移工具、连接池、监控工具 |

## 学习路径

1. **基础** → 掌握 SELECT、JOIN、DML、DDL 等核心语法
2. **进阶** → 深入性能分析、索引优化、窗口函数
3. **实战** → 完成电商数据库完整设计
4. **工程** → 学习数据库变更管理与 CI/CD
5. **生态** → 了解数据库选型与工具链

## 环境要求

- PostgreSQL 15+（示例主要使用 PostgreSQL 方言）
- 客户端：`psql`、DBeaver 或 pgAdmin
- 也可使用在线 SQL 环境练习

## 前置知识

- 无需编程经验
- 了解表格、行、列等基本数据概念即可

## 官方文档与延伸阅读

- **PostgreSQL**：[官方文档](https://www.postgresql.org/docs/current/) · [中文社区文档](http://www.postgres.cn/docs/current/)
- **MySQL**：[Reference Manual 8.4](https://dev.mysql.com/doc/refman/8.4/en/)
- **SQLite**：[官方文档](https://sqlite.org/docs.html) · [SQL 语法](https://sqlite.org/lang.html)
- **SQL Server**：[T-SQL 参考](https://learn.microsoft.com/zh-cn/sql/t-sql/language-reference)
- **Oracle**：[Database SQL 参考](https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/index.html)
- **MariaDB**：[Knowledge Base](https://mariadb.com/kb/en/documentation/)
- **ClickHouse**：[官方文档](https://clickhouse.com/docs)
- **SQL 标准**：[ISO/IEC 9075](https://www.iso.org/standard/76583.html)
- **索引与执行计划**：[PG 索引](https://www.postgresql.org/docs/current/indexes.html) · [PG EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) · [MySQL 优化](https://dev.mysql.com/doc/refman/8.4/en/optimization.html)
- **事务与隔离级别**：[PG 事务隔离](https://www.postgresql.org/docs/current/transaction-iso.html) · [InnoDB 事务模型](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html)
- **窗口函数与 CTE**：[PG 窗口函数](https://www.postgresql.org/docs/current/tutorial-window.html) · [PG WITH 查询](https://www.postgresql.org/docs/current/queries-with.html)
- **迁移工具**：[Flyway](https://documentation.red-gate.com/flyway) · [Liquibase](https://docs.liquibase.com/) · [Alembic](https://alembic.sqlalchemy.org/en/latest/) · [Atlas](https://atlasgo.io/docs)
- **连接池**：[PgBouncer](https://www.pgbouncer.org/config.html) · [ProxySQL](https://proxysql.com/documentation/)
- **云数据库**：[Neon](https://neon.com/docs) · [Supabase](https://supabase.com/docs)
- **安全**：[OWASP SQL 注入防护](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

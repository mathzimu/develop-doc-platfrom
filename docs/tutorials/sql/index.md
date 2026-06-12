# SQL 教程

SQL（Structured Query Language）是管理关系型数据库的标准语言，用于数据查询、操作、定义和控制。

## 数据库基础

关系型数据库以**表（table）** 的形式组织数据，表由**行（row/record）** 和**列（column/field）** 组成。表之间通过**外键（foreign key）** 建立关联。

```
users                          orders
┌────┬───────┬──────┐         ┌────┬──────────┬─────────┐
│ id │ name  │ email│         │ id │ user_id  │ amount  │
├────┼───────┼──────┤         ├────┼──────────┼─────────┤
│ 1  │ Alice │ a@.. │         │ 1  │ 1        │ 100     │
│ 2  │ Bob   │ b@.. │    ──→  │ 2  │ 1        │ 200     │
│ 3  │ Carol │ c@.. │         │ 3  │ 2        │ 150     │
└────┴───────┴──────┘         └────┴──────────┴─────────┘
```

## 数据查询（SELECT）

### 基本查询

```sql
-- 查询所有列
SELECT * FROM users;

-- 查询特定列
SELECT id, name, email FROM users;

-- 去重
SELECT DISTINCT city FROM users;

-- 别名
SELECT name AS 姓名, email AS 邮箱 FROM users;

-- 字面量列
SELECT name, '活跃用户' AS status FROM users;
```

### 条件筛选（WHERE）

```sql
-- 比较运算符
SELECT * FROM users WHERE age >= 18;
SELECT * FROM products WHERE price BETWEEN 10 AND 100;

-- 字符串匹配
SELECT * FROM users WHERE name LIKE '张%';    -- 以"张"开头
SELECT * FROM users WHERE name LIKE '%明%';   -- 包含"明"
SELECT * FROM users WHERE name LIKE '_三';    -- 第二个字是"三"

-- IN 列表
SELECT * FROM users WHERE city IN ('北京', '上海', '广州');

-- NULL 判断
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;

-- 逻辑组合
SELECT * FROM users
WHERE age > 18
  AND city = '北京'
  AND (status = 'vip' OR points > 1000);
```

### 排序与分页

```sql
-- 排序
SELECT * FROM products
ORDER BY price DESC, name ASC;

-- 限制结果
SELECT * FROM users LIMIT 10;           -- 前 10 条
SELECT * FROM users LIMIT 10 OFFSET 20; -- 第 21-30 条
SELECT * FROM users LIMIT 20, 10;       -- MySQL 简写（偏移, 数量）
```

### 聚合查询

```sql
-- 聚合函数
SELECT
  COUNT(*) AS total_users,
  COUNT(email) AS has_email,      -- 忽略 NULL
  AVG(age) AS avg_age,
  MAX(score) AS max_score,
  MIN(score) AS min_score,
  SUM(balance) AS total_balance
FROM users;

-- 分组聚合
SELECT
  city,
  COUNT(*) AS user_count,
  AVG(age) AS avg_age
FROM users
GROUP BY city;

-- 过滤分组（HAVING，在 GROUP BY 之后）
SELECT
  city,
  COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING user_count >= 10
ORDER BY user_count DESC;
```

### WHERE vs HAVING 执行顺序

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

## 表连接（JOIN）

### 内连接（INNER JOIN）

```sql
SELECT users.name, orders.amount, orders.created_at
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

### 左连接（LEFT JOIN）

```sql
-- 返回所有用户，即使没有订单
SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

### 右连接（RIGHT JOIN）

```sql
SELECT users.name, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

### 自连接

```sql
-- 同一张表连接自身（员工-经理关系）
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### 多表连接

```sql
SELECT u.name, o.amount, p.name AS product
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

## 子查询

```sql
-- WHERE 中的子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 100);

-- EXISTS
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- FROM 中的子查询（派生表）
SELECT city, avg_age
FROM (
  SELECT city, AVG(age) AS avg_age
  FROM users
  GROUP BY city
) AS stats
WHERE avg_age > 30;

-- SELECT 中的子查询（标量子查询）
SELECT
  name,
  (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;
```

## 数据操作（DML）

### INSERT

```sql
-- 插入单行
INSERT INTO users (name, email, age)
VALUES ('张三', 'zhang@example.com', 25);

-- 插入多行
INSERT INTO users (name, email, age) VALUES
  ('李四', 'li@example.com', 30),
  ('王五', 'wang@example.com', 28);

-- 插入查询结果
INSERT INTO vip_users (name, email)
SELECT name, email FROM users WHERE points > 1000;
```

### UPDATE

```sql
UPDATE users
SET email = 'new@example.com', updated_at = NOW()
WHERE id = 1;

-- 多表更新（MySQL）
UPDATE users u
JOIN orders o ON u.id = o.user_id
SET u.level = 'vip'
WHERE o.amount > 1000;
```

### DELETE

```sql
DELETE FROM users WHERE id = 1;

-- 删除所有行（保留表结构）
DELETE FROM users;
TRUNCATE TABLE users;  -- 更快，不能回滚
```

## 表定义（DDL）

### CREATE TABLE

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT DEFAULT 0,
  city VARCHAR(50),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_city_age (city, age)
);
```

### 约束

| 约束 | 说明 |
|------|------|
| `PRIMARY KEY` | 主键，唯一标识行 |
| `FOREIGN KEY` | 外键，引用其他表 |
| `UNIQUE` | 唯一约束 |
| `NOT NULL` | 非空 |
| `DEFAULT` | 默认值 |
| `CHECK` | 检查约束（MySQL 8.0.16+） |

### ALTER TABLE

```sql
-- 添加列
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;

-- 修改列
ALTER TABLE users MODIFY COLUMN age INT NOT NULL;

-- 重命名列
ALTER TABLE users CHANGE COLUMN phone mobile VARCHAR(20);

-- 删除列
ALTER TABLE users DROP COLUMN phone;

-- 添加索引
ALTER TABLE users ADD INDEX idx_name (name);

-- 添加外键
ALTER TABLE orders ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id);
```

### DROP TABLE

```sql
DROP TABLE IF EXISTS temp_data;
```

## 索引

```sql
-- 创建索引
CREATE INDEX idx_name ON users (name);
CREATE UNIQUE INDEX idx_email ON users (email);
CREATE INDEX idx_city_age ON users (city, age);  -- 复合索引

-- 删除索引
DROP INDEX idx_name ON users;

-- 查看索引
SHOW INDEX FROM users;
```

**索引使用原则**：
- 查询频繁的列建索引
- 区分度高的列效果好（如 email，而非 gender）
- 复合索引遵循"最左前缀"原则
- 避免在索引列上使用函数
- 小表不需要索引（全表扫描更快）

## 事务

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;     -- 提交
-- ROLLBACK;  -- 回滚
```

### ACID 特性

| 特性 | 说明 |
|------|------|
| **原子性** | 事务要么全部成功，要么全部失败 |
| **一致性** | 事务前后数据完整性约束保持一致 |
| **隔离性** | 并发事务互不干扰 |
| **持久性** | 提交后数据永久保存 |

### 隔离级别

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;     -- PostgreSQL 默认
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;    -- MySQL 默认
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

| 级别 | 脏读 | 不可重复读 | 幻读 |
|------|------|-----------|------|
| READ UNCOMMITTED | 可能 | 可能 | 可能 |
| READ COMMITTED | 安全 | 可能 | 可能 |
| REPEATABLE READ | 安全 | 安全 | 可能 |
| SERIALIZABLE | 安全 | 安全 | 安全 |

## 视图

```sql
CREATE VIEW active_users AS
SELECT id, name, email, created_at
FROM users
WHERE status = 'active' AND deleted_at IS NULL;

-- 使用视图（如同普通表）
SELECT * FROM active_users WHERE created_at > '2024-01-01';

-- 删除视图
DROP VIEW IF EXISTS active_users;
```

## 常用函数

### 字符串函数

```sql
SELECT
  CONCAT(first_name, ' ', last_name) AS full_name,
  UPPER(name),
  LOWER(email),
  LENGTH(name),
  SUBSTRING(description, 1, 100),
  TRIM('  hello  '),
  REPLACE(phone, '-', ''),
  LEFT(code, 3),
  RIGHT(code, 2);
```

### 日期函数

```sql
SELECT
  NOW(),
  CURDATE(),
  DATE_FORMAT(created_at, '%Y-%m-%d'),
  YEAR(created_at),
  MONTH(created_at),
  DATE_ADD(created_at, INTERVAL 7 DAY),
  DATEDIFF(NOW(), created_at);
```

### 数值函数

```sql
SELECT
  ROUND(price, 2),
  CEIL(3.14),     -- 4
  FLOOR(3.14),    -- 3
  ABS(-5),
  MOD(10, 3),     -- 1
  POWER(2, 10),   -- 1024
  RAND();         -- 0~1 随机数
```

## 性能优化建议

1. **为查询频繁的列建立索引**
2. **使用 EXPLAIN 分析查询计划**
   ```sql
   EXPLAIN SELECT * FROM users WHERE email = 'test@test.com';
   ```
3. **避免 SELECT \***：只查询需要的列
4. **合理使用 JOIN**：避免多张大表全连接
5. **LIMIT 分页**：大数据量使用游标分页替代 OFFSET
6. **批处理**：大量插入/更新时分批执行
7. **使用连接池**：减少连接创建开销
8. **归档旧数据**：分区表或单独表存储

---

# 企业级实践

## 查询性能分析

```sql
-- 使用 EXPLAIN ANALYZE 分析查询计划
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 20;

-- 输出解读关键指标
-- Seq Scan on users  —— 全表扫描（需要优化）
-- Index Scan         —— 索引扫描（优）
-- Hash Join          —— 哈希连接（优）
-- Sort (using filesort) —— 文件排序（可优化）
-- Rows Removed by Filter —— 过滤行数
-- Actual Time        —— 实际执行时间
```

### 常见慢查询模式

```sql
-- 1. 索引失效
-- ❌ 在索引列上使用函数
WHERE YEAR(created_at) = 2024
-- ✅ 使用范围查询
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'

-- ❌ 隐式类型转换
WHERE phone = 13800000000   -- phone 是 VARCHAR
-- ✅ 类型一致
WHERE phone = '13800000000'

-- ❌ LIKE 前导通配符
WHERE name LIKE '%keyword%'
-- ✅ 使用全文索引
WHERE MATCH(name) AGAINST('keyword')

-- 2. N+1 查询问题
-- ❌ ORM 循环查询（每个用户查一次订单）
for user in users:
    orders = db.query(Order).filter(Order.user_id == user.id).all()

-- ✅ 批量查询
user_ids = [u.id for u in users]
orders = db.query(Order).filter(Order.user_id.in_(user_ids)).all()

-- 3. SELECT * 不必要字段
-- ❌ 查询所有列
SELECT * FROM users
-- ✅ 只查需要的列
SELECT id, name, email FROM users
```

## 索引策略

### 复合索引的最左前缀原则

```sql
-- 复合索引 (city, status, created_at)
CREATE INDEX idx_city_status_created ON users (city, status, created_at);

-- 以下查询可用到此索引：
WHERE city = 'Beijing'                              -- ✓ 最左列
WHERE city = 'Beijing' AND status = 'active'         -- ✓ 前两列
WHERE city = 'Beijing' AND status = 'active' AND created_at > '2024-01-01'  -- ✓ 全部
WHERE status = 'active'                              -- ✗ 跳过了 city
WHERE city = 'Beijing' AND created_at > '2024-01-01'  -- 仅用到 city 列
```

### 覆盖索引

```sql
-- 索引包含查询所需的所有列，无需回表查询
CREATE INDEX idx_user_list ON users (status, created_at) INCLUDE (name, email);

-- 查询可以仅使用索引（Index Only Scan）
SELECT name, email FROM users WHERE status = 'active' AND created_at > '2024-01-01';
```

### 索引维护

```sql
-- 查看索引使用率（PostgreSQL）
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,        -- 索引扫描次数
    idx_tup_read,    -- 索引读取行数
    idx_tup_fetch    -- 回表行数
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- 重建索引
REINDEX INDEX idx_name;
REINDEX TABLE users;

-- 删除未使用的索引（可根据 idx_scan 判断）
DROP INDEX IF EXISTS unused_index;
```

## 分区表

```sql
-- PostgreSQL 范围分区
CREATE TABLE orders (
    id BIGSERIAL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- 查询自动路由到对应分区
EXPLAIN SELECT * FROM orders WHERE created_at BETWEEN '2024-02-01' AND '2024-02-28';
-- 仅扫描 orders_2024_q1 分区

-- 分区裁剪后查询效率大幅提升
```

```sql
-- MySQL LIST 分区
CREATE TABLE logs (
    id INT,
    level VARCHAR(10),
    message TEXT,
    created_at DATETIME
) PARTITION BY LIST (level) (
    PARTITION p_error VALUES IN ('ERROR', 'CRITICAL'),
    PARTITION p_warn VALUES IN ('WARNING'),
    PARTITION p_info VALUES IN ('INFO', 'DEBUG')
);
```

## 主从复制与读写分离

```sql
-- 从库配置
-- postgresql.conf（从库）
hot_standby = on
primary_conninfo = 'host=primary-db port=5432 user=replicator password=xxx'

-- 创建复制用户
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'xxx';
GRANT CONNECT ON DATABASE mydb TO replicator;

-- 应用层读写分离
-- 使用 Proxy 方案：ProxySQL / MaxScale / PgBouncer
```

## 连接池管理

```python
# Python SQLAlchemy 连接池配置
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://user:pass@host/db",
    pool_size=20,                  # 连接池大小
    max_overflow=10,               # 超出池大小最多再创建 10 个
    pool_pre_ping=True,            # 使用前检查连接是否有效
    pool_recycle=3600,             # 1小时回收连接
    pool_use_lifo=True,            # LIFO 减少连接波动
)
```

```yaml
# PgBouncer 配置
[databases]
mydb = host=primary-db port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
pool_mode = transaction          # 事务级复用
default_pool_size = 50
max_client_conn = 200
```

## 数据库迁移

### Alembic（Python）

```python
# alembic/env.py - 自动生成迁移
from alembic import context
from my_project.models import Base

target_metadata = Base.metadata
```

```sh
# 工作流
alembic init alembic
alembic revision --autogenerate -m "add user table"
alembic upgrade head

# 查看历史
alembic history
alembic current

# 回滚
alembic downgrade -1      # 回退一步
alembic downgrade abc123   # 回退到指定版本
```

### Flyway（Java）

```sql
-- V1__create_users.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- V2__add_status_column.sql
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
```

```sh
flyway migrate
flyway info
flyway repair
```

## 数据备份与恢复

```sh
# PostgreSQL
pg_dump -h localhost -U user -d mydb -F c -f backup.dump
pg_restore -h localhost -U user -d mydb backup.dump

# MySQL
mysqldump -h localhost -u user -p mydb > backup.sql
mysql -h localhost -u user -p mydb < backup.sql

# 自动化备份脚本
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f "$BACKUP_DIR/db.dump"
aws s3 cp "$BACKUP_DIR/db.dump" "s3://my-backups/db/$(date +%Y%m%d%H)/"
```

## 数据完整性约束

```sql
-- 外键约束
ALTER TABLE orders ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 唯一约束
ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);

-- 检查约束
ALTER TABLE products ADD CONSTRAINT ck_price
    CHECK (price >= 0);

ALTER TABLE employees ADD CONSTRAINT ck_salary
    CHECK (salary >= 0 AND salary <= 1000000);

-- 排他约束（PostgreSQL）
CREATE EXTENSION btree_gist;
ALTER TABLE room_bookings ADD CONSTRAINT no_overlap
    EXCLUDE USING gist (room_id WITH =, during WITH &&);
```

## 窗口函数

```sql
-- 不压缩行数的情况下进行计算
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept,
    RANK() OVER (ORDER BY salary DESC) as overall_rank,
    SUM(salary) OVER (PARTITION BY department) as dept_total,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg,
    LAG(salary) OVER (ORDER BY salary) as prev_salary,
    LEAD(salary) OVER (ORDER BY salary) as next_salary,
    FIRST_VALUE(salary) OVER (PARTITION BY department ORDER BY salary DESC) as dept_highest
FROM employees;

-- 移动平均（7 天滑动窗口）
SELECT
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7d,
    SUM(revenue) OVER (
        ORDER BY date
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM daily_revenue;
```

## CTE（通用表表达式）

```sql
-- 递归 CTE：组织树查询
WITH RECURSIVE org_tree AS (
    -- 基础：根节点
    SELECT id, name, parent_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 递归：子节点
    SELECT e.id, e.name, e.manager_id, ot.level + 1
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT * FROM org_tree ORDER BY level, name;

-- 多级聚合（CTE + 窗口函数）
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        product_id,
        SUM(amount) as total
    FROM orders
    GROUP BY month, product_id
),
ranked AS (
    SELECT
        month,
        product_id,
        total,
        RANK() OVER (PARTITION BY month ORDER BY total DESC) as product_rank
    FROM monthly_sales
)
SELECT * FROM ranked WHERE product_rank <= 3
ORDER BY month, product_rank;
```

---

## 生态全景

### 数据库选型

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

### ORM 生态

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

### 迁移工具

| 语言 | 工具 |
|------|------|
| Python | **Alembic**（SQLAlchemy）、Django Migrations |
| TypeScript | **Prisma Migrate**、Drizzle Kit、TypeORM Migrations |
| Java | **Flyway**、Liquibase |
| Go | **golang-migrate**、Goose |
| Ruby | ActiveRecord Migrations |

### 连接池与代理

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

### 监控与分析

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


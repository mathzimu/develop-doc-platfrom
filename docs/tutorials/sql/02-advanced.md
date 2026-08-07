# SQL 进阶深入

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

## 官方文档

索引策略、执行计划、事务隔离、窗口函数等以数据库厂商文档为准。

| 主题 | 链接 |
|------|------|
| 执行计划 | [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) · [MySQL EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html) |
| 索引策略 | [PG 索引](https://www.postgresql.org/docs/current/indexes.html) · [MySQL 优化](https://dev.mysql.com/doc/refman/8.4/en/optimization.html) · [PgXact（索引）](https://www.postgresql.org/docs/current/indexes-types.html) |
| 事务与隔离 | [PG 事务隔离](https://www.postgresql.org/docs/current/transaction-iso.html) · [InnoDB 事务模型](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html) |
| 窗口函数与 CTE | [PG 窗口函数](https://www.postgresql.org/docs/current/tutorial-window.html) · [PG WITH](https://www.postgresql.org/docs/current/queries-with.html) |
| 主从与复制 | [PG 复制](https://www.postgresql.org/docs/current/high-availability.html) · [MySQL 复制](https://dev.mysql.com/doc/refman/8.4/en/replication.html) |

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

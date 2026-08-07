# 实战项目：电商数据库设计

## 需求分析

设计一个电商平台的数据库，需支持以下功能：

- **用户系统**：注册、登录、个人信息管理
- **商品管理**：多级分类、商品信息、库存管理
- **订单系统**：下单、订单状态流转、订单明细
- **评价系统**：用户对商品的评价与评分
- **搜索与筛选**：按分类、价格、销量排序

### 实体关系

```
users ──1:N──> orders ──1:N──> order_items ──N:1──> products
                                              ──N:1──> categories
users ──1:N──> reviews ──N:1──> products
```

## ER 图（文本表示）

```
┌─────────────────────┐
│        users        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password_hash       │
│ phone               │
│ address             │
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │ 1
         │
         │ N
┌────────▼────────────┐     ┌─────────────────────┐
│       orders        │     │     order_items     │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ user_id (FK)        │────>│ order_id (FK)       │
│ total_amount        │     │ product_id (FK)     │
│ status              │     │ quantity            │
│ shipping_address    │     │ unit_price          │
│ paid_at             │     │ subtotal            │
│ created_at          │     └─────────────────────┘
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│     products        │     │    categories       │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ category_id (FK)    │────>│ name                │
│ name                │     │ slug (UNIQUE)       │
│ description         │     │ parent_id (FK)      │
│ price               │     │ sort_order          │
│ stock               │     └─────────────────────┘
│ image_url           │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│      reviews        │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ product_id (FK)     │
│ rating (1-5)        │
│ content             │
│ created_at          │
└─────────────────────┘
```

## 建表 SQL

```sql
-- 分类表（支持多级）
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id BIGINT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id),
    INDEX idx_slug (slug)
);

-- 用户表
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name)
);

-- 商品表
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(500),
    status ENUM('on', 'off') DEFAULT 'on',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    FULLTEXT INDEX idx_search (name, description)
);

-- 订单表
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- 订单明细表
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- 评价表
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY uq_user_product (user_id, product_id),
    INDEX idx_product_rating (product_id, rating)
);
```

## 索引设计

| 表 | 索引 | 类型 | 说明 |
|----|------|------|------|
| `products` | `(category_id, status, price)` | 复合 | 分类页筛选排序 |
| `products` | `FULLTEXT(name, description)` | 全文 | 商品搜索 |
| `orders` | `(user_id, created_at)` | 复合 | 用户订单列表 |
| `orders` | `(status, created_at)` | 复合 | 后台订单管理 |
| `order_items` | `(product_id, order_id)` | 复合 | 商品销量统计 |
| `reviews` | `(product_id, rating)` | 复合 | 评价列表排序 |

```sql
-- 推荐索引
CREATE INDEX idx_product_list ON products (category_id, status, price);
CREATE INDEX idx_user_orders ON orders (user_id, created_at);
CREATE INDEX idx_order_manage ON orders (status, created_at);
CREATE INDEX idx_product_sales ON order_items (product_id, order_id);
```

## 查询案例

### 热销商品

```sql
-- 按销量排序 TOP 10
SELECT
    p.id,
    p.name,
    p.price,
    SUM(oi.quantity) AS sold_quantity,
    AVG(r.rating) AS avg_rating
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.status = 'on'
GROUP BY p.id, p.name, p.price
ORDER BY sold_quantity DESC
LIMIT 10;
```

### 用户订单列表

```sql
-- 用户所有订单 + 商品明细
SELECT
    o.id AS order_id,
    o.total_amount,
    o.status,
    o.created_at,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'product', p.name,
            'quantity', oi.quantity,
            'price', oi.unit_price
        )
    ) AS items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 42
GROUP BY o.id, o.total_amount, o.status, o.created_at
ORDER BY o.created_at DESC;
```

### 库存分析

```sql
-- 库存低于安全值（10）的商品
SELECT
    c.name AS category,
    p.name AS product,
    p.stock,
    p.status
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.stock < 10
ORDER BY p.stock ASC;

-- 各分类库存总值
SELECT
    c.name AS category,
    COUNT(p.id) AS product_count,
    SUM(p.stock * p.price) AS inventory_value
FROM products p
JOIN categories c ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY inventory_value DESC;
```

### 月度销售统计

```sql
SELECT
    DATE_FORMAT(o.created_at, '%Y-%m') AS month,
    COUNT(DISTINCT o.id) AS order_count,
    COUNT(DISTINCT o.user_id) AS buyer_count,
    SUM(oi.quantity) AS item_count,
    SUM(o.total_amount) AS revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status IN ('paid', 'shipped', 'delivered')
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY month DESC;
```

## 性能优化

### 分页优化

```sql
-- ❌ 传统 OFFSET 分页（数据量大时越来越慢）
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000;

-- ✅ 游标分页（基于索引）
SELECT * FROM orders
WHERE id > 100000
ORDER BY id
LIMIT 20;
```

### 热门商品缓存标记

```sql
-- 用单独表缓存热销排行，定时刷新
CREATE TABLE hot_products (
    product_id BIGINT PRIMARY KEY,
    sold_quantity INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 表分区建议

```sql
-- 订单表按月分区
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2),
    status VARCHAR(20),
    created_at TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p2024_q1 VALUES LESS THAN (TO_DAYS('2024-04-01')),
    PARTITION p2024_q2 VALUES LESS THAN (TO_DAYS('2024-07-01')),
    PARTITION p2024_q3 VALUES LESS THAN (TO_DAYS('2024-10-01')),
    PARTITION p2024_q4 VALUES LESS THAN (TO_DAYS('2025-01-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

## 官方文档

| 主题 | 链接 |
|------|------|
| DDL/索引 | [PostgreSQL 官方文档](https://www.postgresql.org/docs/current/) · [MySQL 手册](https://dev.mysql.com/doc/refman/8.4/en/) |
| 索引优化 | [PG 索引](https://www.postgresql.org/docs/current/indexes.html) · [MySQL 优化](https://dev.mysql.com/doc/refman/8.4/en/optimization.html) |
| 分区表 | [PG 表分区](https://www.postgresql.org/docs/current/ddl-partitioning.html) · [MySQL 分区](https://dev.mysql.com/doc/refman/8.4/en/partitioning.html) |
| 事务 | [PG 事务隔离](https://www.postgresql.org/docs/current/transaction-iso.html) · [InnoDB 事务](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html) |

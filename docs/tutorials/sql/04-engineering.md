# SQL 工程实践

## 迁移策略

### 原则

1. **增量变更**：每次迁移只做一个小变更，便于回滚和 review
2. **向前兼容**：新旧代码都能运行，支持灰度发布
3. **可回滚**：每个迁移必须提供回滚脚本
4. **版本控制**：迁移脚本纳入 Git，与代码一起发布

### 迁移命名规范

```
V{版本号}__{描述}.sql

V1__create_users.sql
V2__add_status_to_users.sql
V3__create_orders_index.sql
V4__add_phone_to_users.sql
```

### 安全变更模式

```sql
-- 安全添加列（先允许 NULL，再填充数据，最后加 NOT NULL）
-- Step 1: 添加可空列
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;

-- Step 2: 应用层逐步填充数据（可在代码中完成）

-- Step 3: 补充历史数据
UPDATE users SET phone = '' WHERE phone IS NULL;

-- Step 4: 添加 NOT NULL 约束
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) NOT NULL DEFAULT '';

-- 安全重命名列（先加新列，迁移数据，再删旧列）
ALTER TABLE users ADD COLUMN mobile VARCHAR(20);
UPDATE users SET mobile = phone WHERE phone IS NOT NULL;
-- 确认无误后
ALTER TABLE users DROP COLUMN phone;
```

### 大表变更策略

```sql
-- 使用 pt-online-schema-change（Percona Toolkit）
pt-online-schema-change --alter "ADD COLUMN phone VARCHAR(20)" D=mydb,t=users

-- 或使用 gh-ost（GitHub）
gh-ost --alter "ADD COLUMN phone VARCHAR(20)" --database=mydb --table=users --execute
```

## SQL Lint

### 使用 SQLFluff（Python）

```sh
# 安装
pip install sqlfluff

# Lint 文件
sqlfluff lint models/queries.sql

# 自动修复
sqlfluff fix models/queries.sql

# 配置 .sqlfluff
cat > .sqlfluff <<EOF
[sqlfluff]
dialect = mysql
templater = raw
max_line_length = 120

[sqlfluff:rules:L010]  # 关键字大写
capitalisation_policy = upper

[sqlfluff:rules:L014]  # 未引用的标识符小写
extended_capitalisation_policy = lower
EOF
```

### SQL 风格规范

```sql
-- ✅ 良好风格
SELECT
    u.id,
    u.name,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;

-- ❌ 不良风格
select u.id,u.name,count(o.id) order_count
from users u left join orders o on u.id=o.user_id
where u.created_at>='2024-01-01'
group by 1,2 having count(o.id)>5 order by 3 desc;
```

## CI/CD for Database

### Schema Change Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Developer  │    │   PR Review  │    │    CI Checks  │    │  Deploy    │
│ 写迁移脚本  │───>│ 代码评审    │───>│ Lint + 预演  │───>│ 执行迁移  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### GitHub Actions 示例

```yaml
# .github/workflows/db-migrate.yml
name: Database Migration

on:
  push:
    branches: [main]
    paths:
      - 'migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: mydb
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v4

      - name: Run Flyway Migrations
        run: |
          flyway \
            -url=jdbc:mysql://localhost:3306/mydb \
            -user=root \
            -password=test \
            -locations=filesystem:migrations \
            migrate

      - name: Run Schema Diff Check
        run: |
          mysqldump --no-data -h localhost -u root -ptest mydb > schema_current.sql
          diff schema_current.sql schema_expected.sql || echo "Schema mismatch detected"
```

### 迁移风险控制

```sql
-- 使用 WITH (ONLINE) 避免锁表（SQL Server）
ALTER TABLE users ADD phone VARCHAR(20) WITH (ONLINE = ON);

-- 分批次更新大表
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    UPDATE users
    SET phone = COALESCE(phone, '')
    WHERE id BETWEEN (i-1)*10000 + 1 AND i*10000;
    COMMIT;
  END LOOP;
END $$;
```

## 备份自动化

### 定时备份脚本

```bash
#!/bin/bash
# backup.sh —— 全量备份 + 上传 S3

DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-password}"
DB_NAME="${DB_NAME:-mydb}"
BACKUP_DIR="/backup/$(date +%Y%m%d)"
S3_BUCKET="s3://my-db-backups"

mkdir -p "$BACKUP_DIR"

# 执行备份
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
  --single-transaction --routines --triggers --events \
  "$DB_NAME" | gzip > "$BACKUP_DIR/${DB_NAME}.sql.gz"

# 上传到 S3
aws s3 cp "$BACKUP_DIR/${DB_NAME}.sql.gz" \
  "${S3_BUCKET}/$(date +%Y/%m/%d)/${DB_NAME}_$(date +%H%M).sql.gz"

# 保留最近 7 天本地备份
find /backup -type d -mtime +7 -exec rm -rf {} \;
```

### Crontab 配置

```cron
# 每天凌晨 3 点全量备份
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# 每周日完整备份 + 周中增量
0 3 * * 0 /usr/local/bin/backup_full.sh
0 3 * * 1-6 /usr/local/bin/backup_incremental.sh
```

## 查询监控

### MySQL 慢查询

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 查看正在运行的查询
SHOW FULL PROCESSLIST;

-- 分析慢查询日志
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

### PostgreSQL 查询监控

```sql
-- 查看当前活跃查询
SELECT pid, now() - pg_stat_activity.query_start AS duration,
       query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- 查看等待事件
SELECT pid, wait_event_type, wait_event, query
FROM pg_stat_activity
WHERE wait_event IS NOT NULL;

-- 索引使用情况
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC
LIMIT 10;
```

### 告警阈值

| 指标 | 警告 | 严重 |
|------|------|------|
| 查询延迟 P99 | > 200ms | > 1s |
| 连接数使用率 | > 70% | > 90% |
| 慢查询/分钟 | > 5 | > 20 |
| 复制延迟 | > 10s | > 60s |
| 磁盘使用率 | > 80% | > 90% |

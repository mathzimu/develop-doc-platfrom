# 实战项目：全栈应用容器化

容器化 React 前端 + Node.js API + PostgreSQL + Redis + Nginx 完整项目。

## 项目结构

```
project/
├── client/                  # React 前端
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── server/                  # Node.js API
│   ├── Dockerfile
│   └── src/
├── docker-compose.yml
├── .env.example
└── deploy.sh
```

## 各服务 Dockerfile

### React 前端

```dockerfile
# client/Dockerfile

# 构建阶段
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Nginx 运行阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# client/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://server:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Node.js API

```dockerfile
# server/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package.json .
USER nodejs
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]
```

### PostgreSQL 与 Redis

PostgreSQL 和 Redis 使用官方镜像，无需自定义 Dockerfile。通过环境变量和 healthcheck 配置即可。

## Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  server:
    build:
      context: ./server
    image: myapp/server:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://myapp:${DB_PASSWORD}@postgres:5432/myapp
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    restart: unless-stopped

  client:
    build:
      context: ./client
    image: myapp/client:latest
    ports:
      - "8080:80"
    depends_on:
      server:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pgdata:
  redis_data:
```

## 网络配置

所有服务使用 Docker Compose 默认网络。服务名作为 DNS 主机名自动解析。

```yaml
# 可选：自定义网络
networks:
  backend:
    internal: true   # 数据库不暴露到外部
  frontend:

services:
  postgres:
    networks:
      - backend
  redis:
    networks:
      - backend
  server:
    networks:
      - backend
      - frontend
  client:
    networks:
      - frontend
```

## 数据持久化

- **PostgreSQL**：`pgdata` volume 存储数据库文件
- **Redis**：`redis_data` volume 存储 AOF/RDB 快照
- **上传文件**：可添加 `uploads` volume 挂载到 server

## 环境变量管理

```sh
# .env.example
DB_PASSWORD=change_me
REDIS_PASSWORD=change_me
JWT_SECRET=change_me
```

```yaml
# docker-compose.yml 使用方式
services:
  server:
    env_file:
      - .env
```

## 健康检查

各服务均配置 healthcheck，`depends_on` 使用 `condition: service_healthy` 确保启动顺序正确。

```sh
# 查看健康状态
docker compose ps
docker compose inspect server | jq '.[].State.Health.Status'
```

## 脚本化部署

```sh
# deploy.sh
#!/bin/sh
set -e

echo "=== 部署全栈应用 ==="

if [ ! -f .env ]; then
    echo "创建 .env 文件..."
    cp .env.example .env
fi

echo "拉取最新代码..."
git pull

echo "构建并启动服务..."
docker compose up -d --build

echo "等待服务健康..."
sleep 10
docker compose ps

echo "清理旧镜像..."
docker image prune -f

echo "=== 部署完成 ==="
```

```sh
chmod +x deploy.sh && ./deploy.sh
```

### 常用运维命令

```sh
# 查看实时日志
docker compose logs -f

# 重建单个服务
docker compose up -d --build server

# 扩容
docker compose up -d --scale server=3

# 备份数据库
docker compose exec postgres pg_dump -U myapp myapp > backup.sql

# 还原数据库
docker compose exec -T postgres psql -U myapp myapp < backup.sql

# 全量停止并清理
docker compose down -v
```

## 官方文档与延伸阅读

- **官方文档**：[docs.docker.com](https://docs.docker.com/)
- **Dockerfile 参考**：[Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- **Compose 参考**：[Compose File Reference](https://docs.docker.com/reference/compose-file/)
- **数据管理**：[Volumes](https://docs.docker.com/storage/volumes/) · [Bind mounts](https://docs.docker.com/storage/bind-mounts/)
- **网络**：[Docker 网络](https://docs.docker.com/engine/network/)
- **多阶段构建**：[Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- **构建后端**：[BuildKit / buildx](https://docs.docker.com/build/)
- **CLI 参考**：[Docker CLI](https://docs.docker.com/reference/cli/docker/)
- **容器标准**：[OCI Specifications](https://opencontainers.org/)
- **编排**：[Kubernetes 中文文档](https://kubernetes.io/zh-cn/docs/home/) · [Helm](https://helm.sh/zh/docs/)
- **安全扫描**：[Trivy](https://trivy.dev/latest/docs/) · [Docker Scout](https://docs.docker.com/scout/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

# Docker 基础语法

Docker 是一个容器化平台，将应用及其依赖打包到标准化的容器中，确保在任何环境中一致运行。

## 核心概念

```
┌─────────────────────────┐
│       Container         │  ← 运行中的实例
├─────────────────────────┤
│         Image           │  ← 只读模板
├─────────────────────────┤
│       Dockerfile        │  ← 构建镜像的脚本
├─────────────────────────┤
│     Docker Compose      │  ← 多容器编排
└─────────────────────────┘
```

## 安装

```sh
# macOS
brew install docker
brew install --cask docker  # Docker Desktop

# 验证安装
docker --version
docker compose version

# 测试
docker run hello-world
```

## 镜像管理

```sh
# 搜索镜像
docker search nginx
docker search ubuntu

# 拉取镜像
docker pull nginx:latest
docker pull ubuntu:22.04
docker pull node:20-alpine

# 查看本地镜像
docker images
docker image ls
docker image ls --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# 删除镜像
docker rmi nginx
docker image prune           # 删除未使用的镜像
docker image prune -a        # 删除所有未使用的镜像

# 构建镜像
docker build -t my-app:1.0 .
docker build -t my-app:latest -f Dockerfile.prod .

# 标签与推送
docker tag my-app:1.0 registry.example.com/my-app:1.0
docker push registry.example.com/my-app:1.0
```

## 容器管理

```sh
# 创建并启动容器
docker run nginx                              # 前台运行
docker run -d nginx                           # 后台运行（-d）
docker run -d --name web -p 8080:80 nginx     # 端口映射
docker run -d --name db -e MYSQL_ROOT_PASSWORD=secret mysql
docker run -d --restart=always nginx          # 自动重启

# 查看容器
docker ps                                     # 运行中的
docker ps -a                                  # 全部（含已停止）
docker ps -q                                  # 只显示 ID
docker ps --filter "status=exited"            # 筛选

# 操作容器
docker stop web
docker start web
docker restart web
docker kill web                               # 强制停止
docker rm web                                 # 删除容器
docker rm -f web                              # 强制删除（运行中）
docker rm $(docker ps -aq)                    # 删除所有容器
docker container prune                        # 清理已停止容器

# 进入容器
docker exec -it web bash                      # 交互式进入
docker exec web cat /etc/nginx/nginx.conf     # 执行命令
docker logs web                               # 查看日志
docker logs -f web                            # 实时跟踪日志
docker logs --tail 100 web                    # 最近 100 条
docker top web                                # 查看进程
docker stats                                  # 实时资源监控
docker inspect web                            # 查看详细配置
docker inspect -f '{{.NetworkSettings.IPAddress}}' web  # 提取 IP
```

## Dockerfile

```dockerfile
# 基础镜像
FROM node:20-alpine

# 元数据
LABEL maintainer="team@example.com"
LABEL version="1.0"

# 设置工作目录
WORKDIR /app

# 复制依赖文件（分层缓存优化）
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 运行用户（安全）
USER node

# 启动命令
CMD ["node", "dist/index.js"]
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### .dockerignore

```
node_modules
.git
.env
*.md
dist
.gitignore
```

## Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    depends_on:
      - db
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
  uploads:
```

```sh
# 启动所有服务
docker compose up -d

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f
docker compose logs -f app

# 构建并启动
docker compose up -d --build

# 停止
docker compose down
docker compose down -v         # 删除 volume
docker compose down --rmi all  # 删除镜像
```

## 数据管理

```sh
# Volume（推荐）
docker volume create mydata
docker volume ls
docker volume inspect mydata
docker run -v mydata:/data app

# Bind Mount（开发环境）
docker run -v $(pwd):/app -w /app node npm run dev

# 挂载文件
docker run -v ./config.yml:/app/config.yml app

# 只读挂载
docker run -v $(pwd):/app:ro app

# 数据卷容器
docker run --volumes-from db-backup ubuntu tar cvf /backup/db.tar /data
```

### Volume vs Bind Mount

| 特性 | Volume | Bind Mount |
|------|--------|-----------|
| 管理方式 | Docker 管理 | 用户管理 |
| 存储位置 | `/var/lib/docker/volumes/` | 任意路径 |
| 备份 | 较复杂 | 直接操作文件 |
| 性能 | 原生 | 依赖文件系统 |
| 跨宿主机 | 需插件 | 不支持 |

## 网络

```sh
# 网络模式
docker network ls                           # 查看网络
docker network create mynet                 # 创建网络
docker run --network mynet app              # 指定网络
docker run -p 8080:80 --network host nginx  # 主机网络

# 默认网络类型
bridge    # 默认，容器间可通过 IP 通信
host      # 共享主机网络
none      # 无网络
overlay   # 跨宿主机（Swarm）

# 容器间通信
docker network connect mynet web
docker network disconnect mynet web
```

## 常用技巧

```sh
# 清理资源
docker system prune              # 清理未使用的容器、网络、镜像
docker system prune -a           # 全部清理（含未使用的镜像）
docker system df                 # 查看磁盘使用
docker container prune           # 清理停止的容器
docker image prune               # 清理悬空镜像
docker volume prune              # 清理未使用的卷
docker network prune             # 清理未使用的网络

# 资源限制
docker run -m 512m --cpus 2 nginx
docker run --memory-swap -1 nginx   # 无限制交换
docker run --cpuset-cpus 0,1 nginx  # 绑定 CPU 核心

# 健康检查
docker run --health-cmd="curl -f http://localhost/" --health-interval=30s nginx

# 重命名
docker tag my-app:1.0 registry.example.com/my-app:1.0

# 推送镜像
docker push registry.example.com/my-app:1.0

# 导出/导入
docker save my-app:1.0 > my-app.tar
docker load < my-app.tar

# 复制文件
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
docker cp ./index.html web:/usr/share/nginx/html/
```

## 生产环境最佳实践

1. **使用 Alpine 基础镜像**：体积更小，攻击面更少
2. **多阶段构建**：最终镜像只保留运行所需文件
3. **不要以 root 运行**：使用 `USER` 指令切换
4. **使用 `.dockerignore`**：排除不必要的文件
5. **利用构建缓存**：不常变化的层放在前面（如 `package.json`）
6. **指定精确版本**：避免 `latest` 标签导致不可预期更新
7. **健康检查**：为服务添加 `HEALTHCHECK` 指令
8. **资源限制**：限制内存和 CPU 使用量
9. **日志到 stdout**：Docker 自动收集 stdout/stderr
10. **安全扫描**：使用 `docker scan` 或 Trivy 检查镜像漏洞

### Dockerfile 层缓存优化

```dockerfile
# 错误：源码变化会使 npm install 缓存失效
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
```

```dockerfile
# 正确：package.json 单独复制，利用 Docker 层缓存
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

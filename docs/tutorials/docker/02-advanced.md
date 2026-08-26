# Docker 进阶深入

## 镜像分层原理

Docker 镜像由只读层叠加而成，每一层对应 Dockerfile 中的一条指令。

```
┌──────────────────┐
│  Container Layer  │  ← 可写
├──────────────────┤
│     Layer n       │  ← RUN npm build
├──────────────────┤
│     Layer 3       │  ← RUN npm install
├──────────────────┤
│     Layer 2       │  ← COPY package*.json ./
├──────────────────┤
│     Layer 1       │  ← FROM node:20-alpine
└──────────────────┘
```

### UnionFS 与 overlay2

- **overlay2**（默认）：将多个下层目录联合挂载为单一视图。上下两层同名文件，上层覆盖下层。
- **层缓存**：Docker 对每层计算 checksum，未变更的层直接从缓存复用，加速构建。

```sh
# 查看镜像分层
docker history nginx:latest

# 查看层大小
docker history --no-trunc nginx:latest
```

### 缓存命中规则

| 指令 | 缓存判断依据 |
|------|-------------|
| `FROM` | 基础镜像 ID |
| `RUN` | 命令字符串 |
| `COPY` / `ADD` | 文件 checksum |
| `ENV` | 键值对 |

> `COPY . .` 会使整个目录变更都导致该层及后续层缓存失效。将 `package.json` 单独复制可最大化缓存命中。

## Docker 网络深入

### bridge 网络原理

默认 bridge (`docker0`) 提供容器间通信。Docker 通过 veth pair 将容器网络命名空间连接到 bridge。

```
┌─ Host ─────────────────────────────────┐
│  ┌──────┐   ┌──────┐   ┌──────┐       │
│  │ C1   │   │ C2   │   │ C3   │       │
│  │eth0  │   │eth0  │   │eth0  │       │
│  └──┬───┘   └──┬───┘   └──┬───┘       │
│     │veth      │veth      │veth        │
│     └──────────┼──────────┘            │
│          ┌─────┴─────┐                 │
│          │  docker0  │ ← 172.17.0.0/16 │
│          └─────┬─────┘                 │
│                │                        │
│          eth0  │ 主机网卡               │
└─────────────────────────────────────────┘
```

### 用户定义网络

```sh
# 创建用户定义 bridge 网络
docker network create --driver bridge --subnet 10.10.0.0/16 mynet

# 用户定义网络支持 DNS 自动解析（容器名 → IP）
docker run -d --name app1 --network mynet nginx
docker run -d --name app2 --network mynet nginx
docker exec app1 ping app2  # ✅ 通过名称通信

# 相比默认 bridge 的优势
# 1. DNS 自动解析
# 2. 网络隔离
# 3. 自定义子网
# 4. 动态加入/离开
```

### 网络隔离策略

```sh
# 外部容器不可访问
docker network create --internal internal-net
docker run --network internal-net --name db postgres

# 仅暴露代理
docker network create frontend
docker network create backend
docker run --network backend --name api my-api
docker run --network frontend --name nginx nginx
docker network connect frontend api  # api 同时加入两个网络
```

## 存储驱动对比

| 驱动 | 特点 | 适用 |
|------|------|------|
| **overlay2** | 原生支持、性能好、推荐 | 所有现代 Linux |
| **aufs** | 稳定但未合入主线内核 | 旧系统 |
| **devicemapper** | 基于 LVM，性能较差 | 已废弃 |
| **btrfs/zfs** | 快照能力强 | 特定场景 |

```sh
# 查看当前存储驱动
docker info | grep "Storage Driver"
```

## 多架构镜像

```sh
# 创建 builder 实例（支持多架构）
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap

# 构建多架构镜像并推送
docker buildx build --platform linux/amd64,linux/arm64 \
  -t user/app:latest --push .

# 本地构建指定平台
docker build --platform linux/arm64 -t app:arm64 .

# 查看镜像支持的架构
docker manifest inspect user/app:latest
```

### --platform 参数

```sh
# 在 x86 机器上拉取 arm64 镜像
docker pull --platform linux/arm64 alpine

# 运行指定架构容器
docker run --platform linux/arm64 alpine uname -m
```

## 安全能力

### Capabilities

容器默认以白名单方式获取 Linux capabilities，避免赋予不必要的权限。

```sh
# 默认 capabilities
docker run alpine cat /proc/1/status | grep Cap

# 按需增减
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx
docker run --privileged ubuntu    # 赋予所有能力（不安全）
docker run --security-opt=no-new-privileges:true app
```

### seccomp

```sh
# 使用默认 seccomp 策略（拒绝约 44 个系统调用）
docker run alpine

# 使用自定义策略
docker run --security-opt seccomp=custom.json alpine

# 关闭 seccomp（不推荐）
docker run --security-opt seccomp=unconfined alpine
```

### AppArmor

```sh
# 加载自定义 AppArmor 配置
docker run --security-opt apparmor=my-profile nginx

# 绕过 AppArmor
docker run --security-opt apparmor=unconfined nginx
```

### Rootless 模式

以非 root 用户运行 Docker 守护进程和容器，减少提权风险。

```sh
# 安装 rootless
dockerd-rootless-setuptool.sh install

# 启动 rootless 模式
systemctl --user start docker

# 验证
docker info | grep -i rootless
```

## Docker Init

Docker 内置初始化工具，为常见应用生成默认 Dockerfile 和 compose 配置。

```sh
# 为当前项目初始化 Docker 配置
docker init

# 手动指定平台
docker init --platform node
```

支持的语言：Node.js、Python、Go、Rust、Java、.NET、PHP、Ruby、C/C++。

## BuildKit 高级功能

### 缓存挂载

```sh
# syntax = docker/dockerfile:1.4
FROM node:20-alpine
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
RUN npm run build
```

### 构建密钥

```sh
# Dockerfile
# syntax = docker/dockerfile:1.4
FROM node:20-alpine
WORKDIR /app
RUN --mount=type=secret,id=npmrc \
    cp /run/secrets/npmrc .npmrc && \
    npm ci && rm .npmrc

# 构建时传入
DOCKER_BUILDKIT=1 docker build --secret id=npmrc,src=.npmrc .
```

### SSH 挂载

```sh
# Dockerfile
# syntax = docker/dockerfile:1.4
FROM node:20-alpine
WORKDIR /app
RUN --mount=type=ssh \
    npm install --ssh

# 构建时传入 SSH 密钥
DOCKER_BUILDKIT=1 docker build --ssh default .
```

### 启用 BuildKit

```sh
# 环境变量
export DOCKER_BUILDKIT=1
# 或修改 /etc/docker/daemon.json：{ "features": { "buildkit": true } }
# 或使用 docker buildx（默认使用 BuildKit）
```

## Docker Compose 高级特性

### Profiles

按 profile 选择性启动服务，适合开发/测试/生产不同配置。

```yaml
services:
  app:
    build: .
    profiles: ["base"]

  db:
    image: postgres:15-alpine

  redis:
    image: redis:7-alpine
    profiles: ["cache"]

  prometheus:
    image: prom/prometheus
    profiles: ["monitoring"]

  grafana:
    image: grafana/grafana
    profiles: ["monitoring"]
```

```sh
docker compose --profile cache up -d      # app + db + redis
docker compose --profile monitoring up -d # app + db + prometheus + grafana
docker compose --profile all up -d        # 全部启动
```

### Extends

共享公共服务配置，避免重复。

```yaml
services:
  base:
    image: node:20-alpine
    working_dir: /app
    environment:
      - NODE_ENV=development

  app:
    extends:
      service: base
    ports:
      - "3000:3000"
    command: npm run dev

  worker:
    extends:
      service: base
    command: npm run worker
```

### Healthcheck

```yaml
services:
  db:
    image: postgres:15-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

### depends_on 条件

```yaml
services:
  app:
    build: .
    depends_on:
      db:
        condition: service_healthy      # 等待健康检查通过
      redis:
        condition: service_started      # 等待启动（默认）
      migrator:
        condition: service_completed_successfully  # 等待成功退出
```

### 环境变量与 .env

```yaml
services:
  app:
    env_file:
      - .env.common
      - .env.production
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@db:5432/mydb
```

```sh
# .env 文件（自动加载）
DB_USER=postgres
DB_PASS=secret
NODE_ENV=production
```

## 官方文档与延伸阅读

- **官方文档**：[docs.docker.com](https://docs.docker.com/)
- **镜像与分层**：[About images](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/) · [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- **网络**：[Docker 网络](https://docs.docker.com/engine/network/) · [网络驱动](https://docs.docker.com/engine/network/drivers/)
- **存储驱动与数据卷**：[Storage drivers](https://docs.docker.com/storage/storagedriver/) · [Volumes](https://docs.docker.com/storage/volumes/)
- **多架构构建**：[Multi-platform builds](https://docs.docker.com/build/building/multi-platform/)
- **安全**：[Docker security](https://docs.docker.com/engine/security/) · [Build secrets](https://docs.docker.com/build/building/secrets/) · [Seccomp/AppArmor](https://docs.docker.com/engine/security/apparmor/)
- **构建后端**：[BuildKit / buildx](https://docs.docker.com/build/)
- **Compose 参考**：[Compose File Reference](https://docs.docker.com/reference/compose-file/)
- **CLI 参考**：[Docker CLI](https://docs.docker.com/reference/cli/docker/)
- **容器标准**：[OCI Specifications](https://opencontainers.org/)
- **编排**：[Kubernetes 中文文档](https://kubernetes.io/zh-cn/docs/home/) · [Helm](https://helm.sh/zh/docs/)
- **安全扫描**：[Trivy](https://trivy.dev/latest/docs/) · [Docker Scout](https://docs.docker.com/scout/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

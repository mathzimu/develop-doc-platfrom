# Docker 生态全景

## 容器编排

```
Docker Compose    —— 单机编排（开发/测试）
Docker Swarm     —— Docker 原生集群
Kubernetes (K8s) —— 生产级容器编排（标准）
Nomad            —— HashiCorp 轻量调度器
Amazon ECS      —— AWS 托管容器服务
```

| 工具 | 复杂度 | 适用场景 |
|------|--------|---------|
| Docker Compose | 低 | 本地开发、小团队 |
| Docker Swarm | 中 | 中小规模部署 |
| Kubernetes | 高 | 企业级、大规模集群 |
| Nomad | 中 | 混合工作负载 |

## 镜像仓库

```
Docker Hub        —— 默认公共仓库
GitHub Container Registry —— GitHub 集成
Amazon ECR       —— AWS 集成
Google Artifact Registry  —— GCP 集成
Harbor           —— 企业级私有仓库（推荐）
```

## 安全工具链

```sh
# 镜像扫描
trivy image --severity CRITICAL,HIGH myapp:latest
grype myapp:latest
docker scout quickview myapp:latest

# 运行时安全
Falco         —— 容器异常行为检测
AppArmor     —— Linux 安全模块
Seccomp      —— 系统调用过滤

# 合规检查
docker-bench-security     —— CIS Docker Benchmark
kube-bench               —— CIS Kubernetes Benchmark
kube-hunter              —— K8s 渗透测试
```

## 监控与日志

```yaml
# Prometheus + Grafana 监控栈
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"

  # 日志收集
  loki:
    image: grafana/loki
  promtail:
    image: grafana/promtail
    volumes:
      - /var/log:/var/log
```

## 开发工具

| 工具 | 用途 |
|------|------|
| **Dev Containers** | VS Code 容器开发 |
| **Tilt** | 本地 K8s 开发热更新 |
| **Skaffold** | 持续开发 |
| **Kompose** | Docker Compose → K8s 转换 |
| **Podman** | Docker 替代（无守护进程） |
| **BuildKit** | 高性能镜像构建 |

## CI/CD 集成

```yaml
# GitHub Actions + Docker
name: Build and Push
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 核心文档 | [docs.docker.com](https://docs.docker.com/) · [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/) · [Compose File Reference](https://docs.docker.com/reference/compose-file/) · [Docker CLI](https://docs.docker.com/reference/cli/docker/) |
| 构建 | [BuildKit / buildx](https://docs.docker.com/build/) |
| 编排 | [Kubernetes（中文）](https://kubernetes.io/zh-cn/docs/home/) · [Helm（中文）](https://helm.sh/zh/docs/) · [Docker Swarm](https://docs.docker.com/engine/swarm/) · [Nomad](https://developer.hashicorp.com/nomad/docs) |
| 安全 | [Trivy](https://trivy.dev/latest/docs/) · [Docker Scout](https://docs.docker.com/scout/) · [Falco](https://falco.org/docs/) · [docker-bench-security](https://github.com/docker/docker-bench-security) |
| 规范 | [OCI Specifications](https://opencontainers.org/) |
| 开发工具 | [Dev Containers](https://containers.dev/) · [Tilt](https://docs.tilt.dev/) · [Skaffold](https://skaffold.dev/docs/) · [Podman](https://podman.io/docs/) |

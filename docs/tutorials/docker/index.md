# Docker 教程

容器化平台，将应用及依赖打包到标准化容器中，确保环境一致。

## 内容导航

| 章节 | 内容 |
|------|------|
| [01 — Docker 基础语法](./01-basics) | 核心概念、安装、镜像/容器管理、Dockerfile、Compose、数据卷、网络、最佳实践 |
| [02 — Docker 进阶深入](./02-advanced) | 镜像分层原理、网络深入、存储驱动、多架构、安全、BuildKit、Compose 高级特性 |
| [03 — 实战项目：全栈应用容器化](./03-project) | React + Node.js + PostgreSQL + Redis + Nginx 完整容器化 |
| [04 — Docker 工程实践](./04-engineering) | 多阶段构建优化、Compose 生产配置、安全扫描、Kubernetes 部署 |
| [05 — Docker 生态全景](./05-ecosystem) | 编排工具、镜像仓库、安全工具链、监控、开发工具、CI/CD 集成 |

## 快速开始

```sh
# 验证环境
docker --version
docker compose version

# 第一个容器
docker run hello-world
```

## 环境要求

- **Docker Desktop**（macOS / Windows，见 [官方安装](https://docs.docker.com/get-docker/)）；Linux 用 Docker Engine
- Docker Compose v2（Docker Desktop 已内置）
- 建议分配 4GB+ 内存给 Docker 虚拟机
- 实战项目需准备 Docker Hub 账号（可选）

## 前置知识

- 基础的命令行操作（可参考 [Bash 教程](/tutorials/bash/)）
- 了解 Linux 基本概念（进程、文件、网络、端口）
- 无需编程经验

## 官方文档

镜像分层、Dockerfile 指令、Compose 配置以一手文档为准。

| 类型 | 链接 |
|------|------|
| 官方文档 | [docs.docker.com](https://docs.docker.com/) |
| Dockerfile 参考 | [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/) |
| Compose 参考 | [Compose File Reference](https://docs.docker.com/reference/compose-file/) |
| CLI 参考 | [Docker CLI](https://docs.docker.com/reference/cli/docker/) |
| 容器标准 | [OCI Specifications](https://opencontainers.org/) |

更多入口见 [官方文档索引](/reference/official-docs)。

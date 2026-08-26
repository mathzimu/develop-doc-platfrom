# Git 教程

Git 是目前最流行的分布式版本控制系统，用于跟踪文件的变更历史，支持多人协作开发。

本教程从入门到企业级实践，覆盖 Git 核心概念、高级技巧、团队协作流程、工程规范及生态工具。

## 目录

| # | 章节 | 内容 |
|---|------|------|
| 1 | [Git 基础语法](/tutorials/git/01-basics) | 配置、基本操作、分支、远程、撤销、标签、Stash、Rebase、Cherry-pick、Bisect、.gitignore |
| 2 | [Git 进阶深入](/tutorials/git/02-advanced) | 内部原理（blob/tree/commit）、Rebase 深入（auto-squash、--onto）、Cherry-pick 高级、Reflog 恢复、Submodule vs Subtree、filter-repo、Worktree、部分克隆、稀疏检出、bisect run、blame ignore |
| 3 | [实战项目：团队协作工作流模拟](/tutorials/git/03-project) | 从零模拟三人团队：初始化 → Feature Branch → PR → 冲突解决 → Code Review → Merge → Release Tagging → Hotfix |
| 4 | [Git 工程实践](/tutorials/git/04-engineering) | 约定式提交（Conventional Commits）、分支策略（Trunk-Based / GitHub Flow / Git Flow）、Monorepo / CODEOWNERS、Git Hooks / husky / commitlint、Code Review、LFS、合并策略、CI/CD、度量与监控 |
| 5 | [Git 生态全景](/tutorials/git/05-ecosystem) | 托管平台对比（GitHub / GitLab / Bitbucket / Gitee）、CI/CD 工具链、GUI 工具、项目管理集成、语义化版本（SemVer）、安全工具（gitleaks / 签名提交） |

> 建议按顺序阅读。初学者从 **01-basics** 开始，有经验可直接跳至 **02-advanced** 或 **04-engineering**。

## 环境要求

- **Git**（[安装说明](https://git-scm.com/downloads)，macOS 用 `brew install git`）
- **建议**：一个 GitHub / GitLab / Gitee 账号（用于远程协作与实战）
- 实战项目可选：任意本地目录即可，无需数据库

## 前置知识

- 基础的命令行操作（可参考 [Bash 教程](/tutorials/bash/)）
- 无需编程知识

## 快速开始

```sh
# 检查版本
git --version

# 设置身份（每次提交前必做）
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 第一个仓库
mkdir demo && cd demo
git init
echo "# demo" > README.md
git add README.md
git commit -m "init"
```

## 官方文档与延伸阅读

- **官方文档**：[git-scm.com/doc](https://git-scm.com/doc) · [Pro Git（中文）](https://git-scm.com/book/zh/v2) · [Git Reference](https://git-scm.com/docs)
- **托管平台**：[GitHub Docs](https://docs.github.com/zh) · [GitLab Docs](https://docs.gitlab.com/)
- **规范**：[Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) · [SemVer](https://semver.org/lang/zh-CN/)
- **相关工具**：[Git LFS](https://git-lfs.com/) · [git-filter-repo](https://github.com/newren/git-filter-repo) · [gitleaks](https://github.com/gitleaks/gitleaks)

# Git 生态全景

## Git 托管平台

| 平台 | 特点 | CI/CD |
|------|------|-------|
| **GitHub** | 最大社区、Actions、Copilot | GitHub Actions |
| **GitLab** | 自托管、完整 DevOps | GitLab CI/CD |
| **Bitbucket** | Atlassian 集成 | Bitbucket Pipelines |
| **Gitee** | 中国区、国内加速 | Gitee Go |

## CI/CD 工具链

```
代码提交 → 代码检查 → 测试 → 构建 → 部署
   │          │        │       │      │
   ├ husky    ├ ESLint  ├ Jest  ├ Vite ├ Docker
   ├ commitlint├ Prettier├ Vitest├ Webpack├ K8s
   └ lint-staged└ mypy   └ pytest└ esbuild└ Serverless
```

## Git GUI 工具

```sh
gitk              # Git 内置历史浏览器
git gui           # Git 内置 GUI

# 第三方 GUI
GitHub Desktop    # 免费、简洁
Sourcetree        # 功能完整（Windows/Mac）
GitKraken         # 可视化 Git 图
Fork              # 快速、优雅（Mac）
```

## 项目管理集成

```sh
# GitHub Issues + Projects
git commit -m "fix(#123): handle null pointer"

# 自动关闭 Issue（在提交信息中）
# Closes #123, Fixes #456

# GitLab Issue Boards
# Jira 集成
# Linear 集成
```

## 语义化版本（SemVer）

```
v1.2.3
│ │ │
│ │ └── patch: 修复 Bug
│ └──── minor: 新增功能（向后兼容）
└────── major: 破坏性变更

# 工具
npm version patch  # 1.2.3 → 1.2.4
npm version minor  # 1.2.3 → 1.3.0
npm version major  # 1.2.3 → 2.0.0

# 自动生成 Changelog
standard-version
semantic-release
changesets       # Monorepo 版本管理
```

## Git 安全工具

```sh
# 扫描敏感信息
git secrets --scan
trufflehog git --repo https://github.com/user/repo
gitleaks detect

# 签名提交
git config --global user.signingkey <KEY>
git config --global commit.gpgsign true
git commit -S -m "signed commit"
```

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 官方文档 | [git-scm.com/doc](https://git-scm.com/doc) · [Git 命令参考](https://git-scm.com/docs) · [Pro Git（中文）](https://git-scm.com/book/zh/v2) |
| 托管平台 | [GitHub Docs](https://docs.github.com/zh) · [GitLab Docs](https://docs.gitlab.com/) · [Bitbucket Docs](https://support.atlassian.com/bitbucket-cloud/) |
| 规范 | [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) · [SemVer](https://semver.org/lang/zh-CN/) |
| 版本发布 | [semantic-release](https://semantic-release.gitbook.io/) · [changesets](https://changesets.githubblog.com/) · [standard-version](https://github.com/conventional-changelog/standard-version) |
| 安全工具 | [gitleaks](https://github.com/gitleaks/gitleaks) · [trufflehog](https://github.com/trufflesecurity/trufflehog) · [Git LFS](https://git-lfs.com/) |

# Developer Doc Platform

> 语言 / Language: [中文](#中文) · [English](#english)

---

# 中文

基于 [VitePress](https://vitepress.dev/zh/) 与 Markdown 构建的开发者文档平台：提供 18 个技术方向的系统化教程，并集中索引官方文档、规范标准与工具链。

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [内容组织](#内容组织)
- [配置](#配置)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

---

## 特性

- **18 个技术方向**：前端、后端、数据库、DevOps、C 语言家族等，每个方向统一由「基础 → 进阶 → 实战 → 工程 → 生态」五章组织。
- **直达官方一手文档**：教程只讲概念、路径与取舍，API 签名、配置项、版本差异一律链接官方文档，避免二手信息过期。
- **规范与标准可追溯**：收录 WHATWG、W3C、ECMA、ISO、IETF RFC、OCI、OpenAPI 等权威规范入口。
- **工具链一站式索引**：包管理、构建、Lint、测试、CI/CD、可观测性工具按职责分类，选型即查即用。
- **本地全文搜索**：内置 mini-search 中文搜索，无需第三方服务。
- **版本归档**：通过 `versions/` 目录与导航栏切换器支持历史版本（v1.0 最新 / v0.9 存档）。
- **Markdown + Git 维护**：任何页面都可通过底部「在 GitHub 上编辑此页」提交修正。

## 技术栈

- **框架**：[VitePress](https://vitepress.dev/zh/) 1.6.4，基于 [Vue](https://vuejs.org/) 3 的静态站点生成器
- **内容格式**：Markdown 为主，按需嵌入 Vue 组件增强交互
- **包管理**：npm（同时兼容 pnpm / yarn）
- **搜索**：内置 mini-search 本地全文搜索，无需后端服务
- **部署**：纯静态产物，支持 Docker / Vercel / Netlify / GitHub Pages / Cloudflare Pages

## 快速开始

**环境要求**

- Node.js 18+（推荐 20 LTS）
- npm / pnpm / yarn 任一包管理器

**本地开发**

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
npm run build      # 构建生产版本（输出到 docs/.vitepress/dist/）
npm run preview    # 预览构建产物
```

## 项目结构

```
developer-doc-platform/
├── docs/              # 文档源码
│   ├── .vitepress/   # 配置与主题
│   ├── guide/        # 平台指南
│   ├── tutorials/    # 技术教程（18 个方向）
│   ├── reference/    # 官方文档 / 规范 / 工具链索引
│   ├── versions/     # 历史版本归档
│   ├── public/       # 静态资源
│   └── index.md      # 首页
├── .gitignore
├── package.json      # 依赖与脚本
└── README.md
```

各目录职责：

- **docs/.vitepress/**：`config.ts` 站点主配置、`sidebar.ts` 自动生成侧边栏、`theme/` 主题与样式覆盖。
- **docs/guide/**：平台自身的使用文档（结构、配置、部署）。
- **docs/tutorials/**：18 个技术方向的教程，每方向一个子目录、内含五章标准内容。
- **docs/reference/**：官方文档索引、规范标准、工具链与包管理索引。
- **docs/versions/**：历史版本归档，通过导航栏版本切换器访问。
- **docs/public/**：站点静态资源（如 `favicon.svg`、`logo.svg`）。

## 内容组织

### 教程

18 个技术方向，每个方向一个子目录，内含 `index.md` 与五个标准章节：

1. **基础**（`01-basics.md`）— 核心语法、常用 API、示例
2. **进阶**（`02-advanced.md`）— 深入机制与高级用法
3. **实战**（`03-project.md`）— 端到端项目实践
4. **工程**（`04-engineering.md`）— 架构、安全、测试、性能、CI/CD
5. **生态**（`05-ecosystem.md`）— 相关工具、库、框架对比与选型

### 参考

- `reference/official-docs.md` — 各方向官方文档索引
- `reference/standards.md` — 规范与标准入口
- `reference/tooling.md` — 工具链与包管理索引

### 新增内容

1. 阅读 [项目结构](docs/guide/project-structure.md) 了解目录约定。
2. 新增技术方向时，复制已有教程目录的五章结构，并补充官方文档索引中的链接。
3. 修改站点外观或结构时，先查看 [配置](docs/guide/configuration.md)。
4. 发布前按 [部署指南](docs/guide/deployment.md) 检查并上线。

## 配置

站点行为由 `docs/.vitepress/config.ts` 集中定义：

- **导航栏**：教程、参考、平台、版本切换（v1.0 / v0.9）
- **侧边栏**：由 `sidebar.ts` 按文件系统结构自动生成（数字前缀排序、排除 `versions/` 等目录）
- **搜索**：本地搜索，全中文界面
- **语言**：`zh-CN`，所有 UI 标签已中文化
- **编辑链接**：指向 GitHub 源文件，便于社区贡献

完整配置参考见 [docs/guide/configuration.md](docs/guide/configuration.md)。

## 部署

构建产物为纯静态文件，位于 `docs/.vitepress/dist/`，可托管到任意静态平台：

- **Docker**：`Dockerfile` + nginx
- **Vercel / Netlify / Cloudflare Pages**：Git 自动部署，构建命令 `npm run build`，发布目录 `docs/.vitepress/dist`
- **GitHub Pages**：GitHub Actions CI/CD

详细步骤、Nginx 配置、自定义域名与 DNS 见 [docs/guide/deployment.md](docs/guide/deployment.md)。

## 贡献

本站内容通过 Markdown + Git 维护：

- 在 GitHub 上打开任意页面，点击底部「在 GitHub 上编辑此页」即可提交修改。
- 遵循现有目录与五章结构约定，技术细节优先链接官方文档。

## 许可证

基于 MIT 协议发布。

---

# English

A developer documentation platform built with [VitePress](https://vitepress.dev/) and Markdown. It delivers systematic tutorials across 18 technology tracks and centrally indexes official docs, standards, and the tooling ecosystem.

## Table of Contents

- [Features](#features-1)
- [Tech Stack](#tech-stack-1)
- [Getting Started](#getting-started-1)
- [Project Structure](#project-structure-1)
- [Content Organization](#content-organization-1)
- [Configuration](#configuration-1)
- [Deployment](#deployment-1)
- [Contributing](#contributing-1)
- [License](#license-1)

---

## Features

- **18 technology tracks**: Frontend, backend, databases, DevOps, the C-family, and more — each organized into five consistent chapters: Basics → Advanced → Project → Engineering → Ecosystem.
- **Links to official, first-hand docs**: Tutorials focus on concepts, paths, and trade-offs; API signatures, config options, and version differences link straight to official docs to avoid stale second-hand info.
- **Traceable standards**: Curated entry points to authoritative specs such as WHATWG, W3C, ECMA, ISO, IETF RFC, OCI, and OpenAPI.
- **One-stop tooling index**: Package managers, build tools, linters, test runners, CI/CD, and observability tools categorized by responsibility for quick selection.
- **Local full-text search**: Built-in mini-search with a Chinese UI — no third-party service required.
- **Versioned archives**: Historical versions (v1.0 latest / v0.9 archive) via the `versions/` directory and the navbar switcher.
- **Markdown + Git workflow**: Any page can be fixed via the "Edit this page on GitHub" link in the footer.

## Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) 1.6.4, a static site generator built on [Vue](https://vuejs.org/) 3
- **Content format**: Markdown first, with Vue components embedded where interactivity helps
- **Package manager**: npm (also compatible with pnpm / yarn)
- **Search**: Built-in mini-search local full-text search, no backend required
- **Deployment**: Pure static output, supports Docker / Vercel / Netlify / GitHub Pages / Cloudflare Pages

## Getting Started

**Prerequisites**

- Node.js 18+ (20 LTS recommended)
- npm / pnpm / yarn (any one)

**Local development**

```bash
npm install        # install dependencies
npm run dev        # start the dev server (default http://localhost:5173)
npm run build      # build for production (output to docs/.vitepress/dist/)
npm run preview    # preview the production build
```

## Project Structure

```
developer-doc-platform/
├── docs/              # documentation source
│   ├── .vitepress/   # config and theme
│   ├── guide/        # platform guides
│   ├── tutorials/    # tech tutorials (18 tracks)
│   ├── reference/    # official docs / standards / tooling index
│   ├── versions/     # historical version archives
│   ├── public/       # static assets
│   └── index.md      # home page
├── .gitignore
├── package.json      # dependencies and scripts
└── README.md
```

Directory responsibilities:

- **docs/.vitepress/**: `config.ts` main site config, `sidebar.ts` auto-generated sidebar, `theme/` theme and style overrides.
- **docs/guide/**: Documentation for the platform itself (structure, configuration, deployment).
- **docs/tutorials/**: Tutorials for 18 technology tracks — one subdirectory per track, each with five standard chapters.
- **docs/reference/**: Official documentation index, standards, and tooling/package-manager index.
- **docs/versions/**: Historical version archives, accessible via the navbar version switcher.
- **docs/public/**: Site static assets (e.g. `favicon.svg`, `logo.svg`).

## Content Organization

### Tutorials

18 technology tracks, each in its own subdirectory with an `index.md` and five standard chapters:

1. **Basics** (`01-basics.md`) — core syntax, common APIs, examples
2. **Advanced** (`02-advanced.md`) — deeper mechanics and advanced usage
3. **Project** (`03-project.md`) — end-to-end project practice
4. **Engineering** (`04-engineering.md`) — architecture, security, testing, performance, CI/CD
5. **Ecosystem** (`05-ecosystem.md`) — comparison and selection of related tools, libraries, and frameworks

### Reference

- `reference/official-docs.md` — official documentation index per track
- `reference/standards.md` — standards and specifications entry points
- `reference/tooling.md` — tooling and package-manager index

### Adding content

1. Read [Project Structure](docs/guide/project-structure.md) to learn the directory conventions.
2. When adding a new track, copy an existing tutorial's five-chapter structure and add links to the official docs index.
3. Before changing the site's appearance or structure, check [Configuration](docs/guide/configuration.md).
4. Before publishing, verify against the [Deployment Guide](docs/guide/deployment.md).

## Configuration

Site behavior is centralized in `docs/.vitepress/config.ts`:

- **Navbar**: Tutorials, Reference, Platform, version switcher (v1.0 / v0.9)
- **Sidebar**: Auto-generated by `sidebar.ts` from the file system (numeric-prefix ordering, excludes `versions/` and similar)
- **Search**: Local search with a fully localized Chinese UI
- **Language**: `zh-CN`, all UI labels localized
- **Edit link**: Points to the GitHub source file to ease community contributions

Full configuration reference: [docs/guide/configuration.md](docs/guide/configuration.md).

## Deployment

The build output is pure static files in `docs/.vitepress/dist/`, deployable to any static host:

- **Docker**: `Dockerfile` + nginx
- **Vercel / Netlify / Cloudflare Pages**: Git-based auto deploy — build command `npm run build`, publish directory `docs/.vitepress/dist`
- **GitHub Pages**: GitHub Actions CI/CD

Detailed steps, Nginx config, custom domains, and DNS: [docs/guide/deployment.md](docs/guide/deployment.md).

## Contributing

This site is maintained with Markdown + Git:

- Open any page on GitHub and click "Edit this page on GitHub" in the footer to submit a fix.
- Follow the existing directory and five-chapter conventions; prefer linking to official docs for technical details.

## License

Released under the MIT License.

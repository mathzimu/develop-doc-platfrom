# 平台指南

本平台是基于 [VitePress](https://vitepress.dev/zh/) 构建的静态文档站点，面向开发者社区提供 18 个技术方向的系统化教程，以及官方文档、规范标准、工具链的权威入口索引。

本文档面向**平台的维护者与二次开发者**，说明站点结构、配置方法、部署与版本管理。读者若只想查阅技术内容，可直接前往 [教程](/tutorials/)。

## 指南目录

| 章节 | 内容 |
|------|------|
| [项目结构](/guide/project-structure) | 顶层结构、配置目录、文档组织与数据流 |
| [配置](/guide/configuration) | 站点配置、导航、侧边栏、搜索等完整参考 |
| [部署](/guide/deployment) | Docker、Vercel、Netlify、GitHub Pages、Cloudflare 多平台部署 |
| 版本存档 | [v1.0（最新）](/)、[v0.9](/versions/v0.9/) 历史版本归档 |

## 快速开始

```bash
# 安装依赖（Node.js 18+）
npm install

# 启动本地开发服务器（http://localhost:5173）
npm run dev

# 构建生产版本（输出到 docs/.vitepress/dist/）
npm run build

# 预览构建产物
npm run preview
```

## 站点导航概览

- **教程** — 18 个技术方向，每方向固定五章：基础、进阶、实战、工程、生态。
- **参考** — 官方文档索引、规范与标准、工具链与包管理。
- **平台** — 本指南、项目结构、配置、部署。
- **版本** — v1.0（最新）与 v0.9 存档切换。

## 新增内容的推荐路径

1. 阅读 [项目结构](/guide/project-structure) 了解目录约定。
2. 新增技术方向时，参照已有教程目录复制五章结构，并补充 [官方文档索引](/reference/official-docs) 中的链接。
3. 修改站点外观或结构时，先查看 [配置](/guide/configuration)。
4. 发布前按 [部署指南](/guide/deployment) 检查并上线。
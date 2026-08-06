---
layout: home

title: Developer Doc Platform
titleTemplate: 开发者文档平台

hero:
  name: Developer Doc Platform
  text: 开发者文档平台
  tagline: 基于 VitePress，Markdown 驱动，快速上线，简单维护。
  image:
    src: /logo.svg
    alt: Developer Doc Platform
  actions:
    - theme: brand
      text: 浏览教程
      link: /tutorials/
    - theme: alt
      text: 官方文档索引
      link: /reference/official-docs
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/mathzimu/develop_doc_platfrom

features:
  - title: 18 个技术方向
    details: 前端、后端、数据库、DevOps、C 语言家族，每个方向统一按「基础 → 进阶 → 实战 → 工程 → 生态」五章组织。
    link: /tutorials/
    linkText: 查看全部教程
  - title: 细节直达官方文档
    details: 教程只讲概念、路径与取舍，API 签名、配置项、版本差异一律链接到官方一手文档，避免二手信息过期。
    link: /reference/official-docs
    linkText: 官方文档索引
  - title: 规范与标准可追溯
    details: 收录 WHATWG、W3C、ECMA、ISO、IETF RFC、OCI、OpenAPI 等权威规范入口，边界行为可查证。
    link: /reference/standards
    linkText: 规范与标准
  - title: 工具链一站式索引
    details: 包管理、构建、Lint、测试、CI/CD、可观测性工具的官方文档按职责分类，选型即查即用。
    link: /reference/tooling
    linkText: 工具链与包管理
---

## 从哪里开始

| 你的情况 | 建议入口 |
|----------|----------|
| 零基础想学一门语言 | [教程总览](/tutorials/) → 选方向 → 从 `01-basics` 开始 |
| 有经验，想补齐工程能力 | 各方向的 `04-engineering` 与 `05-ecosystem` 章节 |
| 只想查某个 API 或配置项 | [官方文档索引](/reference/official-docs) |
| 需要确认标准的确切行为 | [规范与标准](/reference/standards) |
| 做技术选型 / 搭工具链 | [工具链与包管理](/reference/tooling) |
| 想部署或二次开发本平台 | [平台指南](/guide/) |

## 内容约定

- 每个技术方向固定五章：**基础语法、进阶深入、实战项目、工程实践、生态全景**。
- 代码示例可直接复制运行，均标注所需的最低版本。
- 技术细节以官方文档为准，教程正文出现 API 与配置项时给出官方链接而非复制原文。
- 内容通过 Markdown + Git 维护，任何页面都可以通过底部「在 GitHub 上编辑此页」提交修正。

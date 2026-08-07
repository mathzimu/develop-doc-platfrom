# 配置

站点主配置位于 `docs/.vitepress/config.ts`。本文对照代码逐项说明，并给出常用自定义方式。

## 站点基本信息

`title`、`description`、`lang` 影响浏览器标签、SEO 与语言。

```ts
title: 'Developer Doc Platform',
description: 'A modern developer documentation platform built with VitePress',
lang: 'zh-CN',
```

- `lastUpdated: true` 与 `themeConfig.lastUpdated.text` 控制页面底部「最后更新」时间展示。
- `cleanUrls: true` 去除 URL 中的 `.html` 后缀。

## 头部 head 配置

```ts
head: [
  ['link', { rel: 'icon', href: '/favicon.svg' }],
  ['meta', { name: 'theme-color', content: '#3b82f6' }],
]
```

`public/` 目录下的资源（如 `favicon.svg`、`logo.svg`）以根路径 `/` 引用。

## 导航栏（`themeConfig.nav`）

```ts
nav: [
  { text: '教程', link: '/tutorials/', activeMatch: '/tutorials/' },
  {
    text: '参考',
    activeMatch: '/reference/',
    items: [
      { text: '官方文档索引', link: '/reference/official-docs' },
      { text: '规范与标准', link: '/reference/standards' },
      { text: '工具链与包管理', link: '/reference/tooling' },
    ],
  },
  // 平台、版本 ...
]
```

- 单个链接使用 `text` + `link`。
- 下拉菜单使用 `items` 数组。
- `activeMatch` 用于高亮当前所在分组。

## 侧边栏（`themeConfig.sidebar`）

由 `generateSidebar()` 自动生成：

```ts
const sidebar = generateSidebar()   // 来自 ./sidebar
```

该函数按文件系统目录结构动态生成，具体规则见 [项目结构 —— `sidebar.ts`](/guide/project-structure#vitepress-sidebar-ts)。新增 Markdown 文件后无需手动改侧边栏。

## 搜索

```ts
search: {
  provider: 'local',
  options: {
    locales: {
      zh: { translations: { /* 中文化按钮与弹窗文案 */ } },
    },
  },
}
```

使用 VitePress 内置本地搜索，界面文案已中文化。

## 编辑链接、社交与页脚

```ts
editLink: {
  pattern: 'https://github.com/mathzimu/develop_doc_platfrom/edit/main/docs/:path',
  text: '在 GitHub 上编辑此页',
},
socialLinks: [{ icon: 'github', link: 'https://github.com/mathzimu/develop_doc_platfrom' }],
footer: {
  message: '基于 MIT 协议发布',
  copyright: `Copyright © ${new Date().getFullYear()} mathzimu`,
},
```

- 每个页面右上角显示「在 GitHub 上编辑此页」。
- `:path` 会被替换为当前文档相对路径。

## 大纲与其他界面文案

```ts
outline: { label: '页面导航', level: [2, 3] },   // 右侧大纲显示 2~3 级标题
docFooter: { prev: '上一页', next: '下一页' },
darkModeSwitchLabel: '深色模式',
// 其余 returnToTopLabel、langMenuLabel 等
```

## 常见自定义

| 需求 | 修改位置 |
|------|----------|
| 修改主题色（品牌色） | [`theme/style.css`](/guide/project-structure#theme-style-css) 覆盖 `--vp-c-brand-*` |
| 新增导航页 | `nav` 数组追加条目；侧边栏随目录自动生成 |
| 部署到子路径 | `base` 配置，见 [部署指南](/guide/deployment#部署到-github-pages) |
| 更换 Logo / 图标 | 替换 `public/logo.svg`、`public/favicon.svg` |

## 完整参考

VitePress 提供更丰富的配置项，本站仅用到其中一部分：

- [站点配置参考](https://vitepress.dev/zh/reference/site-config)
- [默认主题配置](https://vitepress.dev/zh/reference/default-theme-config)
- [Markdown 扩展](https://vitepress.dev/zh/guide/markdown)
# 多版本

多版本文档按目录组织，通过导航栏版本选择器切换。

## 目录结构

```
docs/
├── guide/
├── api/
├── versions/
│   └── v0.9/
└── index.md
```

## 配置

```ts
themeConfig: {
  nav: [
    {
      text: '版本',
      items: [
        { text: 'v1.0 (最新)', link: '/' },
        { text: 'v0.9', link: '/versions/v0.9/' },
      ],
    },
  ],
}
```

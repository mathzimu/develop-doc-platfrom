# 配置

## 站点配置

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的文档',
  description: '文档站点描述',
  lang: 'zh-CN',
})
```

## 主题配置

```ts
themeConfig: {
  nav: [...],
  sidebar: generateSidebar(),
  search: { provider: 'local' },
}
```

更多选项请参考 [VitePress 配置参考](https://vitepress.dev/zh/reference/site-config)。

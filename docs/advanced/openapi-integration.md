# OpenAPI 集成

通过 [@scalar/vitepress](https://github.com/scalar/scalar) 插件集成 OpenAPI 规范：

```ts
import { defineConfig } from 'vitepress'
import { apiReference } from '@scalar/vitepress'

export default defineConfig({
  vite: {
    plugins: [apiReference({
      spec: { url: '/openapi.yaml' },
    })],
  },
})
```

将 `openapi.yaml` 放置在 `docs/public/` 目录。

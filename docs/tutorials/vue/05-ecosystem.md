# Vue 生态全景

```
┌─────────────────────────────────────────┐
│            Vue 生态系统                    │
├──────────────────┬──────────────────────┤
│   元框架          │  状态管理              │
│   Nuxt 3         │  Pinia                │
│   VitePress      │  Vuex (维护模式)       │
│   Quasar         │                       │
├──────────────────┼──────────────────────┤
│   组件库          │  工具                 │
│   Element Plus   │  VueUse               │
│   Naive UI       │  Vue Router           │
│   Ant Design Vue │  TanStack Vue Query   │
│   PrimeVue       │  Vue-i18n             │
│   Radix Vue      │  Vee-Validate         │
├──────────────────┼──────────────────────┤
│   构建            │  测试                 │
│   Vite           │  Vitest               │
│   UnoCSS         │  Vue Test Utils       │
│   Nuxt DevTools  │  Cypress              │
└──────────────────┴──────────────────────┘
```

### 元框架选型

| 框架 | 特点 | 适用 |
|------|------|------|
| **Nuxt 3** | 全栈、SSR/SSG、自动导入 | 生产应用 |
| **VitePress** | 文档站点 | 技术文档 |
| **Quasar** | 跨平台（Web/Mobile/Desktop） | 多端项目 |
| **VuePress** | 文档站点（Vue 2） | 旧项目 |

### 组件库推荐

```ts
// Element Plus —— 中后台首选
import { ElButton, ElTable, ElDialog } from 'element-plus'

// Naive UI —— TypeScript 友好、按需加载
import { NButton, NDataTable } from 'naive-ui'

// Radix Vue —— 无样式无障碍组件
import { Dialog, DropdownMenu } from 'radix-vue'
```

### 工具库

```ts
// VueUse —— 300+ 组合式函数
import { useMouse, useDebounce, useLocalStorage } from '@vueuse/core'

const { x, y } = useMouse()
const storage = useLocalStorage('key', 'default')

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'

// Pinia
import { defineStore } from 'pinia'

// Vue-i18n
import { createI18n } from 'vue-i18n'
```

### Nuxt 3 项目模板

```sh
npx nuxi init my-app
cd my-app
npm install
npm run dev
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: true },
})
```

## 官方文档与延伸阅读

- **核心与 API**：[Vue 官方文档（中文）](https://cn.vuejs.org/guide/introduction.html) · [Vue API](https://cn.vuejs.org/api/)
- **元框架**：[Nuxt 3](https://nuxt.com/docs) · [VitePress](https://vitepress.dev/zh/) · [Quasar](https://quasar.dev/)
- **状态/路由**：[Pinia](https://pinia.vuejs.org/zh/) · [Vue Router](https://router.vuejs.org/zh/)
- **组件库**：[Element Plus](https://element-plus.org/zh-CN/) · [Naive UI](https://www.naiveui.com/zh-CN/os-theme) · [Ant Design Vue](https://antdv.com/) · [PrimeVue](https://primevue.org/) · [Radix Vue](https://www.radix-vue.com/)
- **工具库**：[VueUse](https://vueuse.org/) · [TanStack Vue Query](https://tanstack.com/query/latest/docs/framework/vue/overview) · [Vue-i18n](https://vue-i18n.intlify.dev/) · [Vee-Validate](https://vee-validate.logaretm.com/v4/)
- **测试**：[Vitest](https://vitest.dev/) · [Vue Test Utils](https://test-utils.vuejs.org/zh/) · [Cypress](https://docs.cypress.io/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

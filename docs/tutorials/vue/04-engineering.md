# Vue 工程实践

## 项目结构

```
src/
├── app/
│   ├── App.vue
│   └── router.ts
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types.ts
│   └── dashboard/
├── shared/
│   ├── components/     # 通用组件
│   ├── composables/    # 通用组合式函数
│   └── utils/
├── layouts/
└── styles/
```

## API 层

```ts
// shared/api/http.ts
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { useAuthStore } from '@/features/auth/stores'
import { useToast } from '@/shared/composables/useToast'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

http.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 类型安全封装
export function useApi() {
  const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const { data } = await http.get<T>(url, { params })
    return data
  }
  const post = async <T>(url: string, body?: unknown): Promise<T> => {
    const { data } = await http.post<T>(url, body)
    return data
  }
  return { get, post, put, del }
}
```

## 服务端状态管理

```ts
// 使用 TanStack Query（Vue Query）
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export function useUsers(params: Ref<PaginationParams>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get<User[]>('/users', { ...params.value }),
    keepPreviousData: true,
    staleTime: 30_000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: CreateUserDto) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('创建成功')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
```

## 组合式函数（Composables）模式

```ts
// 表单处理
export function useForm<T extends Record<string, unknown>>(initial: T) {
  const form = reactive({ ...initial })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)

  const validate = (schema: Record<string, (v: unknown) => string | null>) => {
    for (const [key, validator] of Object.entries(schema)) {
      const error = validator(form[key as keyof T])
      if (error) errors.value[key as keyof T] = error
    }
    return Object.keys(errors.value).length === 0
  }

  const reset = () => Object.assign(form, initial)

  return { form, errors, isSubmitting, validate, reset, toRaw: () => toRaw(form) }
}

// 分页
export function usePagination(fetchFn: (params: PaginationParams) => Promise<PageResult>) {
  const page = ref(1)
  const size = ref(20)
  const total = ref(0)
  const items = ref<unknown[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      const result = await fetchFn({ page: page.value, size: size.value })
      items.value = result.items
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  watch([page, size], load, { immediate: true })

  return { page, size, total, items, loading, load }
}
```

## 权限指令

```ts
// 自定义指令：v-permission
app.directive('permission', {
  mounted(el: HTMLElement, binding) {
    const { value } = binding
    const permissions = useAuthStore().permissions
    const hasPermission = permissions.some(p =>
      value ? p.startsWith(value) : true
    )
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
})

// 使用
<button v-permission="'users:edit'">编辑用户</button>
```

## 测试

```ts
// Vitest + Vue Test Utils
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserList from './UserList.vue'

describe('UserList', () => {
  it('renders users', async () => {
    const wrapper = mount(UserList, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            users: {
              items: [{ id: 1, name: 'Alice' }],
              loading: false,
            },
          },
        })],
      },
    })
    expect(wrapper.text()).toContain('Alice')
  })
})
```

### 配置 Vitest

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
})
```

### 组件交互测试

```ts
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('1')
  })

  it('emits event', () => {
    const wrapper = mount(Counter)
    wrapper.vm.$emit('increment', 5)
    expect(wrapper.emitted('increment')?.[0]).toEqual([5])
  })
})
```

## CI/CD

```yml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
```

## i18n 国际化

```ts
// i18n/index.ts
import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    welcome: '欢迎回来',
    login: { title: '登录', submit: '提交' },
  },
  en: {
    welcome: 'Welcome back',
    login: { title: 'Login', submit: 'Submit' },
  },
}

const i18n = createI18n({
  locale: navigator.language.startsWith('zh') ? 'zh' : 'en',
  fallbackLocale: 'en',
  messages,
})

// 组件中使用
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// <h1>{{ t('welcome') }}</h1>
// <h1>{{ t('login.title') }}</h1>
```

### 动态切换语言

```ts
const { locale } = useI18n()
locale.value = 'en'
// 切换后所有模板自动更新
```

## 安全实践

```ts
// 防止 XSS —— 使用 v-text 而非 v-html
// <div v-text="userInput" />

// 使用 DOMPurify 净化 HTML
import DOMPurify from 'dompurify'
const safeHtml = DOMPurify.sanitize(rawHtml)

// CSP 头设置（nginx 示例）
// add_header Content-Security-Policy "default-src 'self'; script-src 'self'";

// 防止 CSRF —— 使用 SameSite Cookie
http.defaults.withCredentials = true
// 服务端设置 Set-Cookie: session=xxx; SameSite=Strict; Secure

// 敏感信息使用环境变量
// VITE_API_KEY 不会被打包进前端代码
```

### 生产部署清单

- 开启 Vite 生产模式 `npm run build`
- 配置 CSP HTTP 头
- 移除 `console.log` 使用 `vite-plugin-remove-console`
- 资源启用 CDN 和强缓存
- 环境变量 `.env.production` 分离
- 使用 `import.meta.env` 而非 `process.env`

## 官方文档与延伸阅读

- **组合式 API**：[Vue 组合式 API 指南](https://cn.vuejs.org/guide/composables.html)
- **状态管理**：[Pinia](https://pinia.vuejs.org/zh/)
- **测试**：[Vitest](https://vitest.dev/) · [Vue Test Utils](https://test-utils.vuejs.org/zh/) · [Cypress](https://docs.cypress.io/)
- **权限/安全**：[Vue 安全建议](https://cn.vuejs.org/guide/best-practices/security.html)
- **i18n**：[Vue-i18n](https://vue-i18n.intlify.dev/)
- **环境变量**：[Vite Env Variables](https://cn.vite.dev/guide/env-and-mode.html) · [import.meta.env](https://vitejs.cn/vitejs-cn/guide/env-and-mode.html)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

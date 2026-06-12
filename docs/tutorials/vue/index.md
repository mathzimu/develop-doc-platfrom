# Vue 教程

Vue 是一个渐进式 JavaScript 框架，用于构建用户界面。Vue 的核心库专注于视图层，易于上手，同时也能配合工具链支持复杂应用。

```sh
npm create vue@latest     # 官方脚手架
npm create vite@latest -- --template vue-ts  # Vite 方式
```

## 创建应用

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

## 模板语法

```vue
<template>
  <div>
    <!-- 文本插值 -->
    <h1>{{ title }}</h1>
    <p>{{ message.toUpperCase() }}</p>

    <!-- 原始 HTML -->
    <div v-html="rawHtml"></div>

    <!-- 属性绑定 -->
    <img :src="imageUrl" :alt="altText">
    <div :class="['container', isActive ? 'active' : '']">
    <div :style="{ color: textColor, fontSize: size + 'px' }">

    <!-- 事件绑定 -->
    <button @click="handleClick">点击</button>
    <button @click.prevent="submit">阻止默认并提交</button>
    <input @keyup.enter="search">
    <div @click.stop="doSomething">阻止冒泡</div>

    <!-- 双向绑定 -->
    <input v-model="name">
    <textarea v-model="description"></textarea>
    <input type="checkbox" v-model="checked">
    <select v-model="selected">
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const title = ref('Hello Vue')
const message = ref('Hello')
const rawHtml = ref('<strong>加粗文字</strong>')
const imageUrl = ref('/logo.png')
const isActive = ref(true)
const name = ref('')
const checked = ref(false)
const selected = ref('a')
</script>
```

## 响应式基础

### ref 与 reactive

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ref: 用于基本类型和需要 .value 访问的值
const count = ref(0)
const message = ref('hello')
count.value++

// reactive: 用于对象（自动深层响应）
const user = reactive({
  name: 'Alice',
  age: 30,
  address: { city: 'Beijing' },
})
user.age++  // 直接修改，无需 .value

// computed: 自动追踪依赖
const double = computed(() => count.value * 2)
const fullName = computed(() => `${user.name} - ${user.age}岁`)

// watch: 监听变化
watch(count, (newVal, oldVal) => {
  console.log(`count 从 ${oldVal} 变为 ${newVal}`)
})

watchEffect(() => {
  console.log(`count 现在是: ${count.value}`)
})
</script>
```

### ref vs reactive

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 + 对象 | 仅对象 |
| 访问方式 | `.value` | 直接访问 |
| 解构 | 丢失响应性 | 丢失响应性（用 `toRefs`） |
| 重新赋值 | 直接 `.value = x` | 不能整体替换 |

```ts
// 保持解构后响应性
const state = reactive({ a: 1, b: 2 })
const { a, b } = toRefs(state)
```

## 条件与循环

```vue
<template>
  <!-- 条件 -->
  <div v-if="status === 'loading'">加载中...</div>
  <div v-else-if="status === 'error'">出错了</div>
  <div v-else>内容已加载</div>

  <!-- 简写 -->
  <div v-show="isVisible">通过 CSS 显示/隐藏</div>

  <!-- 循环 -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }}: {{ item.name }}
    </li>
  </ul>

  <!-- 对象遍历 -->
  <div v-for="(value, key, index) in obj" :key="key">
    {{ key }}: {{ value }}
  </div>
</template>
```

## 组件

### 组件定义

```vue
<!-- Child.vue -->
<template>
  <div class="child">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <button @click="$emit('action')">{{ btnText }}</button>
    <slot />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  content?: string
  btnText?: string
}>()

const emit = defineEmits<{
  action: []
  close: [id: number]
}>()
</script>
```

### 组件使用

```vue
<template>
  <Child
    title="标题"
    content="内容"
    @action="handleAction"
  >
    <p>默认插槽内容</p>
    <template #footer>
      <p>底部插槽内容</p>
    </template>
  </Child>
</template>
```

### 组件 v-model

```vue
<!-- CustomInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value">
</template>

<!-- 使用 -->
<CustomInput v-model="searchText" />
```

## 生命周期

```
创建 → 挂载 → 更新 → 卸载

setup()
onBeforeMount()
onMounted()
onBeforeUpdate()
onUpdated()
onBeforeUnmount()
onUnmounted()
onActivated()    // keep-alive 激活
onDeactivated()  // keep-alive 失活
```

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
</script>
```

## 过渡动画

```vue
<template>
  <button @click="show = !show">切换</button>

  <!-- 单个元素 -->
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>

  <!-- 列表动画 -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </TransitionGroup>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

## 组合式函数（Composables）

```ts
// useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

// 使用
const { x, y } = useMouse()
```

## 路由（Vue Router）

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  { path: '/', component: Home },
  {
    path: '/users/:id',
    component: () => import('./views/User.vue'),  // 懒加载
    children: [
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 组件中使用
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

router.push('/users/1')
router.replace('/login')
console.log(route.params.id)
```

## 状态管理（Pinia）

```ts
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
})

// 使用
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
store.count     // 直接访问
store.increment()

---

# 企业级实践

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

## 测试策略

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

---

## 生态全景

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


```

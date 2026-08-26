# Vue 进阶深入

## 响应式原理

### Proxy vs defineProperty

| 特性 | Object.defineProperty (Vue 2) | Proxy (Vue 3) |
|------|------|------|
| 拦截方式 | 逐个属性定义 | 代理整个对象 |
| 新增属性 | 手动 `Vue.set` | 自动检测 |
| 数组变化 | 重写 7 个方法 | 原生支持 |
| 性能 | 递归遍历所有属性 | 懒代理（访问时才递归） |

```ts
// Vue 3 响应式核心思路
function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)          // 收集依赖
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)        // 触发更新
      return result
    },
  })
}
```

### ref 实现思路

```ts
function ref<T>(value: T) {
  return new class RefImpl<T> {
    private _value: T
    constructor(v: T) {
      this._value = toReactive(v)  // 对象用 reactive 包裹
    }
    get value() {
      track(this, 'value')
      return this._value
    }
    set value(newVal: T) {
      this._value = toReactive(newVal)
      trigger(this, 'value')
    }
  }(value)
}
```

### track / trigger 依赖系统

```ts
const targetMap = new WeakMap<object, Map<string, Set<EffectFn>>>()
let activeEffect: EffectFn | null = null

function track(target: object, key: string) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, depsMap = new Map())
  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, deps = new Set())
  deps.add(activeEffect)
}

function trigger(target: object, key: string) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  deps?.forEach(fn => fn())
}
```

## 编译优化

### Patch Flag

Vue 3 编译时在虚拟 DOM 上标记动态节点类型，跳过静态内容对比。

```ts
export const enum PatchFlags {
  TEXT = 1,         // 动态文本
  CLASS = 2,        // 动态 class
  STYLE = 4,        // 动态 style
  PROPS = 8,        // 动态属性
  FULL_PROPS = 16,  // 动态 key 集合
  HYDRATE_EVENTS = 32,
  STABLE_FRAGMENT = 64,
  KEYED_FRAGMENT = 128,
  UNKEYED_FRAGMENT = 256,
  NEED_PATCH = 512,
}
```

### 静态提升

将静态节点提升到渲染函数外部，避免每次渲染都重新创建。

```ts
// 编译前
function render() {
  return createVNode('div', null, 'static text')
}

// 编译后 —— 静态节点提升
const _hoisted_1 = createVNode('div', null, 'static text')
function render() {
  return _hoisted_1
}
```

### Tree-shaking

Vue 3 核心库按模块导出，未使用的 API 会被打包工具移除。`Transition`、`v-model`、`keep-alive` 等均支持。

## Teleport 与 Suspense

```vue
<!-- Teleport：将内容渲染到 DOM 任意位置 -->
<template>
  <Teleport to="body">
    <div class="modal">全屏弹窗</div>
  </Teleport>
  <!-- 支持多个 Teleport 到同一目标 -->
  <Teleport to="#notifications">
    <Toast />
  </Teleport>
</template>
```

```vue
<!-- Suspense：异步依赖协调 -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
// 组件顶层 await
const data = await fetchData()
</script>
```

## 自定义指令

### 生命周期钩子

```ts
app.directive('focus', {
  mounted(el) { el.focus() },
  updated(el) { el.focus() },
  unmounted(el) { /* 清理 */ },
})
```

### 函数式指令

```ts
// 只有 mounted 和 updated 时简写
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

### 全局 vs 局部

```ts
// 全局
app.directive('my-directive', { ... })

// 局部
<script setup lang="ts">
const vMyDirective = {
  mounted: (el: HTMLElement) => { /* ... */ },
}
</script>
<template>
  <div v-my-directive />
</template>
```

## 插件系统

```ts
// 插件 = 提供 install 方法的对象或函数
import type { App } from 'vue'

const myPlugin = {
  install(app: App, options?: Record<string, unknown>) {
    app.component('MyComponent', { /* ... */ })
    app.directive('my-dir', { /* ... */ })
    app.provide('key', options?.defaultValue ?? 'default')
    app.config.globalProperties.$myMethod = () => { /* ... */ }
  },
}

app.use(myPlugin, { defaultValue: 'hello' })
```

## provide / inject 跨层级通信

```ts
// 祖先组件
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)       // 传递响应式引用
provide('updateTheme', (v: string) => { theme.value = v })

// 后代组件
import { inject } from 'vue'
const theme = inject('theme', ref('light'))  // 第二个参数为默认值
const updateTheme = inject<((v: string) => void)>('updateTheme')
```

## Vue 3 与 Web Component

```ts
import { defineCustomElement } from 'vue'

const MyElement = defineCustomElement({
  props: { message: String },
  emits: ['action'],
  template: `<button @click="$emit('action')">{{ message }}</button>`,
})

customElements.define('my-element', MyElement)
```

## 渲染函数与 JSX

```tsx
import { h, defineComponent } from 'vue'

// h() 函数
const RenderComp = defineComponent({
  props: { level: Number, title: String },
  setup(props, { slots }) {
    return () => h(`h${props.level}`, { class: 'title' }, [
      props.title,
      slots.default?.(),
    ])
  },
})
```

```tsx
// JSX（需 @vitejs/plugin-vue-jsx）
const JsxComp = defineComponent({
  setup() {
    const count = ref(0)
    return () => (
      <div>
        <span>count: {count.value}</span>
        <button onClick={() => count.value++}>+1</button>
      </div>
    )
  },
})
```

## 性能优化

### shallowRef / shallowReactive

```ts
import { shallowRef, shallowReactive } from 'vue'

// 只代理 .value 的访问，内部对象不代理
const largeData = shallowRef({ items: new Array(10000) })
// 修改 items 不会触发响应（需要整体替换）
largeData.value = { items: newItems }

// 只代理第一层属性
const state = shallowReactive({ nested: { count: 0 } })
state.nested.count++    // 不会触发更新
state.nested = { count: 1 }  // 触发更新
```

### v-memo

```vue
<template>
  <!-- 仅当依赖变化时重新渲染该子树 -->
  <div v-memo="[item.id, item.updatedAt]">
    <ExpensiveChild :item="item" />
  </div>
</template>
```

### keep-alive 策略

```vue
<template>
  <!-- 最大缓存 10 个组件实例 -->
  <KeepAlive :max="10">
    <component :is="currentView" />
  </KeepAlive>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue'

onActivated(() => { /* 进入缓存 —— 适合恢复定时器/轮询 */ })
onDeactivated(() => { /* 离开缓存 —— 适合清理 */ })
</script>
```

### 其他优化建议

- 使用 `v-once` 渲染静态内容
- 大列表使用 `virtual-scroll`（vue-virtual-scroller）
- 函数式组件（无状态组件）减少开销
- 合理拆分组件避免过度渲染
- 使用 `computed` 替代方法调用

## 官方文档与延伸阅读

- **响应式机制**：[响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html) · [深度响应式](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)
- **渲染机制**：[渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html) · [渲染函数](https://cn.vuejs.org/guide/extras/render-function.html)
- **编译优化**：[Reactivity Transform（已废弃）](https://cn.vuejs.org/guide/extras/reactivity-transform.html) · [编译时优化](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#vdom-and-compilation)
- **自定义指令**：[自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)
- **Teleport 与 Suspense**：[Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html) · [Suspense](https://cn.vuejs.org/guide/built-ins/suspense.html)
- **源码与 RFC**：[vuejs/core](https://github.com/vuejs/core) · [vuejs/rfcs](https://github.com/vuejs/rfcs)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

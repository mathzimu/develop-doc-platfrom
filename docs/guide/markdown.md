# Markdown 扩展

VitePress 支持标准 Markdown 及丰富的扩展语法，包括代码高亮、自定义容器、代码组等。

## 代码高亮

```ts
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

## 自定义容器

::: tip 提示
提示信息
:::

::: warning 警告
警告信息
:::

::: danger 危险
危险信息
:::

## 代码组

::: code-group

```sh [npm]
npm install
```

```sh [pnpm]
pnpm install
```

:::

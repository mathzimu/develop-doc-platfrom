# TypeScript 工程实践

## 严格模式配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## ESLint + TypeScript

```sh
npm install -D eslint @eslint/js typescript-eslint
```

```ts
// eslint.config.js
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommended,
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
  },
})
```

### 常用规则

| 规则 | 说明 |
|------|------|
| `@typescript-eslint/no-explicit-any` | 禁止显式 `any` |
| `@typescript-eslint/strict-boolean-expressions` | 严格布尔表达式 |
| `@typescript-eslint/no-floating-promises` | 禁止悬空的 Promise |
| `@typescript-eslint/prefer-nullish-coalescing` | 优先使用 `??` |
| `@typescript-eslint/prefer-optional-chain` | 优先使用 `?.` |

## 声明文件（.d.ts）最佳实践

```ts
// 为第三方库编写声明
declare module 'legacy-lib' {
  export function doSomething(input: string): Promise<Result>

  export interface Result {
    id: number
    data: unknown
  }
}

// 全局类型
declare global {
  interface Window {
    __APP_VERSION__: string
    __PUBLIC_PATH__: string
  }
}

// 类型推导辅助
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

export type Nullable<T> = T | null | undefined

export type Brand<T, B> = T & { __brand: B }
type Email = Brand<string, 'Email'>
type Phone = Brand<string, 'Phone'>
```

## Monorepo 类型共享

```ts
// packages/shared/src/types.ts
export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

// packages/api/src/types.ts
import type { User } from '@my/shared'
export type { User }
export interface ApiResponse<T> {
  data: T
  meta: { page: number; total: number }
}

// packages/web/src/types.ts
import type { User } from '@my/shared'
export type { User }
```

## 条件类型与映射类型

```ts
// 条件类型
type IsString<T> = T extends string ? true : false
type A = IsString<'hello'>  // true
type B = IsString<42>       // false

// infer 推导
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Fn = (x: number) => string
type R = ReturnType<Fn>  // string

// 模板字面量类型
type EventName = `on${Capitalize<string>}`
type Events = 'click' | 'focus' | 'blur'
type Handlers = `handle${Capitalize<Events>}`  // 'handleClick' | 'handleFocus' | 'handleBlur'
```

## 类型安全

```ts
// 品牌类型防止混淆
type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'user_123' as UserId
const orderId = 'order_456' as OrderId

getUser(userId)   // ✓ 编译通过
getUser(orderId)  // ✗ 类型错误（防止传错 ID）

// 单元类型（Discriminated Unions）
type Result<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function handleResult(result: Result<User>) {
  switch (result.status) {
    case 'loading': return '加载中'
    case 'success': return result.data.name  // ✓ 类型收窄
    case 'error':   return result.error.message
  }
}
```

## CI/CD 类型检查

### tsconfig.ci.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### GitHub Actions

```yaml
name: Type Check
on: [push, pull_request]
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit -p tsconfig.ci.json
```

### tsc --noEmit 常用模式

```sh
# 开发阶段
npx tsc --noEmit --watch

# CI 中
npx tsc --noEmit --pretty

# 只检查 src
npx tsc --noEmit --project tsconfig.json
```

## ts-reset

ts-reset 提供更合理的类型推断，修复 TypeScript 默认类型的行为：

```sh
npm install -D @total-typescript/ts-reset
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@total-typescript/ts-reset"]
  }
}
```

```ts
// ts-reset 修复的内容
// 1. .filter(Boolean) 正确推导类型
const arr = [1, 2, undefined, 4].filter(Boolean)
// 推导出 number[] 而不是 (number | undefined)[]

// 2. Object.keys 返回 keyof 类型
const obj = { a: 1, b: 2 }
const keys = Object.keys(obj)  // ("a" | "b")[] 而不是 string[]

// 3. JSON.parse 泛型支持
const data = JSON.parse('{"a":1}')  // unknown 而不是 any
```

## 官方文档

| 主题 | 链接 |
|------|------|
| 严格模式 | [tsconfig 全集](https://www.typescriptlang.org/tsconfig) · [strict](https://www.typescriptlang.org/tsconfig#strict) |
| 声明文件 | [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) · [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| Monorepo | [Turborepo](https://turborepo.com/docs) · [Nx](https://nx.dev/getting-started/intro) |
| Lint | [typescript-eslint](https://typescript-eslint.io/getting-started/) · [Biome](https://biomejs.dev/zh-cn/) |
| CI/CD | [GitHub Actions](https://docs.github.com/zh/actions) |

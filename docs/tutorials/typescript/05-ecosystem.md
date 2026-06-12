# TypeScript 生态全景

```
┌─────────────────────────────────────────────┐
│           TypeScript 生态系统                  │
├──────────────────┬──────────────────────────┤
│   编译工具        │  Linter / Formatter       │
│   tsc            │  Biome（推荐）             │
│   swc            │  ESLint                   │
│   esbuild        │  Prettier                 │
│   sucrase        │  dprint                   │
├──────────────────┼──────────────────────────┤
│  运行时类型        │  验证库                   │
│   ts-node        │  Zod（推荐）               │
│   tsx            │  Valibot                  │
│   Bun            │  ArkType                  │
│   Deno           │  Yup                      │
├──────────────────┼──────────────────────────┤
│  框架支持         │ 工具                      │
│   Next.js        │  tRPC                     │
│   Nuxt           │  TypeScript ESLint        │
│   SvelteKit      │  ts-reset                 │
│   Remix          │  ts-pattern               │
└──────────────────┴──────────────────────────┘
```

### 编译工具对比

| 工具 | 编译速度 | 类型检查 | 用途 |
|------|---------|---------|------|
| **tsc** | 慢 | ✅ | 官方编译器 |
| **swc** | 快 | ❌ | Rust 编写的转译器 |
| **esbuild** | 极快 | ❌ | Go 编写的打包器 |
| **sucrase** | 极快 | ❌ | 开发环境 |

推荐：开发用 `tsc --noEmit` 检查类型，构建用 `swc` 或 `esbuild` 编译。

### 运行时类型验证

```ts
// Zod —— 类型安全的运行时验证（推荐）
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
  role: z.enum(['admin', 'user']).default('user'),
})

type User = z.infer<typeof UserSchema>
// 自动推导为 { id: string; email: string; age?: number; role: 'admin' | 'user' }

const result = UserSchema.parse(data)  // 运行时验证
```

### tRPC —— 端到端类型安全 API

```ts
// Server
const appRouter = t.router({
  user: t.procedure.input(z.string()).query(({ input }) => {
    return db.user.find(input)
  }),
})

// Client（自动类型推导）
const user = await trpc.user.query('123')
```

### tsconfig 严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### Valibot 替代方案

```ts
import { object, string, number, optional, enum as vEnum, email, minLength, maxLength } from 'valibot'

const UserSchema = object({
  id: string([email()]),
  email: string([email()]),
  age: optional(number([minLength(0), maxLength(150)])),
  role: vEnum(['admin', 'user']),
})
```

# TypeScript 进阶深入

## 条件类型深度

### infer 高级用法

```ts
// 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never

// 提取 Promise 值类型
type Unwrap<T> = T extends Promise<infer U> ? U : T
type A = Unwrap<Promise<string>>  // string
type B = Unwrap<number>           // number

// 提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : never
type C = ElementType<string[]>  // string

// 提取构造函数实例类型
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never
```

### 递归条件类型

```ts
// 深层可空
type DeepNullable<T> = T extends object
  ? { [P in keyof T]: DeepNullable<T[P]> | null }
  : T | null

// JSON 路径
type Path<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? `${Prefix}${K}` | Path<T[K], `${Prefix}${K}.`>
        : never
    }[keyof T]
  : never
```

### 分布式条件类型

当条件类型作用于裸泛型参数时，会自动分发到联合类型的每个成员：

```ts
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]

// 从联合类型中排除 null/undefined
type NonNull<T> = T extends null | undefined ? never : T
type D = NonNull<string | null | undefined>  // string

// 过滤特定类型
type FilterNumber<T> = T extends number ? T : never
type E = FilterNumber<string | number | boolean>  // number
```

## 映射类型进阶

### key remapping 与 as 子句

```ts
// 给所有属性添加前缀
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
type UserGetters = Getters<{ name: string; age: number }>
// { getName: () => string; getAge: () => number }

// 过滤特定键
type Methods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

// Pick 的反向操作 — 排除某些键
type ExcludeKeys<T, K> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

### Union 转 Tuple（高级技巧）

```ts
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type LastOfUnion<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

type UnionToTuple<T, Last = LastOfUnion<T>> =
  [T] extends [never] ? [] : [...UnionToTuple<Exclude<T, Last>>, Last]
```

## 模板字面量类型

```ts
type EventName = `on${Capitalize<string>}`
type Events = 'click' | 'focus' | 'blur'
type Handlers = `handle${Capitalize<Events>}`
// 'handleClick' | 'handleFocus' | 'handleBlur'
```

### Parse URL Params

```ts
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never

type Params = ExtractParams<'/user/:id/post/:postId'>
// 'id' | 'postId'

type BuildParams<T extends string> = {
  [K in ExtractParams<T>]: string
}
```

### CSS Type System

```ts
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = `${number}${CSSUnit}`

type Spacing = 'sm' | 'md' | 'lg'
type Color = 'red' | 'blue' | 'green'
type CSSClass = `${Spacing}-${Color}`
// 'sm-red' | 'sm-blue' | 'sm-green' | 'md-red' | ...
```

## 逆变与协变

```ts
// 协变：返回值类型
type ReturnCovariant<T> = () => T
// T 协变：() => Dog 可赋值给 () => Animal

// 逆变：参数类型
type ParamContravariant<T> = (x: T) => void
// T 逆变：(x: Animal) => void 可赋值给 (x: Dog) => void

// Function parameter bivariance（strictFunctionTypes: false 时允许双变）
// 默认 strictFunctionTypes: true 时参数是逆变的

// 类型安全的 API builder（利用逆变）
interface APIBuilder<T> {
  get(): T
  post<U>(data: U): APIBuilder<T | U>
  then<U>(fn: (value: T) => U): APIBuilder<U>
}
```

## 装饰器

### 类装饰器

```ts
function sealed<T extends { new (...args: any[]): {} }>(constructor: T) {
  Object.freeze(constructor)
  Object.freeze(constructor.prototype)
}

@sealed
class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }
}
```

### 方法装饰器

```ts
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args)
    return original.apply(this, args)
  }
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}
```

### 参数装饰器

```ts
function validate(target: any, propertyKey: string, parameterIndex: number) {
  const existing = Reflect.getOwnMetadata('validators', target, propertyKey) ?? []
  existing.push(parameterIndex)
  Reflect.defineMetadata('validators', existing, target, propertyKey)
}
```

### 装饰器工厂

```ts
function delay(ms: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
      console.log(`Delaying ${propertyKey} by ${ms}ms`)
      return new Promise(resolve => setTimeout(() => resolve(original.apply(this, args)), ms))
    }
  }
}
```

## Declaration Merging 实战

```ts
// 接口合并
interface Box {
  content: string
}
interface Box {
  size: number
}
const b: Box = { content: 'hello', size: 42 }

// 枚举合并
enum Color { Red }
enum Color { Green }
// Color.Red, Color.Green 都可用

// 模块增强
import { Observable } from 'rxjs'
declare module 'rxjs' {
  interface Observable<T> {
    customOperator(): Observable<T>
  }
}
```

## 类型体操常见模式

### 递归类型

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

### ParseInt（字符串转数字）

```ts
type ParseInt<T extends string> = T extends `${infer N extends number}` ? N : never
type A = ParseInt<'42'>  // 42
```

### Tuple to Union

```ts
type TupleToUnion<T extends any[]> = T[number]
type Test = TupleToUnion<[string, number, boolean]>  // string | number | boolean
```

### Union to Intersection

```ts
type UnionToIntersection<T> =
  (T extends any ? (x: T) => void : never) extends (x: infer R) => void ? R : never
```

## satisfies 关键字

```ts
// satisfies 在不改变类型推断的前提下验证类型
type Colors = 'red' | 'green' | 'blue'
type ColorMap = Record<string, Colors>

const palette = {
  primary: 'red',
  secondary: 'green',
  tertiary: 'blue',
} satisfies ColorMap

// palette.primary 的类型是 'red'（字面量），而不是 string
// 如果某个值不是 Colors，编译报错
```

## 官方文档

本节涉及条件类型、映射类型、逆变协变、装饰器与类型体操，以 TypeScript 官方文档为准。

| 主题 | 链接 |
|------|------|
| 类型手册 | [TypeScript 手册](https://www.typescriptlang.org/docs/handbook/intro.html) |
| 类型系统 | [条件类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) · [映射类型](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) · [模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) |
| 类型兼容性 | [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) |
| 装饰器 | [TypeScript 装饰器](https://www.typescriptlang.org/docs/handbook/decorators.html) · [TC39 Decorators 提案](https://github.com/tc39/proposal-decorators) |
| 工具类型 | [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) |
| 类型实践 | [Type Challenges](https://github.com/type-challenges/type-challenges) |

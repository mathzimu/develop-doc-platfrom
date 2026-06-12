# TypeScript 基础语法

TypeScript 是 JavaScript 的超集，添加了静态类型系统。TypeScript 代码需要编译为 JavaScript 后运行。

```sh
npm install -g typescript
tsc --version
tsc file.ts          # 编译为 file.js
tsc --init           # 生成 tsconfig.json
```

## 基础类型

```ts
// 基本类型
let name: string = 'TypeScript'
let age: number = 5
let isReady: boolean = true
let nothing: null = null
let undefinedVar: undefined = undefined
let anything: any = '可以是任何类型'  // 避免使用

// 联合类型
let id: string | number = 'abc123'

// 字面量类型
let direction: 'left' | 'right' | 'up' | 'down' = 'left'

// 类型推断
let message = 'Hello'  // 自动推断为 string

// bigint（ES2020+）
let big: bigint = 100n

// symbol
let sym: symbol = Symbol('unique')
```

## 数组与元组

```ts
// 数组
let nums: number[] = [1, 2, 3]
let strs: Array<string> = ['a', 'b', 'c']
let readonlyArr: readonly number[] = [1, 2, 3]

// 元组（固定长度、已知类型）
let tuple: [string, number, boolean] = ['hello', 42, true]
let point: [x: number, y: number] = [3, 4]  // 命名元组

// 可选元素
let optional: [string, number?] = ['test']
let spread: [string, ...number[]] = ['a', 1, 2, 3]
```

## 接口

```ts
interface User {
  id: number
  name: string
  email?: string       // 可选属性
  readonly createdAt: Date  // 只读
}

interface Admin extends User {
  role: 'admin' | 'superadmin'
  permissions: string[]
}

const user: User = {
  id: 1,
  name: 'Alice',
  createdAt: new Date(),
}

// 函数类型接口
interface SearchFunc {
  (source: string, subString: string): boolean
}

// 索引签名
interface StringMap {
  [key: string]: string
}
```

## 类型别名

```ts
type Point = {
  x: number
  y: number
}

type ID = string | number

type Callback = (data: string) => void

// 联合类型
type Status = 'idle' | 'loading' | 'success' | 'error'

// 交叉类型
type Named = { name: string }
type Aged = { age: number }
type Person = Named & Aged  // 同时具有 name 和 age
```

### Interface vs Type

| 特性 | Interface | Type |
|------|-----------|------|
| 声明合并 | 支持 | 不支持 |
| 继承 | `extends` | `&` 交叉 |
| 联合类型 | 不支持 | 支持 |
| 映射类型 | 不支持 | 支持 |
| 工具类型 | `Pick`, `Omit` 等 | 同 |

## 函数

```ts
// 参数与返回值类型
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b

// 可选参数
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hello'}, ${name}!`
}

// 默认参数
function createUrl(base: string, port: number = 443): string {
  return `${base}:${port}`
}

// 剩余参数
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

// void 返回值
function log(message: string): void {
  console.log(message)
}

// never 返回值（永远不会返回）
function throwError(message: string): never {
  throw new Error(message)
}

// 函数重载
function process(x: number): number
function process(x: string): string
function process(x: number | string): number | string {
  if (typeof x === 'number') return x * 2
  return x.toUpperCase()
}
```

## 类

```ts
abstract class Animal {
  constructor(public name: string) {}  // 自动创建属性

  abstract speak(): void  // 抽象方法

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name)
  }

  speak(): void {
    console.log('Woof!')
  }
}

// 访问修饰符
class Person {
  public name: string       // 公开（默认）
  private ssn: string       // 私有（仅本类）
  protected age: number     // 受保护（本类及子类）
  readonly id: number       // 只读

  // 静态属性
  static population = 0

  // 静态方法
  static create(name: string): Person {
    const p = new Person()
    p.name = name
    return p
  }

  // getter / setter
  get displayName(): string {
    return this.name.toUpperCase()
  }

  set displayName(value: string) {
    this.name = value.trim()
  }
}
```

## 泛型

```ts
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型接口
interface Box<T> {
  value: T
  label: string
}

// 泛型约束
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length)
  return arg
}

// 泛型类
class Stack<T> {
  private items: T[] = []
  push(item: T) { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
  peek(): T | undefined { return this.items[this.items.length - 1] }
  get size(): number { return this.items.length }
}

// 多泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

// 实用工具类型
type Partial<T> = { [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## 枚举

```ts
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// 异构枚举
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}

// const 枚举（编译后内联）
const enum Color {
  Red, Green, Blue,
}

// 反向映射（仅数字枚举）
enum LogLevel {
  Error, Warn, Info, Debug,
}
console.log(LogLevel[0])  // 'Error'
```

## 类型守卫

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: string | number) {
  if (isString(value)) {
    value.toUpperCase()  // TS 知道此处是 string
  }
}

// typeof 守卫
if (typeof value === 'string') { /* ... */ }

// instanceof 守卫
if (value instanceof Date) { /* ... */ }

// in 守卫
if ('age' in person) { /* ... */ }

// 断言守卫
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Expected value to be defined')
  }
}
```

## 模块

```ts
// math.ts
export const PI = 3.14159
export function area(r: number): number {
  return PI * r * r
}
export default class Calculator {}

// app.ts
import Calculator, { PI, area as circleArea } from './math.js'
import * as MathUtil from './math.js'
import type { User } from './types'  // type-only import
import { type User, type Config } from './types'  // inline type import
```

## tsconfig.json 关键选项

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

| 选项 | 说明 |
|------|------|
| `target` | 编译目标 ECMAScript 版本 |
| `module` | 模块系统 |
| `strict` | 启用所有严格类型检查 |
| `outDir` | 编译输出目录 |
| `rootDir` | 源代码根目录 |
| `declaration` | 生成 `.d.ts` 类型声明 |
| `sourceMap` | 生成源码映射 |
| `skipLibCheck` | 跳过 `.d.ts` 类型检查（加速编译） |
| `esModuleInterop` | 兼容 CommonJS 和 ES Module 互操作 |

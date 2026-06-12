# JavaScript 进阶深入

## 原型链与继承详解

```js
// 原型链本质
const obj = {}
console.log(obj.__proto__)           // Object.prototype
console.log(obj.__proto__.__proto__) // null

// Object.create 实现原型式继承
const animal = { speak() { console.log('...') } }
const dog = Object.create(animal)
dog.bark = function() { console.log('Woof!') }
dog.bark()  // Woof!
dog.speak() // ...（从原型链获取）

// class 的底层仍是原型链
class Parent {
  constructor(name) { this.name = name }
  greet() { return `Hi, ${this.name}` }
}
class Child extends Parent {
  constructor(name, age) {
    super(name)  // 相当于 Parent.call(this, name)
    this.age = age
  }
}
console.log(Child.prototype.__proto__ === Parent.prototype) // true
```

### 原型链查找机制

```js
// 属性查找顺序：自身 → 原型 → 原型的原型 → ... → null
function Foo() {}
Foo.prototype.value = 1
const a = new Foo()
a.value = 2
console.log(a.value) // 2（自身属性优先）
delete a.value
console.log(a.value) // 1（回溯到原型）
delete Foo.prototype.value
console.log(a.value) // undefined（回溯到尽头）
```

## 深入 this 绑定

```js
// 绑定优先级：new > 显式(bind) > 隐式 > 默认
function log() { console.log(this.name) }

const obj1 = { name: 'obj1', log }
const obj2 = { name: 'obj2' }

// 隐式绑定
obj1.log()                // 'obj1'

// 显式绑定优先级高于隐式
obj1.log.bind(obj2)()     // 'obj2'

// new 绑定优先级最高
function User(name) {
  this.name = name
}
const u = new User('new')
console.log(u.name)       // 'new'

// 箭头函数 this 继承外层作用域，不可覆盖
const obj3 = {
  name: 'obj3',
  arrow: () => console.log(this.name),
  normal() { console.log(this.name) },
}
obj3.arrow()   // undefined（继承全局 this）
obj3.normal()  // 'obj3'
```

### 手写 call / apply / bind

```js
Function.prototype.myCall = function(ctx, ...args) {
  ctx = ctx ?? globalThis
  const key = Symbol('fn')
  ctx[key] = this
  const result = ctx[key](...args)
  delete ctx[key]
  return result
}

Function.prototype.myBind = function(ctx, ...bound) {
  const fn = this
  return function(...args) {
    return fn.apply(ctx, [...bound, ...args])
  }
}
```

## Promise 链式调用深入

```js
// 链式传递
Promise.resolve(1)
  .then(x => x + 1)           // 2
  .then(x => Promise.resolve(x * 2)) // 4
  .then(console.log)          // 4

// 错误传播
Promise.resolve(1)
  .then(() => { throw new Error('fail') })
  .then(() => console.log('跳过'))  // 跳过
  .catch(err => { console.log(err.message); return 'recovered' })
  .then(val => console.log(val))   // 'recovered'

// Promise.all 内部机制
const promises = [1, 2, 3].map(x => Promise.resolve(x))
Promise.all(promises).then(console.log) // [1, 2, 3]

// Promise.race —— 第一个完成的结果
const slow = new Promise(r => setTimeout(() => r('慢'), 1000))
const fast = new Promise(r => setTimeout(() => r('快'), 100))
Promise.race([slow, fast]).then(console.log) // '快'

// Promise.allSettled —— 所有结果（含失败）
const results = await Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject('err'),
])
// [{ status: 'fulfilled', value: 'ok' }, { status: 'rejected', reason: 'err' }]
```

## async/await 错误处理模式

```js
// try/catch 包装器
async function safeAsync(fn) {
  try {
    return [null, await fn()]
  } catch (err) {
    return [err, null]
  }
}
const [err, data] = await safeAsync(() => fetch('/api/data'))

// Promise 超时
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Operation timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

// 重试模式
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === retries - 1) throw err
    }
  }
}
```

## 迭代器与生成器

```js
// Iterator protocol
const iterable = {
  data: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => ({
        value: this.data[index++],
        done: index > this.data.length,
      }),
    }
  },
}
for (const x of iterable) console.log(x) // 'a', 'b', 'c'

// Generator（生成器）
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}
const gen = range(1, 3)
console.log([...gen]) // [1, 2, 3]

// 异步生成器
async function* fetchPages(urls) {
  for (const url of urls) {
    const res = await fetch(url)
    yield res.json()
  }
}
for await (const page of fetchPages(['/api/page1', '/api/page2'])) {
  console.log(page)
}
```

## Proxy 与 Reflect

```js
// 数据绑定与响应式
const handler = {
  get(target, key) {
    console.log(`读取 ${key}`)
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    console.log(`设置 ${key} = ${value}`)
    return Reflect.set(target, key, value)
  },
  has(target, key) {
    console.log(`检查 ${key}`)
    return Reflect.has(target, key)
  },
  deleteProperty(target, key) {
    console.log(`删除 ${key}`)
    return Reflect.deleteProperty(target, key)
  },
}

const data = new Proxy({ count: 0 }, handler)
data.count      // 读取 count
data.count = 1  // 设置 count = 1
'count' in data // 检查 count
delete data.count // 删除 count

// 简易响应式系统
function reactive(obj) {
  const subscribers = new Map()
  return new Proxy(obj, {
    get(target, key) {
      track(key, subscribers)
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      Reflect.set(target, key, value)
      trigger(key, subscribers)
      return true
    },
  })
}
```

## 设计模式

```js
// 发布订阅（EventEmitter）
class EventEmitter {
  constructor() { this.events = new Map() }
  on(name, fn) {
    if (!this.events.has(name)) this.events.set(name, [])
    this.events.get(name).push(fn)
  }
  emit(name, ...args) {
    this.events.get(name)?.forEach(fn => fn(...args))
  }
  off(name, fn) {
    const fns = this.events.get(name)
    if (fns) this.events.set(name, fns.filter(f => f !== fn))
  }
}

// 单例模式
const Singleton = (function() {
  let instance
  return class {
    constructor() {
      if (instance) return instance
      instance = this
    }
  }
})()

// 工厂模式
class Button { render() { return '<button>' } }
class Input { render() { return '<input>' } }

class UIFactory {
  static create(type) {
    switch (type) {
      case 'button': return new Button()
      case 'input':  return new Input()
      default: throw new Error('Unknown type')
    }
  }
}

// 适配器模式
class OldAPI { getData() { return { name: 'old' } } }
class NewAPI { fetch() { return Promise.resolve({ name: 'new' }) } }

class Adapter {
  constructor(api) { this.api = api }
  getData() {
    return this.api instanceof NewAPI
      ? this.api.fetch()
      : Promise.resolve(this.api.getData())
  }
}
```

## Web Worker 与多线程

```js
// main.js
const worker = new Worker('worker.js', { type: 'module' })
worker.postMessage({ type: 'compute', data: 1000000000 })
worker.onmessage = (e) => console.log('结果:', e.data)
worker.onerror = (e) => console.error('Worker 错误:', e.message)
worker.terminate()

// worker.js - 非阻塞计算
self.onmessage = function(e) {
  const { type, data } = e.data
  if (type === 'compute') {
    let result = 0
    for (let i = 0; i < data; i++) result += i
    self.postMessage(result)
  }
}

// SharedArrayBuffer（跨线程共享内存）
const buffer = new SharedArrayBuffer(4)
const view = new Int32Array(buffer)
Atomics.store(view, 0, 42)
Atomics.add(view, 0, 1)   // 原子操作
console.log(Atomics.load(view, 0)) // 43
```

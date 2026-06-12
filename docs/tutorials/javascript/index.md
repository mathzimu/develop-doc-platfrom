# JavaScript 教程

JavaScript 是一种轻量级的解释型（或 JIT 编译）编程语言，是 Web 开发的三大核心技术之一，为网页添加交互与动态行为。

## 基础语法

### 变量声明

```js
// var - 函数作用域，避免使用
var old = '不推荐';

// let - 块级作用域，可重新赋值
let count = 0;
count = 1;

// const - 块级作用域，不可重新赋值
const PI = 3.14159;
const user = { name: 'Alice' };
user.name = 'Bob';  // 对象内容可修改
```

| 声明 | 作用域 | 可重新赋值 | 提升 | 推荐 |
|------|--------|-----------|------|------|
| `var` | 函数级 | 是 | 是 | 不推荐 |
| `let` | 块级 | 是 | 否（暂存死区） | 可变变量 |
| `const` | 块级 | 否 | 否（暂存死区） | 默认首选 |

### 数据类型

```js
// 基本类型（不可变）
const str = 'string'          // 字符串
const num = 42                // 数字
const big = 9007199254740991n // BigInt
const bool = true             // 布尔
const und = undefined          // 未定义
const nul = null               // 空值
const sym = Symbol('unique')  // 符号

// 引用类型（可变）
const arr = [1, 2, 3]         // 数组
const obj = { key: 'value' }  // 对象
const fn = () => {}           // 函数
const date = new Date()       // Date
const reg = /test/gi          // 正则
const map = new Map()         // Map
const set = new Set()         // Set

// 类型检查
typeof 'hello'        // 'string'
typeof 42            // 'number'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof null          // 'object'（历史遗留 bug）
typeof []            // 'object'
Array.isArray([])    // true
```

### 类型转换

```js
// 显式转换
String(123)          // '123'
Number('123')        // 123
Boolean(1)           // true
parseInt('42px')     // 42
parseFloat('3.14')   // 3.14

// 隐式转换（注意）
'5' - 2              // 3
'5' + 2              // '52'（+ 也是字符串拼接）
!'hello'             // false
!!'hello'            // true

// 假值
false, 0, '', null, undefined, NaN
```

### 运算符

```js
// 算术
+ - * / % **         // 加 减 乘 除 取余 幂

// 赋值
= += -= *= /= **=

// 比较
== != === !== > < >= <=

// 逻辑
&& || ??             // AND OR 空值合并
??=                  // 空值赋值

// 可选链
user?.address?.city  // 安全访问嵌套属性

// 展开
const copy = [...arr]
const merged = { ...obj1, ...obj2 }
```

## 字符串

```js
const str = 'Hello'
str.length                // 5
str[0]                    // 'H'
str.charAt(0)             // 'H'
str.includes('ell')       // true
str.startsWith('He')      // true
str.endsWith('lo')        // true
str.indexOf('l')          // 2
str.slice(0, 2)           // 'He'
str.substring(0, 2)       // 'He'
str.toUpperCase()         // 'HELLO'
str.toLowerCase()         // 'hello'
str.replace('l', 'x')     // 'Hexlo'
str.replaceAll('l', 'x')  // 'Hexxo'
str.trim()                // 去首尾空格
str.split(',')            // 拆分数组

// 模板字面量
const name = 'World'
const greeting = `Hello, ${name}!`  // 'Hello, World!'
const multiline = `
  多行
  字符串
`
```

## 数组

```js
const arr = [3, 1, 4, 1, 5]

arr.length               // 5
arr[0]                   // 3
arr.at(-1)               // 5（支持负数索引）
arr.push(9)              // 末尾添加，返回新长度
arr.pop()                // 末尾移除，返回移除元素
arr.unshift(0)           // 开头添加
arr.shift()              // 开头移除
arr.includes(1)          // true
arr.indexOf(4)           // 2
arr.find(x => x > 3)     // 4（第一个匹配）
arr.findIndex(x => x > 3) // 2
arr.some(x => x > 4)     // true（任一满足）
arr.every(x => x > 0)    // true（全部满足）

// 迭代方法（不修改原数组）
arr.forEach(x => console.log(x))
arr.map(x => x * 2)        // [6,2,8,2,10]
arr.filter(x => x > 2)     // [3,4,5]
arr.reduce((a, b) => a + b, 0) // 14
arr.sort((a, b) => a - b)  // [1,1,3,4,5]
arr.reverse()
arr.slice(1, 3)            // [1,4]

// 解构
const [first, second] = arr
const [head, ...tail] = arr  // head=3, tail=[1,4,1,5]
```

## 对象

```js
const user = {
  name: 'Alice',
  age: 30,
  'full-name': 'Alice Wang',  // 键名含连字符需引号
  greet() {                    // 方法简写
    return `Hi, I'm ${this.name}`
  },
}

// 访问
user.name          // 'Alice'
user['full-name']  // 'Alice Wang'

// 修改
user.age = 31
user.email = 'alice@example.com'
delete user.age

// 检查
'name' in user     // true
user.hasOwnProperty('name')  // true

// 遍历
Object.keys(user)      // ['name', 'age', ...]
Object.values(user)    // ['Alice', 30, ...]
Object.entries(user)   // [['name','Alice'], ['age',30], ...]

// 解构
const { name, age, email = 'default@email.com' } = user
const { name: userName } = user  // 重命名
```

## 函数

```js
// 函数声明（提升）
function add(a, b) { return a + b }

// 函数表达式
const add = function(a, b) { return a + b }

// 箭头函数（不绑定 this）
const add = (a, b) => a + b
const square = x => x * x
const noParam = () => 42

// 默认参数
function greet(name = 'Guest') { return `Hello ${name}` }

// 剩余参数
function sum(...nums) { return nums.reduce((a, b) => a + b) }

// 立即执行函数
;(function() { console.log('IIFE') })()
;(() => console.log('arrow IIFE'))()
```

## 闭包与作用域

```js
// 闭包：函数可以访问其外部作用域的变量
function createCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = createCounter()
counter()  // 1
counter()  // 2

// 实用的闭包：防抖
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
function throttle(fn, interval) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}
```

## this 绑定

```js
// 默认绑定（全局对象，严格模式为 undefined）
function show() { console.log(this) }

// 隐式绑定
const obj = { name: 'obj', show }
obj.show()  // obj

// 显式绑定
show.call(obj, arg1, arg2)
show.apply(obj, [arg1, arg2])
const bound = show.bind(obj)

// new 绑定
function Person(name) { this.name = name }

// 箭头函数：无 this，继承外层
const arrow = () => console.log(this)
```

## Promise 与异步

```js
// 创建 Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    success ? resolve('数据') : reject(new Error('失败'))
  }, 1000)
})

// 消费 Promise
fetchData
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('完成'))

// async/await（更优雅）
async function loadData() {
  try {
    const data = await fetchData
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

// 并发
const [users, posts] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
])

const result = await Promise.race([fetch('/api'), timeout(5000)])
const allSettled = await Promise.allSettled([...])  // 不 reject
```

## DOM 操作

```js
// 获取元素
document.getElementById('app')
document.querySelector('.container')    // 第一个匹配
document.querySelectorAll('.item')      // NodeList（可用 forEach）
document.getElementsByClassName('card') // HTMLCollection

// 创建与插入
const div = document.createElement('div')
div.textContent = 'Hello'
div.className = 'highlight'
div.id = 'myDiv'
div.setAttribute('data-id', '42')

parent.appendChild(div)
parent.prepend(div)        // 开头插入
parent.insertBefore(div, refNode)
parent.replaceChild(div, oldChild)
div.remove()

// 更现代的插入方式
div.insertAdjacentHTML('beforebegin', '<p>之前</p>')
div.insertAdjacentHTML('afterend', '<p>之后</p>')

// 类操作
el.classList.add('active')
el.classList.remove('hidden')
el.classList.toggle('visible')
el.classList.contains('active')

// 样式操作
el.style.color = 'red'
el.style.backgroundColor = '#f0f0f0'  // 驼峰命名
el.style.cssText = 'color: red; font-size: 16px;'
```

## 事件

```js
// 添加事件
element.addEventListener('click', handler, options)
element.addEventListener('click', handler, { once: true })  // 只执行一次
element.removeEventListener('click', handler)

// 事件对象
element.addEventListener('click', (e) => {
  e.preventDefault()      // 阻止默认行为
  e.stopPropagation()     // 阻止冒泡
  e.stopImmediatePropagation() // 阻止所有后续事件
  console.log(e.target)        // 触发元素
  console.log(e.currentTarget) // 绑定元素
})

// 事件委托
parent.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('点击了 item')
  }
})

// 常用事件
click, dblclick, mouseover, mouseout, mousedown, mouseup
keydown, keyup, keypress
submit, change, input, focus, blur
scroll, resize, load, DOMContentLoaded
touchstart, touchmove, touchend
```

## ES6+ 重要特性

### 模块

```js
// 导出 (math.js)
export const PI = 3.14
export function add(a, b) { return a + b }
export default class Calculator {}

// 导入 (app.js)
import Calculator, { PI, add as sum } from './math.js'
import * as Math from './math.js'
```

### 类

```js
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() { console.log(`${this.name} makes a sound`) }
  static create(name) { return new Animal(name) }
}

class Dog extends Animal {
  constructor(name) {
    super(name)
  }
  speak() { console.log('Woof!') }
}
```

### Map 与 Set

```js
const map = new Map()
map.set('key', 'value')
map.get('key')
map.has('key')
map.delete('key')

const set = new Set([1, 2, 2, 3])  // {1, 2, 3}
set.add(4)
set.has(2)
set.delete(1)
```

### 正则表达式

```js
const regex = /^[a-z]+@[a-z]+\.[a-z]{2,}$/i
regex.test('user@example.com')  // true
'hello123'.match(/\d+/)         // ['123']
'line1\nline2'.match(/^line/m)  // 多行模式
```

## 错误处理

```js
try {
  // 可能抛出错误的代码
  throw new Error('自定义错误')
} catch (err) {
  console.error(err.message)
  console.error(err.stack)
} finally {
  // 无论是否异常都执行
}

// 自定义错误类
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}
```

## 性能优化建议

1. **批量 DOM 操作**：使用 `documentFragment` 或拼接后一次性插入
2. **事件委托**：减少事件监听器数量
3. **防抖与节流**：控制高频触发的事件
4. **懒加载**：图片和组件按需加载
5. **缓存 DOM 查询**：重复使用的元素存为变量
6. **避免内存泄漏**：及时移除事件监听和定时器
7. **使用 `===` 而非 `==`**：避免隐式类型转换
8. **合理使用数据结构**：大量唯一值用 Set，键值对用 Map

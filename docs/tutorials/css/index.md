# CSS 教程

CSS（Cascading Style Sheets）用于控制 HTML 元素的显示样式和布局。CSS 让内容与表现分离，使网页更易于维护。

## 引入方式

```html
<!-- 1. 外部样式表（推荐） -->
<link rel="stylesheet" href="style.css">

<!-- 2. 内部样式表 -->
<style>
  body { font-family: sans-serif; }
</style>

<!-- 3. 行内样式（避免使用） -->
<p style="color: red;">红色文字</p>
```

## 选择器

### 基本选择器

```css
/* 元素选择器 */
p { color: blue; }

/* 类选择器 */
.card { border: 1px solid #ddd; }

/* ID 选择器 */
#header { background: #333; }

/* 通配选择器 */
* { box-sizing: border-box; }

/* 属性选择器 */
[type="text"] { border: 1px solid #ccc; }
[href^="https"] { color: green; }
[src$=".png"] { border: 0; }
[class*="icon"] { width: 16px; }
```

### 组合选择器

```css
/* 后代选择器（空格） */
article p { line-height: 1.6; }

/* 子选择器（>） */
ul > li { list-style: none; }

/* 相邻兄弟（+） */
h2 + p { margin-top: 0; }

/* 通用兄弟（~） */
h2 ~ p { color: gray; }

/* 组合 */
div.card, section.highlight { padding: 16px; }
```

### 伪类与伪元素

```css
/* 伪类：状态 */
a:hover { color: red; }
a:active { color: orange; }
a:visited { color: purple; }
input:focus { outline: 2px solid blue; }
li:first-child { font-weight: bold; }
li:last-child { border: none; }
li:nth-child(odd) { background: #f5f5f5; }
li:nth-child(3n+1) { color: red; }

/* 伪元素：内容片段 */
p::first-line { font-size: 1.2em; }
p::first-letter { font-size: 2em; }
::selection { background: yellow; }
.element::before { content: "→ "; }
.element::after { content: " ←"; }

/* :not() 否定 */
input:not([type="submit"]) { border: 1px solid #ccc; }

/* :has() 父级选择 */
figure:has(img) { padding: 10px; }
```

## 盒模型

每个元素占据一个矩形盒子，由内到外依次为：

```
┌──────────────────────────────┐
│          margin              │
│  ┌────────────────────────┐  │
│  │       border           │  │
│  │  ┌──────────────────┐  │  │
│  │  │     padding      │  │  │
│  │  │  ┌────────────┐  │  │  │
│  │  │  │  content   │  │  │  │
│  │  │  └────────────┘  │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

```css
.box {
  width: 200px;           /* 内容区宽度 */
  padding: 20px;          /* 内边距 */
  border: 2px solid #000; /* 边框 */
  margin: 10px;           /* 外边距 */

  /* 标准盒模型：width = 内容区宽度 */
  /* border-box：width 包含 padding + border */
  box-sizing: border-box;
}
```

**重要**：建议全局设置 `box-sizing: border-box`：

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 颜色与单位

### 颜色表示

```css
.color-examples {
  color: red;                    /* 命名颜色 */
  color: #ff0000;                /* 十六进制 */
  color: #f00;                   /* 简写 */
  color: rgb(255, 0, 0);         /* RGB */
  color: rgba(255, 0, 0, 0.5);  /* RGBA（带透明度） */
  color: hsl(0, 100%, 50%);     /* HSL */
  color: hsla(0, 100%, 50%, 0.5); /* HSLA */
  color: oklch(0.6, 0.25, 30);   /* OKLCH（更广色域） */
}
```

### CSS 单位

| 单位 | 类型 | 说明 |
|------|------|------|
| `px` | 绝对 | 像素 |
| `em` | 相对 | 相对于父元素字体大小 |
| `rem` | 相对 | 相对于根元素字体大小 |
| `%` | 相对 | 相对于父元素同属性值 |
| `vw` | 视口 | 视口宽度的 1% |
| `vh` | 视口 | 视口高度的 1% |
| `vmin` | 视口 | `vw` 和 `vh` 中较小的 |
| `vmax` | 视口 | `vw` 和 `vh` 中较大的 |
| `ch` | 相对 | 数字 "0" 的宽度 |
| `fr` | Grid | Grid 剩余空间分配单位 |

```css
.unit-examples {
  font-size: 16px;
  padding: 1em;        /* = 16px */
  margin: 2rem;        /* = 32px（相对于根字体） */
  width: 50%;          /* 父元素宽度的一半 */
  height: 100vh;       /* 全屏高度 */
  max-width: 1200px;
  font-size: clamp(14px, 2vw, 20px); /* 响应式字号 */
}
```

## Flexbox 布局

Flexbox 是一维布局模型，适合行或列的排列。

```css
.container {
  display: flex;           /* 启用 Flexbox */
  flex-direction: row;     /* row | column | row-reverse | column-reverse */
  flex-wrap: wrap;         /* nowrap | wrap | wrap-reverse */
  justify-content: center; /* 主轴对齐 */
  align-items: center;     /* 交叉轴对齐 */
  gap: 16px;               /* 间距 */
}

.item {
  flex: 1;                 /* flex-grow flex-shrink flex-basis */
  flex: 0 0 200px;         /* 不伸缩，固定 200px */
  align-self: flex-end;    /* 单独对齐 */
  order: -1;               /* 排序 */
}
```

### justify-content 取值

```
flex-start     ┌──┬──┬──┐
center         ┌──┬──┬──┐
flex-end       ┌──┬──┬──┐
space-between  ┌──┐──┌──┐──┌──┐
space-around   ┌──┐──┌──┐──┌──┐
space-evenly   ┌──┐──┌──┐──┌──┐
```

## Grid 布局

Grid 是二维布局模型，同时处理行和列。

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* 三列 */
  grid-template-rows: auto 200px auto;  /* 三行 */
  gap: 16px;                            /* 间距 */
}

/* 命名区域 */
.grid-container {
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }

/* 跨行跨列 */
.featured {
  grid-column: 1 / -1;  /* 从第一列到最后一列 */
  grid-row: span 2;     /* 跨越两行 */
}

/* auto-fill 与 auto-fit */
.grid-container {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

## 定位

```css
/* 静态定位（默认） */
.static { position: static; }

/* 相对定位：相对自身原来位置偏移 */
.relative {
  position: relative;
  top: 10px;
  left: 20px;
}

/* 绝对定位：相对于最近的定位祖先 */
.absolute {
  position: absolute;
  top: 0;
  right: 0;
}

/* 固定定位：相对于视口 */
.fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* 粘性定位：滚动到阈值后固定 */
.sticky {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### z-index 堆叠

```css
.layer-1 { z-index: 1; }    /* 底层 */
.layer-2 { z-index: 10; }   /* 中层 */
.layer-3 { z-index: 100; }  /* 顶层 */
```

## 响应式设计

### 媒体查询

```css
/* 手机（默认） */
.container { padding: 16px; }

/* 平板 ≥ 768px */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

/* 桌面 ≥ 1024px */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 960px;
    margin: 0 auto;
  }
}

/* 大屏 ≥ 1440px */
@media (min-width: 1440px) {
  .container { max-width: 1200px; }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  body { background: #1a1a2e; color: #e0e0e0; }
}

/* 减少动效 */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}

/* 打印样式 */
@media print {
  nav { display: none; }
}
```

### 移动端优先 vs 桌面端优先

```css
/* 移动端优先（推荐）：用 min-width */
.mobile-first {
  font-size: 14px;         /* 手机 */
}
@media (min-width: 768px) {
  .mobile-first { font-size: 16px; }  /* 平板+ */
}

/* 桌面端优先：用 max-width */
.desktop-first {
  font-size: 18px;         /* 桌面 */
}
@media (max-width: 767px) {
  .desktop-first { font-size: 14px; } /* 手机 */
}
```

## 常见 CSS 属性

### 文本样式

```css
.text-styling {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  font-weight: 400;        /* 100-900 */
  font-style: normal;      /* normal | italic */
  line-height: 1.6;
  text-align: center;      /* left | center | right | justify */
  text-decoration: none;   /* none | underline | line-through */
  text-transform: uppercase; /* uppercase | lowercase | capitalize */
  letter-spacing: 1px;     /* 字间距 */
  word-spacing: 2px;       /* 词间距 */
  white-space: nowrap;     /* 不换行 */
  text-overflow: ellipsis; /* 溢出省略号 */
  overflow: hidden;
  word-break: break-all;   /* 断词 */
}
```

### 背景与边框

```css
.background-example {
  background-color: #f0f0f0;
  background-image: url('bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;  /* cover | contain | auto */

  /* 简写 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 多重背景 */
  background:
    url('overlay.png') no-repeat center,
    linear-gradient(180deg, #fff, #f0f0f0);

  /* 边框 */
  border: 1px solid #ddd;
  border-radius: 8px;

  /* 阴影 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  /* 透明 */
  opacity: 0.8;
}
```

## 过渡与动画

```css
/* 过渡 */
.button {
  background: blue;
  color: white;
  transition: all 0.3s ease;
}
.button:hover {
  background: darkblue;
  transform: translateY(-2px);
}

/* 关键帧动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animated {
  animation: fadeIn 0.6s ease-out;
}

/* 关键帧动画进阶 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-20px); }
}

.bouncing {
  animation: bounce 1s ease-in-out infinite;
}

/* animation 完整属性 */
.element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: backwards;
  /* 简写 */
  animation: fadeIn 0.5s ease-out 0.2s 1 normal backwards;
}
```

## CSS 变量

```css
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --text: #1a1a2e;
  --bg: #ffffff;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.button {
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.button:hover {
  background: var(--primary-dark);
}

/* JS 修改变量 */
/* document.documentElement.style.setProperty('--primary', '#ef4444'); */
```

## 常见布局模式

### 居中

```css
/* 水平居中 */
.center-horizontal {
  margin: 0 auto;
  text-align: center;
}

/* 垂直居中（Flexbox） */
.center-vertical {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* 绝对定位居中 */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Grid 居中 */
.center-grid {
  display: grid;
  place-items: center;
}
```

### 两栏布局

```css
.two-column {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .two-column {
    grid-template-columns: 1fr;
  }
}
```

### 圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template:
    "header  header" auto
    "sidebar main" 1fr
    "footer  footer" auto
    / 200px 1fr;
  min-height: 100vh;
  gap: 0;
}
.holy-grail header  { grid-area: header; }
.holy-grail nav     { grid-area: sidebar; }
.holy-grail main    { grid-area: main; }
.holy-grail footer  { grid-area: footer; }
```

## CSS 优先级

从低到高：

1. 浏览器默认样式
2. 继承的样式
3. 通用选择器 `*`
4. 元素选择器 `div`, `p`
5. 类、属性、伪类选择器 `.class`, `[attr]`, `:hover`
6. ID 选择器 `#id`
7. 行内样式 `style="..."`
8. `!important`（尽可能避免使用）

```
优先级计算：
#id    = 0,1,0,0
.class = 0,0,1,0
div    = 0,0,0,1

#nav .item a:hover = 0,1,2,1
```

## 最佳实践

1. **使用 reset 或 normalize**：统一不同浏览器的默认样式
2. **简写属性**：使用 `margin`、`padding`、`background` 等简写
3. **避免 `!important`**：通过提高优先级解决，而非覆盖
4. **使用 class 而非 ID 选择样式**：class 可复用，优先级更易管理
5. **移动端优先**：先写手机样式，再用 `min-width` 媒体查询扩展
6. **使用 CSS 变量**：统一管理主题色、间距等常量
7. **避免冗余选择器**：`.container .wrapper .content p` → 简化
8. **善用 `gap`**：替代 `margin` 处理 Flexbox/Grid 子元素间距

---

# 企业级实践

## CSS 架构方法论

企业级项目需要可维护、可扩展的 CSS 架构。

### BEM（Block Element Modifier）

```css
/* Block：独立组件 */
.card { }

/* Element：依赖 Block 的子元素 */
.card__title { }
.card__content { }
.card__image { }

/* Modifier：状态或变体 */
.card--featured { }
.card--disabled { }
.card__title--large { }
```

```html
<div class="card card--featured">
  <h2 class="card__title card__title--large">标题</h2>
  <div class="card__content">内容</div>
</div>
```

### ITCSS（Inverted Triangle CSS）

按 specificity 从低到高分层组织：

```
1. Settings      —— 变量、配置
2. Tools         —— mixin、函数
3. Generic       —— reset、normalize
4. Elements      —— 裸元素样式（h1, a）
5. Objects       —— 布局类（grid, container）
6. Components    —— UI 组件（card, button）
7. Utilities     —— 工具类（.hidden, .text-center）
```

```scss
// 1. Settings
$primary: #3b82f6;
$breakpoint-md: 768px;

// 2. Tools
@mixin respond-to($bp) {
  @media (min-width: $bp) { @content; }
}

// 3. Generic
*, *::before, *::after { box-sizing: border-box; }

// 6. Components
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### CSS Modules

```css
/* Button.module.css */
.button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.primary { background: blue; }
.large { padding: 12px 24px; }
```

```tsx
import styles from './Button.module.css'

function Button({ variant, size, children }) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${styles[size]}`}>
      {children}
    </button>
  )
}
```

## 设计系统（Design System）

### 设计 Token

```css
:root {
  /* 颜色 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-text: #1a1a2e;
  --color-text-secondary: #64748b;
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-border: #e2e8f0;
  --color-error: #ef4444;
  --color-success: #22c55e;

  /* 间距（8px 基准） */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* 排版 */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 主题切换（深色模式）

```css
[data-theme="dark"] {
  --color-text: #e2e8f0;
  --color-bg: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-border: #334155;
}
```

```js
// 主题切换
const theme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', theme)

function toggleTheme() {
  const next = theme === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
}
```

## Critical CSS 策略

```js
// 提取首屏关键 CSS 内联到 HTML 中，其余异步加载
// 使用工具：critical (npm)、PurgeCSS

// 1. 构建时提取
// npx critical index.html --inline > output.html

// 2. 内联到 <head>
<style>
  /* 首屏渲染所需的 CSS（约 4-10KB） */
  header { background: #fff; }
  .hero { display: flex; ... }
</style>

// 3. 非关键 CSS 异步加载
<link rel="preload" href="/full.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/full.css"></noscript>
```

## PostCSS 与预处理器

### PostCSS 插件生态

| 插件 | 用途 |
|------|------|
| autoprefixer | 自动添加浏览器前缀 |
| postcss-preset-env | 使用未来的 CSS 语法 |
| cssnano | 压缩优化 |
| postcss-import | @import 内联 |
| tailwindcss | 工具类框架 |
| stylelint | CSS 代码检查 |

### PostCSS 配置

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-properties': { preserve: false },
      },
    }),
    require('autoprefixer'),
    require('cssnano')({ preset: 'default' }),
  ],
}
```

## 企业级响应式策略

```css
/* 断点系统 */
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

@mixin respond($bp) {
  @if map-has-key($breakpoints, $bp) {
    @media (min-width: map-get($breakpoints, $bp)) {
      @content;
    }
  }
}

// 组件级响应式
.card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond('lg') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Queries（容器查询）

```css
/* 基于容器大小而非视口 */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  .card__image { width: 200px; }
}
```

## 性能优化

```css
/* GPU 加速 */
.animated-element {
  transform: translateZ(0);  /* 触发 GPU 层 */
  will-change: transform;    /* 提前告知浏览器 */
}

/* 减少重排 */
/* ❌ 频繁触发重排 */
.element {
  top: 10px;
  left: 20px;
  width: 100px;
}

/* ✅ 使用 transform（仅合成） */
.element {
  transform: translate(20px, 10px) scale(1);
}

/* 字体优化 */
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2') format('woff2');
  font-display: swap;          /* 避免 FOIT */
  font-weight: 400 700;
  unicode-range: U+0000-00FF;  /* 限制字符集 */
  size-adjust: 100%;           /* 减少 CLS */
}
```

## 测试策略

```js
// 视觉回归测试（Percy / Chromatic）
describe('Card Component', () => {
  it('renders correctly', () => {
    cy.visit('/card-test')
    cy.percySnapshot('Card Default')
  })
})

// CSS Lint
// stylelint.config.js
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
    'max-nesting-depth': 3,
    'declaration-no-important': true,
  },
}
```

## CSS-in-JS 方案对比

| 方案 | 特点 | 适用场景 |
|------|------|---------|
| Tailwind CSS | 工具类优先，极小产物 | 快速开发，组件库 |
| CSS Modules | 局部作用域，构建时 | 传统 React/Vue 项目 |
| styled-components | 运行时动态样式 | 高度动态主题 |
| Emotion | 高性能运行时 | SSR 项目 |
| Vanilla Extract | 零运行时 CSS | 大型企业项目 |
| Panda CSS | 构建时 + 类型安全 | Monorepo

---

## 生态全景

### 工具链全景

```
┌─────────────────────────────────────┐
│          CSS 生态系统                 │
├─────────┬───────────┬───────────────┤
│ 工具    │ 框架       │ 组件库        │
│ PostCSS │ Tailwind  │ Ant Design    │
│ Sass    │ Bootstrap │ shadcn/ui     │
│ Lightning│ Bulma    │ Element Plus  │
│ CSS     │ OpenProps │ Radix UI      │
├─────────┼───────────┼───────────────┤
│ 工具    │ 动画       │ 测试          │
│ Stylelint│ GSAP     │ Percy         │
│ PurgeCSS│ Framer    │ Chromatic     │
│ CSSO    │ Motion    │ Loki          │
└─────────┴───────────┴───────────────┘
```

### 框架选型决策

```css
/* Tailwind CSS —— 工具类优先，快速开发原型 */
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>

/* Bootstrap —— 组件完整，适合传统后台 */
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">标题</h5>
    <a href="#" class="btn btn-primary">按钮</a>
  </div>
</div>
```

| 框架 | 理念 | 适用场景 |
|------|------|---------|
| Tailwind CSS | 工具类优先 | 快速迭代、设计系统 |
| Bootstrap | 组件完整 | 后台管理、原型 |
| Bulma | Flexbox 优先 | 中小型项目 |
| Open Props | CSS 变量 | 设计 Token 定制 |

### 工具生态系统

| 阶段 | 工具 | 说明 |
|------|------|------|
| 编写 | **VS Code + Tailwind CSS IntelliSense** | 智能提示 |
| 预处理 | **Sass/SCSS + PostCSS** | 变量、嵌套、自动前缀 |
| 构建 | **Vite + PostCSS** | 自动编译、压缩 |
| 检查 | **Stylelint** | CSS 代码规范 |
| 测试 | **Percy / Chromatic** | 视觉回归测试 |
| 优化 | **PurgeCSS + cssnano** | 移除未用、压缩 |

### 现代 CSS 工作流

```
设计稿(Figma)
     ↓ (Token 提取)
Design Token (JSON)
     ↓
CSS 变量 / Tailwind 配置
     ↓
Vite + PostCSS / Sass 编译
     ↓ (自动)
Autoprefixer → PurgeCSS → cssnano
     ↓
Stylelint 检查 → Percy 视觉测试
```

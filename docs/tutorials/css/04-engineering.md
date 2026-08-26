# CSS 工程实践

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
| Vanilla Extract | 零运行时 CSS | 大型企业项目 |
| Panda CSS | 构建时 + 类型安全 | Monorepo |

## 官方文档与延伸阅读

- **教程与参考**：[MDN CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) · [MDN CSS 属性参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- **方法论**：[BEM](https://getbem.com/) · [OOCSS](https://github.com/stubbornella/oocss)
- **预处理与后处理**：[Sass](https://sass-lang.com/documentation/) · [PostCSS](https://postcss.org/) · [Stylelint](https://stylelint.io/)
- **视觉回归测试**：[Percy](https://docs.percy.io/) · [Chromatic](https://www.chromatic.com/docs/) · [Playwright 截图](https://playwright.dev/docs/screenshots)
- **性能**：[渲染性能（web.dev）](https://web.dev/articles/rendering-performance) · [Critical Path](https://web.dev/articles/critical-rendering-path)
- **框架与方案**：[Tailwind CSS](https://tailwindcss.com/docs) · [Emotion](https://emotion.sh/docs/introduction) · [Vanilla Extract](https://vanilla-extract.style/)
- **规范**：[CSS Working Group Drafts](https://drafts.csswg.org/) · [W3C CSS 当前工作](https://www.w3.org/Style/CSS/current-work)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

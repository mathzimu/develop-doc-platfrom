# HTML 进阶深入

## 可访问性进阶

ARIA（Accessible Rich Internet Applications）为 HTML 元素补充无障碍语义，使屏幕阅读器能正确理解页面交互。

### ARIA 角色与属性

```html
<!-- 使用 role 明确元素用途 -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">标签一</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">标签二</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  标签一的内容
</div>

<!-- aria-live 动态内容更新 -->
<div aria-live="polite" aria-atomic="true">
  搜索结果已更新，共 42 条
</div>

<!-- 表单提示 -->
<label for="email">邮箱</label>
<input type="email" id="email" aria-describedby="email-hint" required>
<span id="email-hint">请输入工作邮箱</span>
```

### 键盘导航与焦点管理

```html
<!-- 跳过导航链接 -->
<a href="#main-content" class="skip-link">跳到主要内容</a>

<!-- 模态框焦点陷阱 -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">确认操作</h2>
  <p>确定要删除吗？</p>
  <button autofocus>取消</button>
  <button>确认</button>
</div>
```

### 屏幕阅读器支持

```html
<!-- 仅屏幕阅读器可见的文本 -->
<span class="sr-only">当前页面：首页</span>

<!-- 使用 aria-label 补充标签 -->
<button aria-label="关闭对话框">✕</button>

<!-- 描述复杂组件状态 -->
<div role="alert" aria-live="assertive">
  表单提交失败，请检查输入
</div>
```

## SEO 深度优化

### Open Graph 协议

控制社交分享时的卡片展示：

```html
<meta property="og:title" content="页面标题 - 优化至 60 字符以内">
<meta property="og:description" content="页面描述 - 优化至 160 字符以内">
<meta property="og:image" content="https://example.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_CN">
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:title" content="页面标题">
<meta name="twitter:description" content="页面描述">
<meta name="twitter:image" content="https://example.com/image.png">
```

### Canonical 与 hreflang

```html
<!-- 指定权威 URL，防止重复内容 -->
<link rel="canonical" href="https://example.com/page">

<!-- 多语言版本声明 -->
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/">
<link rel="alternate" hreflang="en-US" href="https://example.com/en/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

### 结构化数据（Schema.org）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "datePublished": "2025-06-01",
  "author": { "@type": "Person", "name": "作者名" },
  "image": "https://example.com/image.jpg",
  "description": "文章描述"
}
</script>
```

## Web Component 深入

Web Component 允许创建可复用的自定义 HTML 元素，包含 Custom Elements、Shadow DOM、Slots、Templates 四部分。

### Custom Elements

```html
<script>
class MyButton extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', () => alert('按钮被点击'))
  }

  connectedCallback() {
    this.innerHTML = `<button style="padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:4px;">${this.textContent}</button>`
  }
}
customElements.define('my-button', MyButton)
</script>

<my-button>点击我</my-button>
```

### Shadow DOM 与 Slots

Shadow DOM 隔离样式和 DOM，Slots 提供内容分发机制：

```html
<template id="card-template">
  <style>
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    .title { font-size: 1.2em; font-weight: bold; margin-bottom: 8px; }
  </style>
  <div class="card">
    <div class="title"><slot name="title"></slot></div>
    <slot></slot>
  </div>
</template>

<script>
class CustomCard extends HTMLElement {
  connectedCallback() {
    const template = document.getElementById('card-template')
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
  }
}
customElements.define('custom-card', CustomCard)
</script>

<custom-card>
  <span slot="title">卡片标题</span>
  <p>这是卡片内容，样式完全隔离。</p>
</custom-card>
```

### 生命周期回调

```js
class MyElement extends HTMLElement {
  constructor() { super() }

  // 元素插入 DOM
  connectedCallback() {}

  // 元素从 DOM 移除
  disconnectedCallback() {}

  // 元素移动到新文档
  adoptedCallback() {}

  // 监听属性变化
  static get observedAttributes() { return ['disabled', 'value'] }
  attributeChangedCallback(name, oldValue, newValue) {}
}
```

## Canvas 2D 绘图

Canvas 提供基于像素的 2D 绘图能力：

```html
<canvas id="myCanvas" width="400" height="300"></canvas>
<script>
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

// 矩形
ctx.fillStyle = '#3b82f6'
ctx.fillRect(20, 20, 150, 100)

// 圆形
ctx.beginPath()
ctx.arc(250, 70, 50, 0, Math.PI * 2)
ctx.fillStyle = '#10b981'
ctx.fill()

// 三角形
ctx.beginPath()
ctx.moveTo(50, 200)
ctx.lineTo(200, 250)
ctx.lineTo(50, 250)
ctx.closePath()
ctx.fillStyle = '#f59e0b'
ctx.fill()

// 文本
ctx.font = '20px Arial'
ctx.fillStyle = '#333'
ctx.fillText('Hello Canvas', 50, 280)
</script>
```

## SVG 在 HTML 中的应用

SVG 使用 XML 描述矢量图形，可直接嵌入 HTML：

```html
<!-- 内联 SVG -->
<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#3b82f6" />
  <rect x="60" y="60" width="80" height="80" fill="white" rx="8" />
  <text x="100" y="115" text-anchor="middle" fill="#333" font-size="24">SVG</text>
</svg>

<!-- SVG 图标 -->
<svg class="icon" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
</svg>
```

## 性能优化

### 资源提示

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>
<link rel="preload" href="/hero.webp" as="image">

<!-- 预连接第三方源 -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 预获取下一页 -->
<link rel="prefetch" href="/next-page.html">

<!-- 预渲染（谨慎使用，消耗带宽） -->
<link rel="prerender" href="/likely-next-page.html">
```

### 图片与 iframe 懒加载

```html
<!-- 原生懒加载 -->
<img src="photo.jpg" loading="lazy" alt="描述" decoding="async">

<!-- 设置加载优先级 -->
<img src="hero.jpg" fetchpriority="high" alt="主图">
<img src="decorative.jpg" fetchpriority="low" alt="装饰图">

<!-- iframe 懒加载 -->
<iframe src="map.html" loading="lazy" title="地图"></iframe>
```

### 异步加载非关键资源

```html
<!-- 异步加载 CSS -->
<link rel="preload" href="/non-critical.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/non-critical.css"></noscript>

<!-- defer 加载 JS -->
<script src="/app.js" defer></script>
```

## 官方文档与延伸阅读

本节涉及可访问性、SEO 结构化数据、性能优化，细节以下列一手资料为准：

- **可访问性**：[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- **结构化数据**：[Schema.org](https://schema.org/docs/documents.html) · [Google 结构化数据指南](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn)
- **性能指标**：[Core Web Vitals](https://web.dev/articles/vitals) · [LCP](https://web.dev/articles/lcp) · [INP](https://web.dev/articles/inp) · [CLS](https://web.dev/articles/cls)
- **资源加载**：[Preload/Prefetch](https://web.dev/articles/fetch-priority) · [defer/async](https://javascript.info/script-async-defer)
- **组件化**：[MDN 自定义元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) · [Shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM)

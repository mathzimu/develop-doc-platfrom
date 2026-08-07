# HTML 工程实践

## WCAG 无障碍标准

企业级产品必须满足 Web 内容无障碍指南（WCAG 2.1 AA 级别）。

```html
<!-- 语义化结构 -->
<header role="banner">
<nav role="navigation" aria-label="主导航">
<main role="main">
<footer role="contentinfo">

<!-- 表单无障碍 -->
<label for="email">邮箱</label>
<input type="email" id="email" aria-describedby="email-hint" required>
<span id="email-hint">请输入工作邮箱</span>

<!-- 动态内容更新 -->
<div aria-live="polite" aria-atomic="true">
  搜索结果已更新
</div>

<!-- 焦点管理 -->
<button aria-expanded="false" aria-controls="menu">
  菜单
</button>
```

### 对比度与颜色

```css
/* AA 级别要求 */
/* 正常文本：对比度 ≥ 4.5:1 */
/* 大文本(≥18px/14px bold)：对比度 ≥ 3:1 */

/* 不要仅用颜色传递信息 */
.error { color: #d32f2f; }
.error::before { content: "⚠ "; }
```

### 键盘导航

```html
<nav>
  <a href="/" tabindex="0">首页</a>
  <a href="/about" tabindex="0">关于</a>
  <a href="#main-content" tabindex="1" class="skip-link">跳到内容</a>
</nav>

<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">确认删除</h2>
  <button>取消</button>
  <button autofocus>确认</button>
</div>
```

### 测试工具

| 工具 | 用途 |
|------|------|
| axe DevTools | 浏览器扩展自动检测 |
| Lighthouse | 无障碍评分 |
| WAVE | 可视化问题分析 |
| NVDA / VoiceOver | 屏幕阅读器测试 |
| colourcontrast.cc | 对比度验证 |

## Core Web Vitals 与性能

Google 将以下指标作为搜索排名因素：

| 指标 | 衡量内容 | 合格标准 |
|------|---------|---------|
| **LCP** | 最大内容绘制 | ≤ 2.5s |
| **FID / INP** | 首次输入延迟 / 交互到绘制 | ≤ 100ms / ≤ 200ms |
| **CLS** | 累计布局偏移 | ≤ 0.1 |

### 性能优化清单

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>
<link rel="preload" href="/hero.webp" as="image">

<!-- 预连接第三方源 -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 异步加载非关键 CSS -->
<link rel="preload" href="/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- 图片优化 -->
<img src="photo.webp"
     srcset="photo-400.webp 400w, photo-800.webp 800w"
     sizes="(max-width: 600px) 100vw, 50vw"
     loading="lazy"
     decoding="async"
     alt="产品图片">

<img src="hero.jpg" fetchpriority="high" alt="主图">
```

### 字体优化

```html
<style>
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
  font-weight: 400 700;
}
</style>
```

## PWA（渐进式 Web 应用）

### manifest.json

```json
{
  "name": "企业应用",
  "short_name": "应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Service Worker

```js
// sw.js - 生产级 Service Worker
const CACHE_NAME = 'app-v1'
const STATIC_ASSETS = ['/', '/app.js', '/style.css', '/offline.html']

// 安装：预缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// 拦截请求：Stale-While-Revalidate 策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()))
        }
        return response
      }).catch(() => caches.match('/offline.html'))
      return cached || fetchPromise
    })
  )
})
```

## 结构化数据（Schema.org）

```html
<!-- 企业信息 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "企业名称",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+86-400-xxx-xxxx",
    "contactType": "customer service"
  }
}
</script>

<!-- 面包屑导航 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "首页",
    "item": "https://example.com"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "产品",
    "item": "https://example.com/products"
  }]
}
</script>

<!-- 文章 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "datePublished": "2025-01-15",
  "author": { "@type": "Person", "name": "作者" }
}
</script>
```

## 国际化（i18n）

```html
<!-- HTML lang 属性 -->
<html lang="zh-CN">

<!-- 多语言页面声明 -->
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/">
<link rel="alternate" hreflang="en-US" href="https://example.com/en/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">

<!-- 数字与日期本地化 -->
<time datetime="2025-01-15">2025年1月15日</time>
<meta name="format-detection" content="telephone=no, date=no">

<!-- 双向文本支持 -->
<div dir="rtl">مرحبا</div>
```

## 企业级 HTML 模板结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>产品名 - 企业名</title>
  <meta name="description" content="不超过160字的页面描述">

  <!-- SEO -->
  <link rel="canonical" href="https://example.com/page">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="描述">
  <meta property="og:image" content="https://example.com/og-image.png">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#3b82f6">

  <!-- 性能 -->
  <link rel="preconnect" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">

  <!-- 关键 CSS 内联，非关键异步加载 -->
  <style>/* critical CSS */</style>
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
</head>
<body>
  <header role="banner">
    <nav role="navigation" aria-label="主导航">...</nav>
  </header>

  <main id="main-content" role="main">
    <article>...</article>
  </main>

  <footer role="contentinfo">...</footer>

  <!-- 异步加载 JS -->
  <script src="/app.js" defer></script>
</body>
</html>
```

## 组件化架构

```html
<!-- 使用 Web Component 封装 -->
<custom-card>
  <span slot="title">卡片标题</span>
  <p>卡片内容</p>
</custom-card>

<template id="card-template">
  <style>
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    .title { font-size: 1.2em; margin-bottom: 8px; }
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
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }
}
customElements.define('custom-card', CustomCard)
</script>
```

## HTML 邮件开发

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 所有样式必须内联 -->
</head>
<body style="margin:0; padding:0; background:#f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px;">
        <table role="presentation" width="600" style="background:#fff; border-radius:8px;">
          <tr>
            <td style="padding: 40px; font-family: Arial, sans-serif;">
              <h1 style="font-size: 24px; color: #333;">标题</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #666;">内容</p>
              <a href="https://example.com" style="display:inline-block; padding:12px 24px; background:#3b82f6; color:#fff; text-decoration:none; border-radius:4px;">
                按钮
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

邮件注意事项：
- 使用表格布局，不支持 Flexbox/Grid
- CSS 必须内联，不支持 `<style>`（Gmail 除外）
- 图片需使用绝对 URL
- 总宽度建议 600px 以内
- 不支持 JavaScript

## 官方文档

| 主题 | 链接 |
|------|------|
| 无障碍标准 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) |
| 性能指标 | [Core Web Vitals](https://web.dev/articles/vitals) · [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) |
| PWA / SW | [Service Workers](https://www.w3.org/TR/service-workers/) · [MDN PWA](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps) |
| 结构化数据 | [Schema.org](https://schema.org/docs/documents.html) |
| 邮件规范 | [MJML 文档](https://documentation.mjml.io/) · [CanIUse Email](https://www.caniemail.com/) |

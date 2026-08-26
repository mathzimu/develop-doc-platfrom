# 实战项目：响应式 Landing Page

## 项目需求

构建一个现代响应式 Landing Page，包含：
- Hero 区域：渐变背景、大标题、副标题、CTA 按钮
- 特性展示区：3 列 Grid 布局展示核心功能
- 响应式设计：手机、平板、桌面全适配
- 过渡动画：悬停效果和滚动动画

## HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NextPlatform - 下一代开发平台</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <nav class="nav container">
      <div class="nav__logo">NextPlatform</div>
      <ul class="nav__links">
        <li><a href="#features">特性</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#contact" class="nav__cta">联系我们</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero">
    <div class="hero__content container">
      <h1 class="hero__title">构建未来的开发平台</h1>
      <p class="hero__subtitle">极速部署、智能监控、无缝协作 —— 一切尽在掌握</p>
      <div class="hero__actions">
        <a href="#" class="btn btn--primary">立即开始</a>
        <a href="#" class="btn btn--secondary">了解更多</a>
      </div>
    </div>
  </section>

  <section id="features" class="features container">
    <h2 class="section__title">核心特性</h2>
    <div class="features__grid">
      <article class="feature-card">
        <div class="feature-card__icon">⚡</div>
        <h3 class="feature-card__title">极速部署</h3>
        <p class="feature-card__desc">全球 CDN 分发，毫秒级响应，一键部署到 30+ 节点。</p>
      </article>
      <article class="feature-card">
        <div class="feature-card__icon">🔒</div>
        <h3 class="feature-card__title">安全可靠</h3>
        <p class="feature-card__desc">端到端加密、DDoS 防护、自动备份，99.99% 可用性。</p>
      </article>
      <article class="feature-card">
        <div class="feature-card__icon">📊</div>
        <h3 class="feature-card__title">智能监控</h3>
        <p class="feature-card__desc">实时日志分析、性能追踪、智能告警，掌控每一次变化。</p>
      </article>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer__content">
      <p>&copy; 2026 NextPlatform. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

## CSS 实现

### 全局样式与变量

```css
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-light: rgba(99, 102, 241, 0.1);
  --text: #1e293b;
  --text-light: #64748b;
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --border: #e2e8f0;
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  --max-width: 1100px;
  --header-height: 64px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  overflow-x: hidden;
}

.container {
  width: min(92%, var(--max-width));
  margin-inline: auto;
}
```

### Header 和导航

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav__logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.nav__links {
  display: flex;
  list-style: none;
  gap: 24px;
  align-items: center;
}

.nav__links a {
  text-decoration: none;
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav__links a:hover {
  color: var(--text);
}
```

### Hero 区（渐变背景、大标题、CTA 按钮）

```css
.hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  margin-top: var(--header-height);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%);
  pointer-events: none;
}

.hero__content {
  position: relative;
  text-align: center;
  padding: 80px 0;
}

.hero__title {
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  margin: 0 auto 32px;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn--primary {
  background: white;
  color: var(--primary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn--secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin-left: 12px;
}

.btn--secondary:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}
```

### 特性展示区（Grid 布局）

```css
.features {
  padding: 100px 0;
}

.section__title {
  text-align: center;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 60px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  padding: 40px 32px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--primary);
}

.feature-card__icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card__desc {
  color: var(--text-light);
  font-size: 0.925rem;
}
```

### 页脚

```css
.footer {
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
  padding: 32px 0;
}

.footer__content {
  text-align: center;
  color: var(--text-light);
  font-size: 0.875rem;
}
```

### 响应式设计

```css
@media (max-width: 768px) {
  .nav__links a:not(.nav__cta) { display: none; }

  .features__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .hero__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .btn--secondary {
    margin-left: 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 过渡动画

```css
.feature-card {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 完整代码整合

将以上所有 CSS 片段合并到 `style.css` 中，`index.html` 引用该文件即可运行。可在此基础上扩展动画、深色模式、更多页面等。

## 官方文档与延伸阅读

- **教程与参考**：[MDN CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) · [MDN CSS 属性参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- **布局**：[MDN Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout) · [MDN Grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout) · [CSS Grid 规范](https://drafts.csswg.org/css-grid/)
- **响应式设计**：[MDN 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries) · [MDN `prefers-color-scheme`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)
- **动画**：[MDN CSS 动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_animations)
- **规范**：[CSS Working Group Drafts](https://drafts.csswg.org/) · [W3C CSS 当前工作](https://www.w3.org/Style/CSS/current-work)
- **兼容性与性能**：[Can I use](https://caniuse.com/) · [渲染性能（web.dev）](https://web.dev/articles/rendering-performance)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

# 实战项目：个人简历页面

## 项目需求

构建一份个人简历页面，要求：
- 使用语义化 HTML5 标签
- 包含个人信息、技能、工作经历、教育背景
- 支持 SEO 优化
- 支持社交分享（Open Graph）
- 具备可访问性
- 响应式设计基础

## HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>张三 - 个人简历</title>
  <meta name="description" content="张三的个人简历 - 全栈工程师，5年开发经验">
  <meta name="keywords" content="简历, 全栈工程师, 前端开发">

  <!-- Open Graph -->
  <meta property="og:title" content="张三 - 个人简历">
  <meta property="og:description" content="全栈工程师，5年开发经验">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="https://example.com/resume">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="张三 - 个人简历">

  <link rel="canonical" href="https://example.com/resume">
</head>
<body>
  <header role="banner">
    <nav role="navigation" aria-label="页面导航">
      <ul>
        <li><a href="#about">关于我</a></li>
        <li><a href="#skills">技能</a></li>
        <li><a href="#experience">工作经历</a></li>
        <li><a href="#education">教育背景</a></li>
        <li><a href="#contact">联系方式</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" role="main">
    <section id="about" aria-labelledby="about-title">
      <h1 id="about-title">张三</h1>
      <p>全栈工程师 · 5年经验</p>
      <p>专注于 Web 应用开发，精通 React、Node.js、TypeScript。</p>
    </section>

    <section id="skills" aria-labelledby="skills-title">
      <h2 id="skills-title">技能</h2>
      <ul>
        <li>HTML / CSS / JavaScript</li>
        <li>React / Vue.js</li>
        <li>Node.js / Express</li>
        <li>TypeScript</li>
        <li>Docker / CI/CD</li>
      </ul>
    </section>

    <section id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title">工作经历</h2>
      <article>
        <header>
          <h3>高级前端工程师 - 某某科技有限公司</h3>
          <time datetime="2022-03">2022年3月 - 至今</time>
        </header>
        <ul>
          <li>负责核心产品前端架构设计与开发</li>
          <li>优化首屏加载性能，LCP 从 3.2s 降至 1.8s</li>
          <li>推动团队采用 TypeScript 和自动化测试</li>
        </ul>
      </article>
      <article>
        <header>
          <h3>前端工程师 - 某某网络公司</h3>
          <time datetime="2020-07">2020年7月 - 2022年2月</time>
        </header>
        <ul>
          <li>参与电商平台前端开发</li>
          <li>基于 React 开发 10+ 业务组件</li>
        </ul>
      </article>
    </section>

    <section id="education" aria-labelledby="education-title">
      <h2 id="education-title">教育背景</h2>
      <article>
        <h3>某某大学</h3>
        <p>计算机科学与技术 · 本科</p>
        <time datetime="2016-09">2016年9月</time> - <time datetime="2020-06">2020年6月</time>
      </article>
    </section>
  </main>

  <aside id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">联系方式</h2>
    <address>
      <a href="mailto:zhangsan@example.com">zhangsan@example.com</a><br>
      <a href="tel:+8613800000000">138-0000-0000</a><br>
      <a href="https://github.com/zhangsan" target="_blank" rel="noopener noreferrer">GitHub</a>
    </address>
  </aside>

  <footer role="contentinfo">
    <p>&copy; 2025 张三. All rights reserved.</p>
  </footer>
</body>
</html>
```

## 语义化要点

| 标签 | 用途 |
|------|------|
| `<header>` | 页面头部，含导航 |
| `<nav>` | 页面内导航链接 |
| `<main>` | 唯一主内容区域 |
| `<section>` | 按主题分组的内容块 |
| `<article>` | 独立的工作经历、教育条目 |
| `<aside>` | 侧边联系方式 |
| `<footer>` | 页面底部版权信息 |
| `<address>` | 联系信息 |
| `<time>` | 机器可读的时间 |

## 可访问性要点

- `role` 属性补充语义（`banner`、`navigation`、`main`、`contentinfo`）
- `aria-labelledby` 关联标题与区域
- 导航支持键盘操作
- 链接有明确文本
- 语义化标签确保屏幕阅读器正确解析

## SEO 要点

- 单页唯一 `<h1>` 标题
- `<meta name="description">` 页面描述
- `canonical` 避免重复内容
- Open Graph 协议控制分享展示
- Twitter Card 支持社交分享
- 语义化标签帮助搜索引擎理解结构

## 扩展建议

- 添加 CSS 样式使其更美观
- 使用 `@media` 实现响应式布局
- 增加 Schema.org `Person` 结构化数据
- 部署为 GitHub Pages 在线简历
- 添加多语言版本（`hreflang`）
- 集成 Google Analytics 统计访问

## 官方文档与延伸阅读

实战项目涉及的语义化、可访问性、SEO 与性能一手资料：

- **结构化数据**：[Schema.org](https://schema.org/docs/documents.html) · [Google 结构化数据](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=zh-cn)
- **可访问性**：[WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- **性能指标**：[Core Web Vitals](https://web.dev/articles/vitals)
- **校验工具**：[W3C Validator](https://validator.w3.org/)

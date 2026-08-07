# CSS 进阶深入

## CSS 原生嵌套

CSS 原生嵌套无需预处理器即可编写嵌套规则，大幅降低阅读成本。

```css
.card {
  background: white;
  border-radius: 8px;

  & .title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  & .content {
    color: #64748b;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  @media (width >= 768px) {
    padding: 24px;
  }
}
```

`&` 表示父选择器，可出现在任意位置：

```css
.nav {
  .dark & { background: #1e293b; }
}
```

### @scope 限定作用域

```css
@scope (.card) {
  p { margin: 0; }
  img { border-radius: 4px; }
}
```

`@scope` 允许将样式限定在特定子树内，避免命名冲突。`@scope` 内的选择器不会影响外部同名的元素。

## CSS Layers（@layer）

`@layer` 显式控制层叠优先级，解决第三方样式覆盖难题。

```css
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #1a1a2e;
  }
}

@layer components {
  .button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    background: var(--primary);
    color: white;
  }
}

@layer utilities {
  .text-center { text-align: center; }
  .mt-4 { margin-top: 16px; }
}
```

后定义的 layer 优先级更高。匿名 layer（`@layer { ... }`）优先级低于具名 layer。`!important` 在 layer 内的优先级反转。

## Container Queries 进阶

容器查询让组件基于容器而非视口响应。

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    gap: 16px;
  }
  .card__image {
    width: 200px;
    height: auto;
  }
}

@container card (min-width: 600px) {
  .card {
    flex-direction: row;
  }
  .card__content {
    font-size: 1.125rem;
  }
}
```

容器查询样式查询（`style()`）：

```css
@container card style(--theme: dark) {
  .card { background: #1e293b; color: #e2e8f0; }
}
```

## CSS Houdini

Houdini 提供底层 API 让开发者扩展 CSS 渲染能力。

### Paint API

```css
.background-art {
  --pattern-color: #3b82f6;
  background-image: paint(dotPattern);
}
```

```js
// worklet.js
registerPaint('dotPattern', class {
  static get inputProperties() { return ['--pattern-color']; }
  paint(ctx, size, props) {
    const color = props.get('--pattern-color').toString();
    ctx.fillStyle = color;
    for (let x = 0; x < size.width; x += 40) {
      for (let y = 0; y < size.height; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
});
```

### Properties & Values API

```js
CSS.registerProperty({
  name: '--animation-progress',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
});
```

```css
.element {
  --animation-progress: 1;
  opacity: var(--animation-progress);
  transition: --animation-progress 0.3s;
}
```

### Typed OM

```js
const el = document.querySelector('.element');
el.attributeStyleMap.set('margin', CSS.px(16));
el.attributeStyleMap.set('display', 'grid');
el.attributeStyleMap.set('gap', CSS.px(8));
```

Typed OM 提供类型安全的 CSS 操作，避免字符串拼接。

## Subgrid

Subgrid 让子网格继承父网格的轨道定义。

```css
.page {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;  /* 继承 .page 的列 */
}

.section header,
.section main,
.section footer {
  grid-row: 1;
}
```

Subgrid 适合内部元素需要与外部网格对齐的场景，如卡片列表中的不同卡片内部对齐。

## 滚动驱动动画

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-animate {
  animation: fadeIn 1s linear forwards;
  animation-timeline: view();     /* 基于元素滚动可见性 */
  animation-range: entry 0% entry 100%; /* 从进入视口到完全进入 */
}
```

```css
/* view-timeline 命名 */
.container {
  view-timeline: --section-timeline;
}

.section {
  animation: scaleIn 1s linear forwards;
  animation-timeline: --section-timeline;
}

@keyframes scaleIn {
  from { transform: scale(0.8); }
  to { transform: scale(1); }
}
```

## :has() 选择器实战

```css
/* 包含图片的卡片 */
.card:has(img) { padding: 0; }

/* 表单验证状态 */
.form-group:has(input:invalid) .error-message {
  display: block;
}

/* 兄弟状态联动 */
.item:has(+ .item--active) { border-bottom-color: transparent; }

/* 父级条件样式 */
.sidebar:has(.nav-item--active) {
  background: #f8fafc;
}
```

## 现代颜色函数

```css
/* color-mix 颜色混合 */
.primary-mix {
  background: color-mix(in srgb, #3b82f6 40%, white);
}

/* 相对颜色语法 */
.theme-primary {
  --primary: #3b82f6;
  --primary-light: rgb(from var(--primary) r g b / 0.3);
  --primary-dark: oklch(from var(--primary) calc(l - 0.1) c h);
}

/* oklch 均匀色空间 */
.palette {
  --red: oklch(0.6 0.24 25);
  --blue: oklch(0.6 0.24 250);
  --green: oklch(0.6 0.24 145);
}
/* oklch 中相同的 l 和 c 值产生视觉感知一致的亮度/饱和度 */
```

## 自定义属性进阶

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initialValue: 0deg;
}

.element {
  --gradient-angle: 45deg;
  background: linear-gradient(var(--gradient-angle), #667eea, #764ba2);
  transition: --gradient-angle 0.5s;
}

.element:hover {
  --gradient-angle: 135deg;
}

/* @supports 特性检测 */
@supports (background: linear-gradient(in oklch, red, blue)) {
  .modern-element {
    background: linear-gradient(in oklch, #667eea, #764ba2);
  }
}

/* fallback 策略 */
.fallback-safe {
  color: #333;                           /* 兜底 1 */
  color: oklch(0.4 0 0);                /* 兜底 2 */
  color: light-dark(#1a1a2e, #e2e8f0); /* 现代浏览器 */
}
```

## 官方文档

本节涉及 CSS 架构、设计系统、容器查询与 Houdini，以规范草案与 MDN 为准。

| 主题 | 链接 |
|------|------|
| 规范草案 | [CSSWG Drafts](https://drafts.csswg.org/) · [W3C CSS 当前工作](https://www.w3.org/Style/CSS/current-work) |
| 设计系统与 Token | [MDN 使用自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) |
| 容器查询 | [MDN 容器查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_containment/Container_queries) |
| 层叠层 | [MDN `@layer`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer) · [CSS 层叠规范](https://drafts.csswg.org/css-cascade-5/) |
| 颜色与混合 | [CSS Color 5](https://drafts.csswg.org/css-color-5/) · [`color-mix()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value/color-mix) · [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) |
| 兼容性查询 | [Can I use](https://caniuse.com/) |

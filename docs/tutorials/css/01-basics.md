# CSS 基础语法

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

外部样式表利于缓存和复用，是企业项目的首选。内部样式表适合单页原型。行内样式优先级最高但难以维护，应尽量避免。

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

> 💡 选择器的完整语法、优先级计算与浏览器支持见 [MDN CSS 选择器参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors)。

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

/* :is() 与 :where() 分组 */
:is(section, article, aside) h2 { font-size: 1.5em; }
:where(nav, aside) a { text-decoration: none; }
/* :where() 优先级始终为 0，适合重置 */
```

`:is()` 和 `:where()` 是现代 CSS 中强大的分组选择器。`:is()` 的优先级取参数中最高者，`:where()` 优先级始终为零，便于覆盖。

### 选择器优先级速查

```css
/* 从低到高 */
*                    /* 0,0,0,0 */
p                    /* 0,0,0,1 */
.class               /* 0,0,1,0 */
#id                  /* 0,1,0,0 */
style=""             /* 1,0,0,0 */
!important           /* 无穷大，避免使用 */
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

**margin 折叠**：相邻兄弟元素的垂直 `margin` 会合并（取较大值），只有普通流中的块级元素会发生折叠。Flexbox 和 Grid 容器内的子元素不会折叠。

### 边距简写规则

```css
/* 4 个值：上 右 下 左 */
margin: 10px 20px 10px 20px;

/* 3 个值：上 左右 下 */
margin: 10px 20px 10px;

/* 2 个值：上下 左右 */
margin: 10px 20px;

/* 1 个值：四个方向 */
margin: 10px;
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

CSS 颜色函数现已支持空格分隔语法：`rgb(255 0 0 / 0.5)`，`hsl(0 100% 50% / 0.5)`，更简洁且支持 `oklch()`、`color()` 等现代函数。

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
| `dvw` `dvh` | 视口 | 动态视口单位（避开了移动端工具栏） |

```css
.unit-examples {
  font-size: 16px;
  padding: 1em;        /* = 16px */
  margin: 2rem;        /* = 32px（相对于根字体） */
  width: 50%;          /* 父元素宽度的一半 */
  height: 100vh;       /* 全屏高度 */
  height: 100dvh;      /* 动态视口高度（更准确） */
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

### 常见 Flexbox 模式

```css
/* 导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* 卡片列表 */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.card-list > * {
  flex: 1 1 300px;  /* 最小 300px，可伸缩填充 */
}

/* 居中 */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
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

`auto-fill` 会创建空轨道，`auto-fit` 会折叠空轨道。多数场景用 `auto-fit` 更合适。

### Grid 对齐简写

```css
.grid {
  display: grid;
  place-items: center;        /* 同时设置 align-items + justify-items */
  place-content: center;      /* 同时设置 align-content + justify-content */
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

`z-index` 仅在定位元素（`position` 非 `static`）上生效。CSS 现在推荐使用 `@layer` 和 `contain` 来管理堆叠上下文。

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

### 过渡的 timing-function

```css
.ease       { transition-timing-function: ease; }           /* 慢快慢 */
.ease-in    { transition-timing-function: ease-in; }        /* 慢到快 */
.ease-out   { transition-timing-function: ease-out; }       /* 快到慢 */
.ease-in-out { transition-timing-function: ease-in-out; }   /* 慢快慢（更平滑） */
.linear     { transition-timing-function: linear; }         /* 匀速 */
.cubic-bezier { transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1); } /* 自定义 */
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

变量支持回退值：`var(--primary, blue)` 在 `--primary` 未定义时使用蓝色。

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
9. **减少嵌套**：尽量保持选择器深度不超过 3 层

## 官方文档与延伸阅读

- **教程与参考**：[MDN CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) · [MDN CSS 属性参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- **选择器与盒模型**：[MDN CSS 选择器参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors) · [MDN 使用 CSS 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- **布局**：[Flexbox 指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout) · [Grid 指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)
- **规范**：[CSSWG Drafts](https://drafts.csswg.org/) · [W3C CSS 当前工作](https://www.w3.org/Style/CSS/current-work)
- **框架**：[Tailwind CSS](https://tailwindcss.com/docs) · [Bootstrap](https://getbootstrap.com/docs/) · [Open Props](https://open-props.style/)
- **预处理与后处理**：[Sass](https://sass-lang.com/documentation/) · [PostCSS](https://postcss.org/) · [Stylelint](https://stylelint.io/)
- **兼容性与性能**：[Can I use](https://caniuse.com/) · [渲染性能（web.dev）](https://web.dev/articles/rendering-performance)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

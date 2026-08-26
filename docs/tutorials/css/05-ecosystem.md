# CSS 生态全景

## 工具链全景

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

## 框架选型决策

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

## 工具生态系统

| 阶段 | 工具 | 说明 |
|------|------|------|
| 编写 | **VS Code + Tailwind CSS IntelliSense** | 智能提示 |
| 预处理 | **Sass/SCSS + PostCSS** | 变量、嵌套、自动前缀 |
| 构建 | **Vite + PostCSS** | 自动编译、压缩 |
| 检查 | **Stylelint** | CSS 代码规范 |
| 测试 | **Percy / Chromatic** | 视觉回归测试 |
| 优化 | **PurgeCSS + cssnano** | 移除未用、压缩 |

## 现代 CSS 工作流

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

## 官方文档与延伸阅读

- **教程与参考**：[MDN CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) · [MDN CSS 属性参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- **规范**：[CSS Working Group Drafts](https://drafts.csswg.org/)
- **框架**：[Tailwind CSS](https://tailwindcss.com/docs) · [Bootstrap](https://getbootstrap.com/docs/) · [Bulma](https://bulma.io/documentation/) · [Open Props](https://open-props.style/)
- **预处理与后处理**：[Sass](https://sass-lang.com/documentation/) · [PostCSS](https://postcss.org/) · [Stylelint](https://stylelint.io/)
- **检查与优化**：[cssnano](https://cssnano.co/) · [PurgeCSS](https://purgecss.com/)
- **视觉回归测试**：[Percy](https://docs.percy.io/) · [Chromatic](https://www.chromatic.com/docs/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

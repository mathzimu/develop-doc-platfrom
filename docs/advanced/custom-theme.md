# 自定义主题

在 `docs/.vitepress/theme/style.css` 中覆写 CSS 变量：

```css
:root {
  --vp-c-brand-1: #3b82f6;
  --vp-c-brand-2: #2563eb;
  --vp-c-brand-3: #1d4ed8;
  --vp-c-brand-soft: rgba(59, 130, 246, 0.14);
}
```

通过 `docs/.vitepress/theme/index.ts` 扩展默认主题。

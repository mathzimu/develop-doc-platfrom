# HTML 生态全景

HTML 生态包含丰富的工具链和框架选择，了解生态全景有助于根据项目需求做出合理的技术选型。

## 工具链

| 类别 | 工具 | 用途 |
|------|------|------|
| 模板引擎 | **Nunjucks**, **EJS**, **Pug**, **Handlebars** | 服务端 HTML 渲染 |
| SSG | **Astro**, **Eleventy**, **Hugo** | 静态站点生成 |
| 验证器 | **W3C Validator**, **HTMLHint** | HTML 合规性检查 |
| 整合适配 | **PostHTML**, **html-minifier-terser** | 处理与压缩 |
| 电子邮件 | **MJML**, **Foundation for Emails** | 响应式邮件 |

## 现代 HTML 技术选型

```
+-------------------------------+
|         Web 应用架构           |
+----------------+--------------+
|  SSG / SSR     |  SPA / MPA   |
|  Astro         |  React       |
|  Eleventy      |  Vue         |
|  VitePress     |  SvelteKit   |
+----------------+--------------+
|       Build 层                 |
|  Vite / Webpack / esbuild     |
+-------------------------------+
|       原生 HTML 标准           |
|  WHATWG HTML / W3C / ECMA     |
+-------------------------------+
```

## 模板引擎语法对比

```
Nunjucks:   {{ variable }}  {% if %}  {% for %}
EJS:        <%= variable %> <% if %>  <% for %>
Pug:        h1= title      if condition  each item in items
Handlebars: {{variable}}   {{#if}}  {{#each}}

推荐：Nunjucks（语法强大）或 Pug（简洁）
```

## 官方文档与延伸阅读

生态中选型涉及的规范、框架与工具一手入口：

- **HTML 标准**：[WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/) · [W3C 校验器](https://validator.w3.org/)
- **元素与属性参考**：[MDN HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) · [MDN 元素索引](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)
- **可访问性**：[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- **兼容性查询**：[Can I use](https://caniuse.com/)
- **模板引擎**：[Nunjucks](https://mozilla.github.io/nunjucks/) · [EJS](https://ejs.co/) · [Pug](https://pugjs.org/) · [Handlebars](https://handlebarsjs.com/)
- **静态站点生成**：[Astro](https://docs.astro.build/zh-cn/) · [Eleventy](https://www.11ty.dev/docs/) · [Hugo](https://gohugo.io/documentation/)
- **HTML 邮件**：[MJML](https://documentation.mjml.io/)

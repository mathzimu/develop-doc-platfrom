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

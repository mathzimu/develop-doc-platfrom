# HTML 基础语法

## 基本结构

HTML 使用标签来描述网页的内容结构。浏览器读取 HTML 并将其渲染为可视化的页面。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的第一个页面</title>
</head>
<body>
  <h1>欢迎来到我的网站</h1>
  <p>这是一个段落。</p>
  <a href="https://example.com">这是一个链接</a>
  <img src="image.jpg" alt="描述文字">
</body>
</html>
```

| 部分 | 说明 |
|------|------|
| `<!DOCTYPE html>` | 声明文档类型为 HTML5 |
| `<html>` | 根元素，包裹所有内容 |
| `<head>` | 元数据区域，存放标题、字符集、样式引用等 |
| `<body>` | 可见内容区域 |

## 标题与段落

HTML 提供六级标题 `<h1>` 到 `<h6>`，以及段落标签 `<p>`。

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<p>这是一个段落。段落会自动换行，并在前后添加间距。</p>
<p>这是第二个段落。<br>使用 br 标签可以手动换行。</p>
```

- `<h1>` 每个页面只应使用一次，用于主标题
- `<h2>` - `<h6>` 用于子标题，形成文档层次结构
- `<br>` 是空标签（无需闭合），用于强制换行
- `<hr>` 创建水平分割线

## 文本格式化

```html
<strong>加粗文本</strong>（语义：强调）
<b>加粗文本</b>（仅样式）
<em>斜体文本</em>（语义：着重）
<i>斜体文本</i>（仅样式）
<u>下划线</u>
<s>删除线</s>
<small>小号文本</small>
<mark>高亮标记</mark>
<code>code</code> 行内代码
<pre>保留
  换行
    和缩进</pre>
<blockquote>引用文本</blockquote>
```

## 链接

```html
<!-- 基本链接 -->
<a href="https://example.com">访问 Example</a>

<!-- 在新标签打开 -->
<a href="https://example.com" target="_blank">新窗口打开</a>

<!-- 页面内锚点跳转 -->
<a href="#section-2">跳转到第二节</a>
<h2 id="section-2">第二节</h2>

<!-- 邮件与电话 -->
<a href="mailto:hello@example.com">发送邮件</a>
<a href="tel:+8613800000000">拨打电话</a>

<!-- 下载链接 -->
<a href="file.zip" download>下载文件</a>
```

| 属性 | 说明 |
|------|------|
| `href` | 目标 URL |
| `target="_blank"` | 在新标签页打开 |
| `rel="noopener noreferrer"` | 与 `_blank` 配合使用，防止安全漏洞 |
| `download` | 提示下载文件而非导航 |

## 图片

```html
<img src="photo.jpg" alt="照片描述" width="400" height="300">

<!-- 响应式图片 -->
<img src="small.jpg"
     srcset="medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="响应式示例">

<!-- 图片作为链接 -->
<a href="detail.html">
  <img src="thumb.jpg" alt="缩略图">
</a>
```

| 属性 | 说明 |
|------|------|
| `src` | 图片路径 |
| `alt` | 替代文本（无障碍、图片加载失败时显示） |
| `width` / `height` | 尺寸（单位像素，不加 px） |
| `loading="lazy"` | 懒加载（图片进入视口才加载） |

## 列表

```html
<!-- 无序列表 -->
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>橘子</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>打开电源</li>
  <li>登录系统</li>
  <li>启动应用</li>
</ol>

<!-- 自定义列表 -->
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言</dd>
  <dt>CSS</dt>
  <dd>层叠样式表</dd>
</dl>
```

有序列表的 `type` 属性支持：`1`（数字）、`A`（大写字母）、`a`（小写字母）、`I`（大写罗马）、`i`（小写罗马）。

## 表格

```html
<table>
  <caption>员工信息表</caption>
  <thead>
    <tr>
      <th>姓名</th>
      <th>部门</th>
      <th>工资</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>技术部</td>
      <td>15000</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>市场部</td>
      <td>12000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">总计</td>
      <td>27000</td>
    </tr>
  </tfoot>
</table>
```

| 标签 | 说明 |
|------|------|
| `<caption>` | 表格标题 |
| `<thead>` | 表头区域 |
| `<tbody>` | 正文区域 |
| `<tfoot>` | 表尾区域 |
| `<th>` | 表头单元格（自动加粗居中） |
| `<td>` | 普通单元格 |
| `colspan` | 跨列合并 |
| `rowspan` | 跨行合并 |

## 表单

```html
<form action="/submit" method="POST">
  <!-- 文本输入 -->
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name" required
         placeholder="请输入姓名" maxlength="20">

  <!-- 邮箱 -->
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" required>

  <!-- 密码 -->
  <label for="pwd">密码：</label>
  <input type="password" id="pwd" name="password" minlength="6">

  <!-- 数字 -->
  <label for="age">年龄：</label>
  <input type="number" id="age" name="age" min="0" max="150">

  <!-- 单选 -->
  <fieldset>
    <legend>性别</legend>
    <label><input type="radio" name="gender" value="male"> 男</label>
    <label><input type="radio" name="gender" value="female"> 女</label>
  </fieldset>

  <!-- 多选 -->
  <label><input type="checkbox" name="hobby" value="reading"> 阅读</label>
  <label><input type="checkbox" name="hobby" value="sports"> 运动</label>

  <!-- 下拉选择 -->
  <label for="city">城市：</label>
  <select id="city" name="city">
    <option value="">请选择</option>
    <option value="beijing">北京</option>
    <option value="shanghai">上海</option>
  </select>

  <!-- 文本域 -->
  <label for="bio">简介：</label>
  <textarea id="bio" name="bio" rows="4" cols="30"></textarea>

  <!-- 文件上传 -->
  <label for="file">上传文件：</label>
  <input type="file" id="file" name="file" accept=".pdf,.doc">

  <!-- 提交 -->
  <button type="submit">提交</button>
  <button type="reset">重置</button>
</form>
```

### 常用 input 类型

| type | 说明 | 常用属性 |
|------|------|---------|
| `text` | 单行文本 | `placeholder`, `maxlength` |
| `email` | 邮箱地址 | 自动校验格式 |
| `password` | 密码 | `minlength` |
| `number` | 数字 | `min`, `max`, `step` |
| `url` | URL 地址 | 自动校验格式 |
| `tel` | 电话号码 | `pattern` |
| `date` | 日期选择器 | `min`, `max` |
| `color` | 颜色选择器 | - |
| `range` | 滑块 | `min`, `max`, `step` |
| `file` | 文件上传 | `accept`, `multiple` |
| `hidden` | 隐藏字段 | - |
| `search` | 搜索框 | - |

## 块级元素与行内元素

HTML 元素分为块级（block）和行内（inline）两类。块级元素独占一行，可设置宽高；行内元素不换行，宽高由内容决定。

```html
<!-- 块级元素 -->
<div>块级容器</div>
<p>段落</p>
<h1>标题</h1>

<!-- 行内元素 -->
<span>行内容器</span>
<a href="#">链接</a>
<strong>强调文本</strong>
```

常见块级元素：`<div>`、`<p>`、`<h1>`-`<h6>`、`<ul>`、`<ol>`、`<table>`、`<form>`、`<header>`、`<footer>`、`<section>`、`<article>`

常见行内元素：`<span>`、`<a>`、`<strong>`、`<em>`、`<img>`、`<br>`、`<input>`、`<label>`、`<code>`

## div 与 span

`<div>` 和 `<span>` 是最通用的容器元素，本身没有语义，配合 CSS 和 JavaScript 使用。

```html
<div class="card">
  <h2>卡片标题</h2>
  <p>卡片内容</p>
</div>

<p>这是<span class="highlight">高亮文字</span>的示例。</p>
```

## 语义化 HTML5

使用语义标签可以提升可访问性和 SEO：

```html
<header>     <!-- 页面或区域头部 -->
<nav>        <!-- 导航区域 -->
<main>       <!-- 主要内容（每个页面唯一） -->
<article>    <!-- 独立的内容块（博客文章、新闻） -->
<section>    <!-- 主题分组 -->
<aside>      <!-- 侧边栏、补充内容 -->
<footer>     <!-- 页面或区域底部 -->
<figure>     <!-- 插图、图表 -->
<figcaption> <!-- figure 的标题 -->
<time>       <!-- 时间/日期 -->
<mark>       <!-- 高亮文本 -->
<progress>   <!-- 进度条 -->
<details>    <!-- 可折叠详情 -->
<summary>    <!-- details 的标题 -->
```

```html
<article>
  <header>
    <h1>如何学习 HTML</h1>
    <time datetime="2025-01-15">2025年1月15日</time>
  </header>
  <section>
    <h2>基础概念</h2>
    <p>HTML 是...</p>
  </section>
  <footer>
    <p>作者：张三</p>
  </footer>
</article>
```

## 多媒体

```html
<!-- 视频 -->
<video controls width="640">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放。
</video>

<!-- 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频播放。
</audio>

<!-- 内嵌页面 -->
<iframe src="https://example.com" width="800" height="600"
        title="示例" loading="lazy"></iframe>
```

| 视频属性 | 说明 |
|---------|------|
| `controls` | 显示播放控件 |
| `autoplay` | 自动播放（通常需静音） |
| `muted` | 静音 |
| `loop` | 循环播放 |
| `poster` | 封面图 |

## HTML 实体与字符

| 显示 | 实体名称 | 实体编号 |
|------|---------|---------|
| `<` | `&lt;` | `&#60;` |
| `>` | `&gt;` | `&#62;` |
| `&` | `&amp;` | `&#38;` |
| `"` | `&quot;` | `&#34;` |
| `'` | `&apos;` | `&#39;` |
| ` ` | `&nbsp;` | `&#160;`（不间断空格） |
| `©` | `&copy;` | `&#169;` |
| `®` | `&reg;` | `&#174;` |

## 全局属性

以下属性可用于所有 HTML 元素：

| 属性 | 说明 |
|------|------|
| `id` | 唯一标识符 |
| `class` | 类名（可多个，空格分隔） |
| `style` | 行内样式 |
| `title` | 悬停提示文本 |
| `data-*` | 自定义数据属性 |
| `hidden` | 隐藏元素 |
| `tabindex` | Tab 键导航顺序 |
| `role` | ARIA 角色（无障碍） |
| `aria-*` | ARIA 属性 |

```html
<div id="app" class="container main" data-user-id="42">
  内容
</div>
```

## 常用 meta 标签

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="页面描述，用于 SEO">
<meta name="keywords" content="关键词, 标签">
<meta name="author" content="作者名">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Open Graph 标题">
<meta property="og:image" content="分享图片">
<meta name="theme-color" content="#3b82f6">
```

## 常见错误与最佳实践

1. **忘记 DOCTYPE**：缺少 `<!DOCTYPE html>` 会导致浏览器进入怪异模式
2. **嵌套错误**：块级元素不应放在行内元素内（如 `<a>` 内放 `<div>`）
3. **缺少 alt 属性**：所有 `<img>` 必须有 `alt`
4. **标签未闭合**：尤其注意 `<li>`、`<td>` 等
5. **重复 id**：`id` 必须在页面内唯一，使用 `class` 代替重复
6. **使用过时的标签**：避免 `<font>`、`<center>`、`<marquee>`，用 CSS 代替
7. **忽视语义化**：多用 `<header>`、`<nav>`、`<main>`，少用 `<div>`

# 部署指南

## 环境要求

构建文档站点需要 Node.js 18+ 和 npm/pnpm/yarn 任一包管理器。

## 构建站点

```sh
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，静态文件位于 `docs/.vitepress/dist/` 目录，可直接部署到任何静态托管平台。

构建产物结构：

```
docs/.vitepress/dist/
├── index.html
├── 404.html
├── guide/
├── api/
├── advanced/
├── assets/
│   ├── main.[hash].js
│   ├── style.[hash].css
│   └── ...
└── hashmap.json
```

## 使用 Docker 部署

### 编写 Dockerfile

在项目根目录创建 `Dockerfile`：

```Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

在项目根目录创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name docs.example.com;
    root /usr/share/nginx/html;
    index index.html;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri.html $uri/ =404;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }

    # 自定义 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

### 使用 docker-compose

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  docs:
    build: .
    ports:
      - "8080:80"
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

### 构建与运行

```sh
# 构建镜像
docker compose build

# 启动服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f
```

## 部署到 Vercel

### 方式一：通过 Git 自动部署

1. 将代码推送到 Git 仓库
2. 在 [Vercel](https://vercel.com) 中导入该仓库
3. 框架自动识别为 `VitePress`
4. 构建命令和输出目录自动配置
5. 点击部署

### 方式二：通过 CLI 部署

```sh
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

Vercel 会自动处理：
- HTTPS/SSL 证书
- CDN 分发
- 自动部署（连接 Git 仓库时）
- 预览部署（每个 PR 生成独立预览地址）

## 部署到 Netlify

### 通过 Git 自动部署

1. 将代码推送到 Git 仓库
2. 在 [Netlify](https://netlify.com) 中导入该仓库
3. 配置构建选项：
   - 构建命令：`npm run build`
   - 发布目录：`docs/.vitepress/dist`
4. 点击部署

### 配置文件方式

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "docs/.vitepress/dist"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 部署到 GitHub Pages

### 创建 GitHub Actions 工作流

创建 `.github/workflows/deploy.yml`：

```yaml
name: 部署文档站点

on:
  push:
    branches: [main]
  # 支持手动触发
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4

      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: 安装依赖
        run: npm ci

      - name: 构建站点
        run: npm run build
        env:
          NODE_ENV: production

      - name: 上传构建产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 配置 GitHub Pages

在仓库 Settings → Pages 中：
- Source 选择 **GitHub Actions**

同时确认 `config.ts` 中 `base` 配置正确：

```ts
// 如果部署到 https://<user>.github.io/<repo>/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/<repo>/' : '/',
})
```

## 部署到 Cloudflare Pages

在项目根目录创建 `.cloudflare.toml`：

```toml
[build]
  command = "npm run build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 构建优化

### 启用 ESM 预打包

```sh
npm install -g esbuild
```

在 `package.json` 中配置：

```json
{
  "scripts": {
    "build": "vitepress build docs",
    "build:analyze": "vitepress build docs --analyze"
  }
}
```

### 图片优化

建议使用 `.webp` 或 `.avif` 格式的图片，配合 `<picture>` 标签：

```html
<picture>
  <source srcset="/image.avif" type="image/avif">
  <source srcset="/image.webp" type="image/webp">
  <img src="/image.png" alt="description">
</picture>
```

## 自定义域名

### 配置 CNAME

在 `docs/public/` 目录下创建 `CNAME` 文件（不含扩展名）：

```
docs.example.com
```

或在 `docs/.vitepress/config.ts` 中设置：

```ts
export default defineConfig({
  base: '/your-repo-name/',
})
```

### DNS 配置

| 平台 | 记录类型 | 主机记录 | 记录值 |
|------|---------|---------|--------|
| Vercel | CNAME | docs | cname.vercel-dns.com |
| Netlify | CNAME | docs | your-site.netlify.app |
| GitHub Pages | A | docs | 185.199.108.153 |
| Cloudflare | CNAME | docs | your-site.pages.dev |

## 多环境部署

### 分支与环境的映射

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches:
      - main      # 生产环境
      - staging   # 预发布环境
      - develop   # 开发环境
```

### 环境变量管理

```yaml
- name: 构建站点
  run: npm run build
  env:
    NODE_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    SITE_URL: ${{ vars.SITE_URL }}
    ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
    ALGOLIA_API_KEY: ${{ secrets.ALGOLIA_API_KEY }}
```

## 部署后检查

站点部署完成后，建议验证以下内容：

- [ ] 首页正常加载，无控制台错误
- [ ] 导航栏和侧边栏链接可正常跳转
- [ ] 搜索功能正常工作
- [ ] 深色模式切换正常
- [ ] 代码高亮渲染正确
- [ ] 移动端响应式布局正常
- [ ] 自定义域名 HTTPS 证书有效
- [ ] HTTP 重定向（HTTP → HTTPS）正常
- [ ] 404 页面正确显示
- [ ] 页面加载性能良好（Lighthouse 评分）

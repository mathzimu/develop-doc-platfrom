# 项目结构

## 顶层结构

```
developer-doc-platform/
├── docs/                    # 文档源码目录
│   ├── .vitepress/          # VitePress 配置与主题
│   ├── guide/               # 平台指南
│   ├── tutorials/           # 技术教程（18个分类）
│   ├── versions/            # 版本存档
│   ├── public/              # 静态资源
│   └── index.md             # 首页
├── .gitignore
├── package.json             # 项目依赖与脚本
└── README.md
```

## 核心配置

### `.vitepress/config.ts`

站点主配置，定义导航栏、侧边栏、搜索、页脚、编辑链接等。

- **导航栏**：教程、部署、版本切换（v1.0 / v0.9）
- **侧边栏**：由 `sidebar.ts` 自动生成
- **搜索**：本地搜索（mini-search），中文界面
- **语言**：`zh-CN`，所有 UI 标签中文化

### `.vitepress/sidebar.ts`

自动侧边栏生成器，按文件系统目录结构动态生成侧边栏。

- 读取每个 Markdown 文件的 `# 标题` 作为侧边栏标签
- 子目录折叠为分组，使用目录下 `index.md` 的标题作为组名
- 数字前缀文件（如 `01-intro.md`）按数字排序
- 排除 `versions/`、`.vitepress/`、`public/`、`assets/` 目录

### `.vitepress/theme/`

- `index.ts` — 继承默认主题，引入自定义样式
- `style.css` — CSS 变量覆盖（品牌色蓝色 `#3b82f6`，暗色模式适配）

## 文档目录

### `guide/` — 平台指南

| 文件 | 说明 |
|------|------|
| `index.md` | 指南首页 |
| `configuration.md` | 配置参考 |
| `deployment.md` | 部署指南（Docker、Vercel、Netlify、GitHub Pages、Cloudflare） |
| `project-structure.md` | 项目结构说明（本文） |

### `tutorials/` — 技术教程

18 个技术分类，每个分类一个子目录，内含 `index.md`：

```
tutorials/
├── index.md                 # 教程总览
├── html/                    # HTML 教程
├── css/                     # CSS 教程
├── javascript/              # JavaScript 教程
├── typescript/              # TypeScript 教程
├── react/                   # React 教程
├── vue/                     # Vue 教程
├── nodejs/                  # Node.js 教程
├── python/                  # Python 教程
├── java/                    # Java 教程
├── go/                      # Go 教程
├── rust/                    # Rust 教程
├── sql/                     # SQL 教程
├── mongodb/                 # MongoDB 教程
├── git/                     # Git 教程
├── bash/                    # Bash 教程
├── docker/                  # Docker 教程
├── cpp/                     # C++ 教程
└── cybersecurity/           # 网络安全教程
```

每个教程文件包含三部分，以 `---` 分隔：

1. **基础内容**：语言/技术的核心语法、常用 API、示例代码
2. **企业级实践**：架构设计、安全规范、测试策略、性能优化、监控告警、CI/CD 集成
3. **生态全景**：相关工具、库、框架的对比与选型建议

### `versions/` — 版本存档

| 文件 | 说明 |
|------|------|
| `v0.9/index.md` | v0.9 存档页 |

通过导航栏版本切换器访问。

### `public/` — 静态资源

| 文件 | 说明 |
|------|------|
| `favicon.svg` | 站点图标 |
| `logo.svg` | 站点 Logo |

## 数据流

```
用户浏览器
    ↓
VitePress 静态站点（.vitepress/dist/）
    ↓
config.ts + sidebar.ts → 渲染导航 + 侧边栏
    ↓
Markdown 文件 → VitePress 编译 → HTML 页面
    ↓
本地搜索（mini-search）索引
```

## 构建与部署

```bash
# 开发
npm run dev          # 启动本地开发服务器（http://localhost:5173）

# 构建
npm run build        # 输出到 docs/.vitepress/dist/

# 预览
npm run preview      # 预览构建产物

# 部署方式
Docker              # Dockerfile + nginx
Vercel              # Git 自动部署
Netlify             # Git 自动部署
GitHub Pages        # GitHub Actions CI/CD
Cloudflare Pages    # Git 自动部署
```

详细部署步骤见 [部署指南](/guide/deployment)。

## 扩展能力

- **OpenAPI 集成**：预留接口，可将 Swagger/OpenAPI 规范导入为 API 文档页
- **多版本支持**：`versions/` 目录结构支持历史版本归档
- **国际化**：VitePress 原生支持多语言，可扩展 `en-US`、`ja-JP` 等语言

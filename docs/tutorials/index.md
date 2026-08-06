# 教程

覆盖 18 个主流技术方向。每个方向统一分为五章，路径一致，便于横向对照。

| 章节 | 定位 |
|------|------|
| `01-basics` 基础语法 | 语法与核心概念，零基础可读 |
| `02-advanced` 进阶深入 | 底层机制、疑难特性、性能与安全 |
| `03-project` 实战项目 | 一个可完整跑通的项目 |
| `04-engineering` 工程实践 | 项目结构、测试、CI/CD、生产配置 |
| `05-ecosystem` 生态全景 | 框架与工具选型对照，附官方链接 |

::: tip 技术细节以官方文档为准
教程负责讲清概念与取舍，具体 API 签名、配置项、版本差异请查阅 [官方文档索引](/reference/official-docs)、[规范与标准](/reference/standards) 与 [工具链与包管理](/reference/tooling)。
:::

## 前端

| 教程 | 说明 | 官方文档 |
|------|------|----------|
| [HTML](/tutorials/html/) | 网页结构标记语言 | [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML) · [WHATWG 规范](https://html.spec.whatwg.org/multipage/) |
| [CSS](/tutorials/css/) | 网页样式描述语言 | [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS) · [CSSWG 草案](https://drafts.csswg.org/) |
| [JavaScript](/tutorials/javascript/) | 网页交互编程语言 | [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) · [ECMA-262](https://tc39.es/ecma262/) |
| [TypeScript](/tutorials/typescript/) | JavaScript 的类型化超集 | [官方文档](https://www.typescriptlang.org/zh/docs/) |
| [React](/tutorials/react/) | 构建用户界面的 JavaScript 库 | [中文文档](https://zh-hans.react.dev/learn) |
| [Vue](/tutorials/vue/) | 渐进式 JavaScript 框架 | [中文文档](https://cn.vuejs.org/guide/introduction.html) |

## 后端

| 教程 | 说明 | 官方文档 |
|------|------|----------|
| [Node.js](/tutorials/nodejs/) | 服务端 JavaScript 运行时 | [API 文档](https://nodejs.org/docs/latest/api/) |
| [Python](/tutorials/python/) | 通用编程语言 | [中文文档](https://docs.python.org/zh-cn/3/) |
| [Java](/tutorials/java/) | 企业级应用编程语言 | [Java SE 文档](https://docs.oracle.com/en/java/javase/21/) · [dev.java](https://dev.java/learn/) |
| [Go](/tutorials/go/) | 高效并发编程语言 | [go.dev/doc](https://go.dev/doc/) · [pkg.go.dev](https://pkg.go.dev/std) |
| [Rust](/tutorials/rust/) | 系统级编程语言 | [The Book](https://doc.rust-lang.org/book/) · [中文版](https://kaisery.github.io/trpl-zh-cn/) |

## 数据库

| 教程 | 说明 | 官方文档 |
|------|------|----------|
| [SQL](/tutorials/sql/) | 结构化查询语言 | [PostgreSQL](https://www.postgresql.org/docs/current/) · [MySQL](https://dev.mysql.com/doc/refman/8.4/en/) |
| [MongoDB](/tutorials/mongodb/) | NoSQL 文档数据库 | [MongoDB Manual](https://www.mongodb.com/docs/manual/) |

## DevOps

| 教程 | 说明 | 官方文档 |
|------|------|----------|
| [Git](/tutorials/git/) | 分布式版本控制 | [git-scm.com/doc](https://git-scm.com/doc) · [Pro Git 中文](https://git-scm.com/book/zh/v2) |
| [Bash](/tutorials/bash/) | 命令行与脚本 | [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html) |
| [Docker](/tutorials/docker/) | 容器化平台 | [docs.docker.com](https://docs.docker.com/) |
| [网络安全](/tutorials/cybersecurity/) | 应用与基础设施安全 | [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [Cheat Sheets](https://cheatsheetseries.owasp.org/) |

## C 语言家族

| 教程 | 说明 | 官方文档 |
|------|------|----------|
| [C++](/tutorials/cpp/) | 高性能系统级编程语言 | [cppreference 中文](https://zh.cppreference.com/w/cpp) · [isocpp.org](https://isocpp.org/) |

## 学习建议

1. **按章节顺序推进**，不要跳过 `01-basics` 里的动手示例。
2. **每章代码都实际跑一遍**，教程中的示例均标注了最低版本要求。
3. **遇到细节先查官方文档**，教程中的链接就是入口；官方与教程冲突时以官方为准。
4. **完成实战项目再看工程实践**，工程章节的取舍在有项目上下文时才好理解。

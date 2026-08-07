# Rust 生态全景

Rust 拥有丰富且活跃的生态系统。本章以表格形式汇总核心库和框架，方便查阅与选型。

## Web 框架

| 框架 | Stars | 特点 | 适用场景 |
|------|-------|------|----------|
| [Axum](https://github.com/tokio-rs/axum) | 20k+ | Tokio 生态、tower 中间件、提取器模式 | 生产级 API 服务 |
| [Actix-web](https://github.com/actix/actix-web) | 22k+ | 性能极高、基于 actor 模型 | 高吞吐量服务 |
| [Rocket](https://github.com/rwf2/Rocket) | 24k+ | 声明式路由、编译期检查 | 快速原型、小到中型项目 |
| [Warp](https://github.com/seanmonstar/warp) | 9k+ | 组合子模式、Filter 链 | 需要灵活中间件的项目 |
| [Poem](https://github.com/poem-web/poem) | 3k+ | 同时支持 HTTP1/2、WebSocket | 全栈 Rust 应用 |

## ORM 与数据库

| 库 | Stars | 类型 | 特点 |
|-----|-------|------|------|
| [Diesel](https://github.com/diesel-rs/diesel) | 12k+ | ORM | 编译期查询检查、类型安全、支持 PostgreSQL/MySQL/SQLite |
| [SeaORM](https://github.com/SeaQL/sea-orm) | 7k+ | ORM | 异步、动态查询、迁移工具、更接近 ActiveRecord 风格 |
| [SQLx](https://github.com/launchbadge/sqlx) | 13k+ | 异步 SQL | 编译期检查 SQL、纯异步、支持 PostgreSQL/MySQL/SQLite |

## 序列化

| 库 | Stars | 类型 | 特点 |
|-----|-------|------|------|
| [Serde](https://github.com/serde-rs/serde) | 9k+ | 序列化框架 | 零拷贝、支持 JSON/YAML/TOML/MessagePack 等 20+ 格式 |

## 异步运行时

| 运行时 | Stars | 特点 | 适用场景 |
|--------|-------|------|----------|
| [Tokio](https://github.com/tokio-rs/tokio) | 26k+ | 成熟、生态丰富、工作窃取调度 | 生产级首选 |
| [async-std](https://github.com/async-rs/async-std) | 8k+ | API 接近 std、入门友好 | 小到中型项目 |
| [smol](https://github.com/smol-rs/smol) | 3k+ | 极简、轻量、单线程友好 | 嵌入式或简单场景 |

## CLI 工具

| 库 | Stars | 特点 |
|-----|-------|------|
| [clap](https://github.com/clap-rs/clap) | 14k+ | 功能强大、derive 宏、自动生成帮助 |
| [structopt](https://github.com/TeXitoi/structopt) | 2k+ | 已合并入 clap v3+，推荐直接用 clap |

## 开发工具

| 工具 | 用途 | 安装/用法 |
|------|------|-----------|
| [rustfmt](https://github.com/rust-lang/rustfmt) | 代码格式化 | `rustup component add rustfmt` → `cargo fmt` |
| [clippy](https://github.com/rust-lang/rust-clippy) | 代码检查（lint） | `rustup component add clippy` → `cargo clippy` |
| [cargo-edit](https://github.com/killercup/cargo-edit) | 管理依赖 | `cargo install cargo-edit` → `cargo add/rm/upgrade` |
| [cargo-watch](https://github.com/watchexec/cargo-watch) | 文件变化自动执行 | `cargo install cargo-watch` → `cargo watch -x test` |

## 其他常用库

| 领域 | 推荐库 |
|------|--------|
| HTTP 客户端 | `reqwest` |
| 日志 | `tracing`, `log` |
| 错误处理 | `thiserror`, `anyhow` |
| 日期时间 | `chrono`, `time` |
| 正则 | `regex` |
| 加密 | `ring`, `rustls` |
| 测试 | `criterion`（基准测试）, `proptest`（属性测试） |
| 文件系统 | `walkdir`, `glob` |
| 解析器 | `nom`, `pest`, `combine` |
| GUI | `egui`, `iced`, `tauri`（桌面应用） |
| WASM | `wasm-bindgen`, `yew`, `leptos` |

```sh
# 常用命令速查
cargo add reqwest          # 安装依赖
cargo fmt                  # 格式化代码
cargo clippy               # 代码 lint
cargo watch -x test        # 监听变化自动测试
cargo outdated             # 检查过时依赖
cargo audit                # 检查安全漏洞
```

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 语言与标准库 | [The Rust Book](https://doc.rust-lang.org/book/) · [std 文档](https://doc.rust-lang.org/std/) · [Rust Reference](https://doc.rust-lang.org/reference/) |
| 包管理 | [Cargo Book](https://doc.rust-lang.org/cargo/) · [crates.io](https://crates.io/) |
| Web 框架 | [Axum docs.rs](https://docs.rs/axum/latest/axum/) · [Actix Web](https://actix.rs/docs/) · [Rocket](https://rocket.rs/) |
| ORM/数据库 | [Diesel](https://diesel.rs/) · [SeaORM](https://www.sea-orm.io/) · [SQLx](https://github.com/launchbadge/sqlx) |
| 序列化/异步 | [Serde](https://serde.rs/) · [Tokio](https://tokio.rs/tokio/tutorial) |
| 开发工具 | [rustfmt](https://rust-lang.github.io/rustfmt/) · [Clippy](https://doc.rust-lang.org/clippy/) · [cargo-edit](https://docs.rs/cargo-edit) |

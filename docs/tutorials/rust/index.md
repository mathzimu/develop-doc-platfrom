# Rust 教程

Rust 是一种系统级编程语言，专注于内存安全、并发安全和性能。Rust 的所有权系统在编译时保证内存安全，无需垃圾回收器。

本教程从基础语法到企业级实践，带你全面掌握 Rust 开发。

## 目录

- [**01 基础语法**](/tutorials/rust/01-basics) — 变量、所有权、结构体、枚举、模式匹配、错误处理、泛型与 trait、集合、Cargo
- [**02 进阶深入**](/tutorials/rust/02-advanced) — 生命周期、智能指针、并发、宏、unsafe、async/await、测试
- [**03 实战项目：JSON 解析器**](/tutorials/rust/03-project) — 从零实现一个命令行 JSON 解析器
- [**04 工程实践**](/tutorials/rust/04-engineering) — 项目结构、Actix-Web API、错误处理、配置管理、测试、CI/CD、日志
- [**05 生态全景**](/tutorials/rust/05-ecosystem) — Web 框架、ORM、序列化、异步运行时、CLI 工具

## 快速开始

```sh
rustc --version
cargo --version
cargo new my-project
cargo run
cargo build --release
```

## 前置要求

- 安装 Rust：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`（见 [rustup 官方安装说明](https://www.rust-lang.org/zh-CN/tools/install)）
- 基础编程概念（变量、函数、控制流）
- 了解命令行操作

## 官方文档

所有权与生命周期规则、trait 解析、unsafe 约束等细节以下列一手文档为准。

| 类型 | 链接 |
|------|------|
| 官方书籍 | [The Rust Book](https://doc.rust-lang.org/book/) · [中文版](https://kaisery.github.io/trpl-zh-cn/) |
| 标准库 | [std 文档](https://doc.rust-lang.org/std/) |
| 语言参考 | [The Rust Reference](https://doc.rust-lang.org/reference/) |
| 示例驱动学习 | [Rust by Example](https://doc.rust-lang.org/rust-by-example/) |
| 编译错误索引 | [Error Index](https://doc.rust-lang.org/error_codes/error-index.html) |
| 包管理 | [Cargo Book](https://doc.rust-lang.org/cargo/) · [crates.io](https://crates.io/) · [docs.rs](https://docs.rs/) |
| 异步 | [Async Book](https://rust-lang.github.io/async-book/) · [Tokio 教程](https://tokio.rs/tokio/tutorial) |
| unsafe 与 FFI | [Rustonomicon](https://doc.rust-lang.org/nomicon/) |
| 宏 | [The Little Book of Rust Macros](https://veykril.github.io/tlborm/) |
| Web 框架 | [Axum](https://docs.rs/axum/latest/axum/) · [Actix Web](https://actix.rs/docs/) |
| 常用库 | [serde](https://serde.rs/) · [SQLx](https://docs.rs/sqlx/latest/sqlx/) · [clap](https://docs.rs/clap/latest/clap/) · [anyhow](https://docs.rs/anyhow/latest/anyhow/) |
| 质量工具 | [Clippy](https://doc.rust-lang.org/clippy/) · [rustfmt](https://rust-lang.github.io/rustfmt/) |
| 版本与提案 | [Edition Guide](https://doc.rust-lang.org/edition-guide/) · [RFCs](https://rust-lang.github.io/rfcs/) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

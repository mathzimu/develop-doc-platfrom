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

- 安装 Rust：`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- 基础编程概念（变量、函数、控制流）

# Rust 教程

Rust 是一种系统级编程语言，专注于内存安全、并发安全和性能。Rust 的所有权系统在编译时保证内存安全，无需垃圾回收器。

```sh
rustc --version
cargo --version
cargo new my-project
cargo run
cargo build --release
```

## 基础语法

```rust
fn main() {
    // 变量（默认不可变）
    let x = 5;
    let mut y = 10;  // mut 使其可变
    y += 1;

    // 常量
    const MAX_POINTS: u32 = 100_000;

    // 类型标注
    let num: i32 = 42;
    let pi: f64 = 3.14159;
    let is_active: bool = true;
    let letter: char = 'R';
    let tuple: (i32, f64, &str) = (500, 6.4, "hello");
    let (a, b, c) = tuple;

    // 基本类型
    // i8, i16, i32, i64, i128, isize
    // u8, u16, u32, u64, u128, usize
    // f32, f64
    // bool, char

    println!("Hello, Rust! {}", num);
}
```

## 所有权系统

Rust 的核心创新：每个值都有且只有一个所有者。

```rust
fn main() {
    // 所有权转移
    let s1 = String::from("hello");
    let s2 = s1;  // s1 失效，所有权移至 s2
    // println!("{}", s1);  // 编译错误！

    // 克隆（深拷贝）
    let s3 = s2.clone();
    println!("{} {}", s2, s3);  // 都有效

    // 复制类型（实现 Copy trait）
    let a = 42;
    let b = a;  // a 仍然有效（整数实现 Copy）
    println!("{} {}", a, b);  // 可以

    // 引用与借用
    let s = String::from("hello");

    // 不可变引用（可多个）
    let len = calculate_length(&s);
    println!("'{}' 的长度是 {}", s, len);

    // 可变引用（唯一）
    let mut s = String::from("hello");
    change(&mut s);

    // 切片
    let s = String::from("hello world");
    let hello = &s[0..5];  // "hello"
    let world = &s[6..11]; // "world"

    // 数组切片
    let arr = [1, 2, 3, 4, 5];
    let slice = &arr[1..3];
}

fn calculate_length(s: &String) -> usize {  // 借用
    s.len()
}

fn change(s: &mut String) {  // 可变借用
    s.push_str(" world");
}
```

## 结构与枚举

```rust
// 结构体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    // 创建实例
    let user = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
        active: true,
    };

    // 更新语法
    let user2 = User {
        email: String::from("bob@example.com"),
        ..user
    };

    // 元组结构体
    struct Color(i32, i32, i32);
    let black = Color(0, 0, 0);

    // 方法
    let rect = Rectangle { width: 30, height: 50 };
    println!("面积: {}", rect.area());
}

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn square(size: u32) -> Rectangle {  // 关联函数
        Rectangle { width: size, height: size }
    }
}
```

```rust
// 枚举
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

// Option 枚举（代替 null）
fn divide(numerator: f64, denominator: f64) -> Option<f64> {
    if denominator == 0.0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

// Result 枚举（错误处理）
use std::fs::File;

fn open_file() -> Result<File, std::io::Error> {
    File::open("hello.txt")
}
```

## 模式匹配

```rust
fn main() {
    let number = 3;

    match number {
        1 => println!("一"),
        2 | 3 => println!("二或三"),
        4..=10 => println!("四到十"),
        _ => println!("其他"),
    }

    // if let（简洁匹配）
    let config_max = Some(3u8);
    if let Some(max) = config_max {
        println!("最大值是 {}", max);
    }

    // 解构
    let p = Point { x: 0, y: 7 };
    let Point { x, y } = p;
    println!("({}, {})", x, y);
}
```

## 错误处理

```rust
// 使用 Result
use std::fs;
use std::io;

fn read_file(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}

// ? 运算符（传播错误）
fn read_username() -> Result<String, io::Error> {
    let content = fs::read_to_string("user.txt")?;
    Ok(content.trim().to_string())
}

// panic! 不可恢复错误
fn main() {
    let v = vec![1, 2, 3];
    v[99];  // 会 panic
}
```

## 泛型与 trait

```rust
// 泛型函数
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// trait（类似接口）
pub trait Summary {
    fn summarize(&self) -> String;

    // 默认实现
    fn summary_default(&self) -> String {
        String::from("(无内容)")
    }
}

pub struct Article {
    pub headline: String,
    pub content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}...", &self.headline)
    }
}

// trait 作为参数
fn notify(item: &impl Summary) {
    println!("{}", item.summarize());
}
```

## 常用工具

```rust
// Vector
let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let third = &v[2];

// String
let mut s = String::from("hello");
s.push_str(" world");
s.push('!');

// HashMap
use std::collections::HashMap;
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

// 迭代器
let nums = vec![1, 2, 3, 4, 5];
let sum: i32 = nums.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
    .sum();

// 闭包
let add_one = |x: i32| x + 1;
let result = add_one(5);
```

## Cargo 与包管理

```toml
# Cargo.toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"
```

```sh
cargo build         # 调试构建
cargo build --release  # 发布构建
cargo check         # 仅检查（不生成二进制）
cargo test
cargo fmt           # 格式化代码
cargo clippy        # 代码检查
cargo add serde     # 添加依赖

---

# 企业级实践

## 项目结构

```
myapp/
├── Cargo.toml
├── src/
│   ├── main.rs          # 入口
│   ├── config.rs        # 配置
│   ├── api/             # API 层
│   │   ├── mod.rs
│   │   ├── routes.rs
│   │   └── errors.rs
│   ├── domain/          # 领域层
│   │   ├── mod.rs
│   │   └── models.rs
│   ├── infrastructure/  # 基础设施
│   │   ├── mod.rs
│   │   ├── db.rs
│   │   └── logging.rs
│   └── bin/             # 二进制入口
├── tests/
└── migrations/
```

## Actix-Web 生产级 API

```rust
use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, middleware};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use tracing_actix_web::TracingLogger;
use std::sync::Arc;

#[derive(Serialize)]
struct User {
    id: i32,
    name: String,
    email: String,
}

#[derive(Deserialize)]
struct Pagination {
    page: Option<i32>,
    size: Option<i32>,
}

async fn list_users(
    pool: web::Data<PgPool>,
    query: web::Query<Pagination>,
) -> Result<HttpResponse, actix_web::Error> {
    let page = query.page.unwrap_or(1);
    let size = query.size.unwrap_or(20);
    let offset = (page - 1) * size;

    let users = sqlx::query_as::<_, User>(
        "SELECT id, name, email FROM users LIMIT $1 OFFSET $2"
    )
    .bind(size)
    .bind(offset)
    .fetch_all(pool.get_ref())
    .await
    .map_err(|e| {
        tracing::error!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("database error")
    })?;

    Ok(HttpResponse::Ok().json(users))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .init();

    let pool = PgPool::connect(&std::env::var("DATABASE_URL").unwrap())
        .await
        .expect("Failed to connect to database");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(TracingLogger::default())
            .configure(configure_routes)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .route("/users", web::get().to(list_users))
            .route("/users", web::post().to(create_user))
    );
}
```

## 错误处理

```rust
use std::fmt;
use actix_web::{HttpResponse, ResponseError};

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    Validation(String),
    Database(String),
    Unauthorized,
    Internal(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::Validation(msg) => write!(f, "Validation: {}", msg),
            AppError::Database(msg) => write!(f, "Database: {}", msg),
            AppError::Unauthorized => write!(f, "Unauthorized"),
            AppError::Internal(msg) => write!(f, "Internal: {}", msg),
        }
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        match self {
            AppError::NotFound(msg) => HttpResponse::NotFound().json(serde_json::json!({
                "error": "NOT_FOUND",
                "message": msg,
            })),
            AppError::Validation(msg) => HttpResponse::BadRequest().json(serde_json::json!({
                "error": "VALIDATION_ERROR",
                "message": msg,
            })),
            AppError::Unauthorized => HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "UNAUTHORIZED",
                "message": "需要登录",
            })),
            _ => HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "INTERNAL_ERROR",
                "message": "服务器内部错误",
            })),
        }
    }
}
```

## 配置管理

```rust
// config.rs
use config::{Config, ConfigError, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub redis_url: String,
    pub jwt_secret: String,
    pub server: ServerConfig,
    pub log: LogConfig,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub workers: usize,
}

#[derive(Debug, Deserialize, Clone)]
pub struct LogConfig {
    pub level: String,
    pub json: bool,
}

impl AppConfig {
    pub fn new() -> Result<Self, ConfigError> {
        let builder = Config::builder()
            .add_source(File::with_name("config/default"))
            .add_source(File::with_name("config/production").required(false))
            .add_source(Environment::with_prefix("APP"))
            .build()?;
        builder.try_deserialize()
    }
}
```

```

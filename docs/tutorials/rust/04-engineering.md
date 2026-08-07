# Rust 工程实践

掌握基础后，本章关注 Rust 企业级项目实践：项目结构、Web API、错误处理、配置管理、测试、CI/CD、基准测试和日志。

## 项目结构

一个生产级 Rust 项目的推荐结构：

```
myapp/
├── Cargo.toml
├── src/
│   ├── main.rs              # 入口
│   ├── lib.rs               # 库根（便于集成测试）
│   ├── config.rs            # 配置
│   ├── api/                 # API 层
│   │   ├── mod.rs
│   │   ├── routes.rs
│   │   └── errors.rs
│   ├── domain/              # 领域层
│   │   ├── mod.rs
│   │   └── models.rs
│   ├── infrastructure/      # 基础设施
│   │   ├── mod.rs
│   │   ├── db.rs
│   │   └── logging.rs
│   └── bin/                 # 多个二进制入口
├── tests/                   # 集成测试
├── benches/                 # 基准测试
└── migrations/              # 数据库迁移
```

## Actix-Web 生产级 API

```toml
[dependencies]
actix-web = "4"
actix-rt = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres"] }
tracing = "0.1"
tracing-subscriber = "0.3"
tracing-actix-web = "0.7"
tokio = { version = "1", features = ["full"] }
config = "0.13"
```

```rust
use actix_web::{web, App, HttpServer, HttpResponse, middleware};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use tracing_actix_web::TracingLogger;

#[derive(Serialize, Deserialize, Debug, Clone)]
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
        "SELECT id, name, email FROM users LIMIT $1 OFFSET $2",
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
            .route("/users", web::post().to(create_user)),
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
# config/default.toml
[database]
url = "postgres://localhost:5432/myapp"

[server]
host = "127.0.0.1"
port = 8080
workers = 4

[log]
level = "info"
json = false
```

## 日志（tracing crate）

```rust
use tracing::{info, warn, error, debug, span, Level};
use tracing_subscriber::FmtSubscriber;

fn setup_logging() {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .with_file(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .with_target(false)
        .json()  // JSON 格式输出（适合生产）
        .init();
}

// 使用
async fn process_request(user_id: i32) {
    let span = span!(Level::INFO, "process_request", user_id = user_id);
    let _guard = span.enter();

    info!("开始处理请求");
    // ...
    warn!("响应缓慢");
    // ...
    error!("请求失败");
}
```

## 基准测试

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 | 1 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn benchmark_fibonacci(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, benchmark_fibonacci);
criterion_main!(benches);
```

```sh
cargo bench
```

## CI/CD 配置

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CARGO_TERM_COLOR: always

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
        with:
          components: clippy, rustfmt
      - name: Check formatting
        run: cargo fmt -- --check
      - name: Clippy
        run: cargo clippy -- -D warnings
      - name: Build
        run: cargo build --verbose
      - name: Run tests
        run: cargo test --verbose
      - name: Run benchmarks
        run: cargo bench --verbose || true
```

## 集成测试

```rust
// tests/api_test.rs
use myapp::configure_app;

#[actix_web::test]
async fn test_list_users() {
    let app = actix_web::test::init_service(configure_app()).await;
    let req = actix_web::test::TestRequest::get()
        .uri("/api/v1/users")
        .to_request();
    let resp = actix_web::test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}
```

## 依赖管理最佳实践

- 使用 `cargo update` 定期更新依赖
- 用 `cargo audit` 检查安全漏洞
- 用 `cargo deny` 管理许可证
- 拆分为 workspace 管理多 crate 项目

```toml
# 顶层 Cargo.toml
[workspace]
members = [
    "crates/core",
    "crates/api",
    "crates/cli",
]
```

继续学习请前往 [05-生态全景](/tutorials/rust/05-ecosystem)。

## 官方文档

| 主题 | 链接 |
|------|------|
| 项目结构 | [Cargo Book](https://doc.rust-lang.org/cargo/) · [Cargo Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html) |
| 错误处理 | [thiserror](https://docs.rs/thiserror) · [anyhow](https://docs.rs/anyhow) |
| 配置管理 | [config-rs](https://github.com/mehcode/config-rs) · [dotenvy](https://docs.rs/dotenvy) |
| 测试 | [Cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html) · [Rust Book 测试](https://doc.rust-lang.org/book/ch11-00-testing.html) |
| Lint/Format | [Clippy](https://doc.rust-lang.org/clippy/) · [rustfmt](https://rust-lang.github.io/rustfmt/) |
| 日志/可观测 | [tracing](https://docs.rs/tracing) · [OpenTelemetry Rust](https://docs.rs/opentelemetry) |
| CI/CD | [GitHub Actions](https://docs.github.com/zh/actions) · [actions-rs](https://github.com/actions-rs) |

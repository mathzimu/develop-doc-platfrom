# Go 生态全景

## Web 框架

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| [Gin](https://github.com/gin-gonic/gin) | 高性能、中间件丰富 | REST API 首选 |
| [Echo](https://github.com/labstack/echo) | 简洁、内置校验和渲染 | 中小型项目 |
| [Fiber](https://github.com/gofiber/fiber) | 类 Express 风格、极快 | 高性能场景 |
| [Chi](https://github.com/go-chi/chi) | 轻量、兼容 net/http | 基础 HTTP 服务 |
| [Huma](https://github.com/danielgtaylor/huma) | OpenAPI 优先、类型安全 | API 文档驱动开发 |

## ORM 与数据库

| 库 | 特点 | 适用场景 |
|----|------|----------|
| [GORM](https://github.com/go-gorm/gorm) | 功能全面、自动迁移 | CRUD 密集型应用 |
| [Ent](https://github.com/ent/ent) | Schema 即代码、类型安全 | 复杂领域模型 |
| [sqlx](https://github.com/jmoiron/sqlx) | 轻量、贴近 SQL | 需要精细 SQL 控制 |
| [pgx](https://github.com/jackc/pgx) | PostgreSQL 专用驱动 | 高性能 PG 场景 |

## 工具链

| 工具 | 用途 | 安装 |
|------|------|------|
| [Delve](https://github.com/go-delve/delve) | 断点调试 | `go install github.com/go-delve/delve/cmd/dlv@latest` |
| [golangci-lint](https://github.com/golangci/golangci-lint) | 聚合 lint | `brew install golangci-lint` |
| [mockgen](https://github.com/uber-go/mock) | 生成 mock | `go install go.uber.org/mock/mockgen@latest` |
| [swag](https://github.com/swaggo/swag) | OpenAPI 文档 | `go install github.com/swaggo/swag/cmd/swag@latest` |

## 监控与可观测性

| 工具 | 说明 |
|------|------|
| [OpenTelemetry](https://opentelemetry.io/) | 分布式追踪、指标、日志统一 SDK |
| [Prometheus](https://prometheus.io/) | 指标采集与告警，配合 Grafana 可视化 |
| [pprof](https://pkg.go.dev/net/http/pprof) | Go 内置性能分析工具 |
| [zap](https://github.com/uber-go/zap) | 高性能结构化日志库 |

## 微服务

| 框架 | 特点 |
|------|------|
| [go-kit](https://github.com/go-kit/kit) | 库式微服务工具集，适合复杂业务 |
| [go-micro](https://github.com/go-micro/go-micro) | 插件化微服务框架 |
| [Temporal](https://github.com/temporalio/temporal) | 工作流引擎，适合长流程任务编排 |
| [NATS](https://github.com/nats-io/nats-server) | 高性能消息中间件 |

## 官方文档与延伸阅读

- **官方文档**：[go.dev/doc](https://go.dev/doc/) · [Go Spec（语言规范）](https://go.dev/ref/spec) · [pkg.go.dev 标准库](https://pkg.go.dev/std) · [Go Modules](https://go.dev/ref/mod) · [Go Blog](https://go.dev/blog/) · [Effective Go](https://go.dev/doc/effective_go)
- **Web 框架**：[Gin](https://gin-gonic.com/docs/) · [Echo](https://echo.labstack.com/docs) · [Fiber](https://docs.gofiber.io/) · [chi](https://github.com/go-chi/chi)
- **ORM/数据库**：[GORM](https://gorm.io/zh_CN/docs/) · [Ent](https://entgo.io/) · [sqlx](https://github.com/jmoiron/sqlx) · [pgx](https://github.com/jackc/pgx) · [database/sql](https://pkg.go.dev/database/sql)
- **工具链**：[Delve](https://github.com/go-delve/delve) · [golangci-lint](https://golangci-lint.run/) · [go vet](https://pkg.go.dev/cmd/vet) · [pprof](https://pkg.go.dev/net/http/pprof)
- **可观测性**：[OpenTelemetry](https://opentelemetry.io/docs/) · [Prometheus](https://prometheus.io/docs/) · [zap](https://github.com/uber-go/zap)
- **源码与提案**：[golang/go](https://github.com/golang/go) · [Go Proposals](https://github.com/golang/proposal)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

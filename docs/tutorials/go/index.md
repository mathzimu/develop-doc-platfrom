# Go 教程

Go（Golang）是 Google 开发的开源编程语言，以简洁的语法、高效的并发模型和快速的编译速度著称。

```sh
go version
go mod init my-project
go run main.go
go build -o app
go test ./...
```

## 目录

- **[01 - Go 基础语法](/tutorials/go/01-basics)**：变量、控制流、函数、数据结构、方法、接口、并发、错误处理、标准库
- **[02 - Go 进阶深入](/tutorials/go/02-advanced)**：并发模式、接口底层、反射、测试进阶、内存模型、代码生成、Go 1.21+ 新特性
- **[03 - 实战项目：URL 缩短服务](/tutorials/go/03-project)**：HTTP 服务、短码生成、Redis 缓存、PostgreSQL 存储、完整测试
- **[04 - Go 工程实践](/tutorials/go/04-engineering)**：项目结构、Gin 框架、统一响应、数据库操作、依赖注入、CI/CD、Docker
- **[05 - Go 生态全景](/tutorials/go/05-ecosystem)**：Web 框架、ORM、工具链、监控、微服务

## 前置要求

- 安装 Go 1.21+（[下载与安装](https://go.dev/doc/install)）
- 熟悉基本编程概念
- （可选）了解 Web 开发和数据库基础

## 官方文档与延伸阅读

- **官方文档**：[go.dev/doc](https://go.dev/doc/) · [新手教程](https://go.dev/doc/tutorial/getting-started) · [Go Spec](https://go.dev/ref/spec) · [pkg.go.dev/std](https://pkg.go.dev/std) · [Go Modules Reference](https://go.dev/ref/mod)
- **命令与工具**：[go 命令文档](https://pkg.go.dev/cmd/go) · [go vet](https://pkg.go.dev/cmd/vet) · [Go Blog](https://go.dev/blog/) · [Go Proposals](https://github.com/golang/proposal)
- **并发与内存**：[Go Memory Model](https://go.dev/ref/mem) · [Concurrency Patterns（博客）](https://go.dev/blog/pipelines)
- **编码建议**：[Effective Go](https://go.dev/doc/effective_go) · [Code Review Comments](https://go.dev/wiki/CodeReviewComments)
- **测试与性能**：[testing 包](https://pkg.go.dev/testing) · [pprof 诊断](https://go.dev/doc/diagnostics)
- **泛型**：[泛型教程](https://go.dev/doc/tutorial/generics)
- **Web 框架**：[Gin](https://gin-gonic.com/docs/) · [Echo](https://echo.labstack.com/docs) · [Fiber](https://docs.gofiber.io/) · [Chi](https://go-chi.io/)
- **数据库**：[GORM 中文](https://gorm.io/zh_CN/docs/) · [Ent](https://entgo.io/docs/getting-started) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5)
- **质量工具**：[golangci-lint](https://golangci-lint.run/)
- **版本与发布**：[Release History](https://go.dev/doc/devel/release) · [golang/go](https://github.com/golang/go)

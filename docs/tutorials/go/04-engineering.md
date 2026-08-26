# Go 工程实践

## 项目结构

```
myapp/
├── cmd/
│   └── server/
│       └── main.go          # 入口
├── internal/
│   ├── handler/             # HTTP 处理器
│   ├── service/             # 业务逻辑
│   ├── repository/          # 数据访问
│   ├── middleware/          # 中间件
│   ├── model/               # 数据模型
│   ├── dto/                 # 传输对象
│   └── config/              # 配置
├── pkg/
│   ├── logger/              # 日志
│   ├── validator/           # 验证器
│   └── response/            # 统一响应
├── migrations/              # 数据库迁移
├── api/                     # API 定义 (OpenAPI)
├── Dockerfile
├── go.mod
└── Makefile
```

## 使用 Gin 框架

```go
package main

import (
    "github.com/gin-gonic/gin"
    "go.uber.org/zap"
)

func main() {
    r := gin.New()
    r.Use(gin.Logger())
    r.Use(gin.Recovery())
    r.Use(corsMiddleware())
    r.Use(requestIDMiddleware())

    api := r.Group("/api/v1")
    {
        api.GET("/users", handler.ListUsers)
        api.POST("/users", handler.CreateUser)
        api.GET("/users/:id", handler.GetUser)
    }

    srv := &http.Server{
        Addr:         ":8080",
        Handler:      r,
        ReadTimeout:  15 * time.Second,
        WriteTimeout: 15 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
}
```

## 统一响应格式

```go
// pkg/response/response.go
type APIResponse struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Meta    *Pagination `json:"meta,omitempty"`
}

type Pagination struct {
    Page  int `json:"page"`
    Size  int `json:"size"`
    Total int `json:"total"`
}

func Success(c *gin.Context, data interface{}) {
    c.JSON(http.StatusOK, APIResponse{
        Code:    0,
        Message: "success",
        Data:    data,
    })
}

func Error(c *gin.Context, httpStatus int, message string) {
    c.JSON(httpStatus, APIResponse{
        Code:    httpStatus,
        Message: message,
    })
}

func Paginated(c *gin.Context, data interface{}, page, size, total int) {
    c.JSON(http.StatusOK, APIResponse{
        Code:    0,
        Message: "success",
        Data:    data,
        Meta:    &Pagination{Page: page, Size: size, Total: total},
    })
}
```

## 数据库操作

```go
// internal/repository/user.go
type UserRepository struct {
    db *sql.DB
}

func (r *UserRepository) FindPaginated(ctx context.Context, page, size int) ([]model.User, int, error) {
    var total int
    err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&total)
    if err != nil {
        return nil, 0, err
    }

    offset := (page - 1) * size
    rows, err := r.db.QueryContext(ctx,
        "SELECT id, name, email FROM users ORDER BY id LIMIT $1 OFFSET $2",
        size, offset,
    )
    if err != nil {
        return nil, 0, err
    }
    defer rows.Close()

    var users []model.User
    for rows.Next() {
        var u model.User
        if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
            return nil, 0, err
        }
        users = append(users, u)
    }
    return users, total, nil
}
```

## 依赖注入

```go
// cmd/server/main.go
func main() {
    db := initDatabase()
    userRepo := repository.NewUserRepository(db)
    userSvc := service.NewUserService(userRepo)
    userHdl := handler.NewUserHandler(userSvc)

    r := gin.Default()
    api := r.Group("/api/v1")
    api.GET("/users", userHdl.List)
    api.POST("/users", userHdl.Create)
}
```

## Makefile

```makefile
.PHONY: build test lint run clean

APP=myapp

build:
	go build -o bin/$(APP) ./cmd/server

run:
	go run ./cmd/server

test:
	go test -v -race -cover ./...

lint:
	golangci-lint run ./...

clean:
	rm -rf bin/

docker-build:
	docker build -t $(APP) .

docker-run:
	docker run -p 8080:8080 $(APP)
```

## Docker 多阶段构建

```dockerfile
# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app/server ./cmd/server

# Stage 2: Run
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
```

## CI/CD (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go mod download
      - run: go test -v -race -cover ./...
      - run: go vet ./...
```

## 官方文档与延伸阅读

- **官方文档**：[go.dev/doc](https://go.dev/doc/) · [Go Spec](https://go.dev/ref/spec) · [pkg.go.dev 标准库](https://pkg.go.dev/std)
- **项目结构与模块**：[go 命令文档](https://pkg.go.dev/cmd/go) · [Go Modules Reference](https://go.dev/ref/mod)
- **依赖注入**：[wire](https://github.com/google/wire) · [fx](https://github.com/uber-go/fx)
- **Lint 与静态检查**：[golangci-lint](https://golangci-lint.run/) · [go vet](https://pkg.go.dev/cmd/vet)
- **测试**：[testing 包](https://pkg.go.dev/testing) · [testify](https://github.com/stretchr/testify)
- **数据库**：[GORM](https://gorm.io/zh_CN/docs/) · [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5)
- **CI/CD**：[GitHub Actions](https://docs.github.com/zh/actions)
- **常用框架**：[Gin](https://gin-gonic.com/docs/) · [Echo](https://echo.labstack.com/docs)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

# 实战项目：URL 缩短服务

## 项目结构

```
url-shortener/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── config/
├── pkg/
│   ├── shortcode/
│   └── response/
├── go.mod
└── Makefile
```

## 短码生成算法

```go
package shortcode

import (
    "crypto/rand"
    "math/big"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func Generate(length int) (string, error) {
    code := make([]byte, length)
    for i := range code {
        n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
        if err != nil {
            return "", err
        }
        code[i] = charset[n.Int64()]
    }
    return string(code), nil
}
```

## 数据模型

```go
package model

import "time"

type URL struct {
    ID        int64     `json:"id" db:"id"`
    ShortCode string    `json:"short_code" db:"short_code"`
    LongURL   string    `json:"long_url" db:"long_url"`
    Clicks    int64     `json:"clicks" db:"clicks"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}
```

## 数据库存储

```go
package repository

type URLRepository struct {
    db *sql.DB
}

func (r *URLRepository) Save(ctx context.Context, url *model.URL) error {
    _, err := r.db.ExecContext(ctx,
        `INSERT INTO urls (short_code, long_url) VALUES ($1, $2)`,
        url.ShortCode, url.LongURL)
    return err
}

func (r *URLRepository) FindByShortCode(ctx context.Context, code string) (*model.URL, error) {
    u := &model.URL{}
    err := r.db.QueryRowContext(ctx,
        `SELECT id, short_code, long_url, clicks, created_at FROM urls WHERE short_code = $1`,
        code).Scan(&u.ID, &u.ShortCode, &u.LongURL, &u.Clicks, &u.CreatedAt)
    if err != nil {
        return nil, err
    }
    return u, nil
}

func (r *URLRepository) IncrementClicks(ctx context.Context, id int64) error {
    _, err := r.db.ExecContext(ctx,
        `UPDATE urls SET clicks = clicks + 1 WHERE id = $1`, id)
    return err
}
```

## Redis 缓存

```go
package cache

type URLCache struct {
    client *redis.Client
    ttl    time.Duration
}

func (c *URLCache) Get(ctx context.Context, code string) (*model.URL, error) {
    data, err := c.client.Get(ctx, "url:"+code).Bytes()
    if err != nil {
        return nil, err
    }
    var u model.URL
    json.Unmarshal(data, &u)
    return &u, nil
}

func (c *URLCache) Set(ctx context.Context, url *model.URL) error {
    data, _ := json.Marshal(url)
    return c.client.Set(ctx, "url:"+url.ShortCode, data, c.ttl).Err()
}
```

## HTTP Handler

```go
package handler

type URLHandler struct {
    svc *service.URLService
}

func (h *URLHandler) Create(c *gin.Context) {
    var req struct {
        URL string `json:"url" binding:"required,url"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, 400, "无效的 URL")
        return
    }

    u, err := h.svc.CreateShortURL(c.Request.Context(), req.URL)
    if err != nil {
        response.Error(c, 500, "创建失败")
        return
    }
    response.Success(c, u)
}

func (h *URLHandler) Redirect(c *gin.Context) {
    code := c.Param("code")
    u, err := h.svc.GetLongURL(c.Request.Context(), code)
    if err != nil {
        response.Error(c, 404, "链接不存在")
        return
    }
    c.Redirect(http.StatusMovedPermanently, u.LongURL)
}
```

## 路由和启动

```go
func main() {
    cfg := config.Load()
    db := initDB(cfg)
    rdb := initRedis(cfg)

    urlRepo := repository.NewURLRepository(db)
    urlCache := cache.NewURLCache(rdb, 10*time.Minute)
    urlSvc := service.NewURLService(urlRepo, urlCache)
    urlHdl := handler.NewURLHandler(urlSvc)

    r := gin.Default()
    r.POST("/api/shorten", urlHdl.Create)
    r.GET("/:code", urlHdl.Redirect)

    r.Run(":" + cfg.Port)
}
```

## 数据库迁移

```sql
CREATE TABLE urls (
    id         BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    long_url   TEXT        NOT NULL,
    clicks     BIGINT      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_short_code ON urls(short_code);
```

## 测试

```go
func TestGenerateShortCode(t *testing.T) {
    code, err := shortcode.Generate(8)
    assert.NoError(t, err)
    assert.Len(t, code, 8)

    // 验证字符集
    for _, c := range code {
        assert.True(t, strings.ContainsRune(shortcode.Charset, c))
    }
}

func TestCreateAndResolve(t *testing.T) {
    db := setupTestDB(t)
    repo := repository.NewURLRepository(db)
    svc := service.NewURLService(repo, nil)

    u, err := svc.CreateShortURL(context.Background(), "https://example.com")
    assert.NoError(t, err)
    assert.NotEmpty(t, u.ShortCode)

    got, err := svc.GetLongURL(context.Background(), u.ShortCode)
    assert.NoError(t, err)
    assert.Equal(t, "https://example.com", got)
}
```

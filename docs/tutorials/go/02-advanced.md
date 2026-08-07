# Go 进阶深入

## 并发模式详解

### Worker Pool

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d 处理任务 %d\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // 发送 9 个任务
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    // 收集结果
    for r := 1; r <= 9; r++ {
        <-results
    }
}
```

### Fan-in / Fan-out

```go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        ch := make(chan int)
        channels[i] = ch
        go func(out chan int) {
            for v := range input {
                out <- v * 2
            }
            close(out)
        }(ch)
    }
    return channels
}

func fanIn(channels ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }
    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}
```

### Pipeline

```go
func gen(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func sq(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    c := gen(2, 3, 4)
    out := sq(c)
    fmt.Println(<-out) // 4
    fmt.Println(<-out) // 9
    fmt.Println(<-out) // 16
}
```

### Context 超时控制

```go
func queryWithTimeout(ctx context.Context) (string, error) {
    result := make(chan string, 1)
    go func() {
        time.Sleep(2 * time.Second)
        result <- "查询结果"
    }()

    select {
    case res := <-result:
        return res, nil
    case <-ctx.Done():
        return "", ctx.Err()
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()

    res, err := queryWithTimeout(ctx)
    if err != nil {
        fmt.Println("超时:", err)
    } else {
        fmt.Println(res)
    }
}
```

## 接口底层原理

### 空接口 `interface{}`

```go
var any interface{}
any = 42
any = "hello"
any = struct{ Name string }{"Alice"}

// 类型断言
if v, ok := any.(string); ok {
    fmt.Println("字符串:", v)
}
```

### Type Switch

```go
func inspect(v interface{}) {
    switch t := v.(type) {
    case int:
        fmt.Printf("整数: %d\n", t)
    case string:
        fmt.Printf("字符串: %s\n", t)
    case bool:
        fmt.Printf("布尔: %v\n", t)
    case []interface{}:
        fmt.Printf("切片: %v\n", t)
    default:
        fmt.Printf("未知类型: %T\n", t)
    }
}
```

## 反射（reflect 包）

```go
func inspectValue(v interface{}) {
    val := reflect.ValueOf(v)
    typ := reflect.TypeOf(v)

    fmt.Printf("类型: %v, 种类: %v\n", typ, val.Kind())

    switch val.Kind() {
    case reflect.Struct:
        for i := 0; i < val.NumField(); i++ {
            field := typ.Field(i)
            fmt.Printf("  %s (%s) = %v\n",
                field.Name, field.Type, val.Field(i))
        }
    case reflect.Slice:
        for i := 0; i < val.Len(); i++ {
            fmt.Printf("  [%d] = %v\n", i, val.Index(i))
        }
    }
}
```

## 测试进阶

### Table-driven Tests

```go
func TestDivide(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
        wantErr  bool
    }{
        {"正常除法", 10, 2, 5, false},
        {"除数为零", 10, 0, 0, true},
        {"负数", -10, 2, -5, false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := divide(tt.a, tt.b)
            if (err != nil) != tt.wantErr {
                t.Errorf("divide() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if got != tt.expected {
                t.Errorf("divide() = %d, want %d", got, tt.expected)
            }
        })
    }
}
```

### Fuzzing

```go
func FuzzReverse(f *testing.F) {
    f.Add("hello")
    f.Add("世界")
    f.Fuzz(func(t *testing.T, s string) {
        reversed := reverse(s)
        doubleReversed := reverse(reversed)
        if s != doubleReversed {
            t.Errorf("反转两次不一致: %q -> %q -> %q", s, reversed, doubleReversed)
        }
    })
}
```

### Benchmark

```go
func BenchmarkSum(b *testing.B) {
    nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    for i := 0; i < b.N; i++ {
        sum(nums...)
    }
}
```

## Go 内存模型

```go
// Escape Analysis - 变量逃逸到堆上
func createUser() *User {
    u := User{Name: "Alice"} // 逃逸到堆（返回指针）
    return &u
}

// GC 三色标记法（无需手动管理）
// pprof 性能分析
import _ "net/http/pprof"

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()
    // 访问 /debug/pprof/ 查看
}
```

## 代码生成（go:generate）

```go
//go:generate stringer -type=Pill

type Pill int

const (
    Placebo Pill = iota
    Aspirin
    Ibuprofen
)

// 执行: go generate ./...
// 生成: pill_string.go
```

## Go 1.21+ 新特性

### slog - 结构化日志

```go
import "log/slog"

func main() {
    slog.Info("用户登录", "user", "alice", "ip", "192.168.1.1")
    slog.Error("数据库连接失败", "db", "postgres", "err", err)

    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    logger.Info("JSON 格式日志", "key", "value")
}
```

### maps / slices 包

```go
import (
    "maps"
    "slices"
)

func main() {
    m1 := map[string]int{"a": 1, "b": 2}
    m2 := maps.Clone(m1)
    maps.Copy(m2, map[string]int{"c": 3})

    s := []int{3, 1, 4, 1, 5}
    slices.Sort(s)
    slices.Reverse(s)
    s = slices.Compact(s) // 去重相邻重复
}
```

## 官方文档

并发模型、接口底层、内存模型与泛型细节以官方规范为准。

| 主题 | 链接 |
|------|------|
| 语言规范 | [Go Spec](https://go.dev/ref/spec) |
| 内存模型 | [Go Memory Model](https://go.dev/ref/mem) |
| 并发 | [Concurrency（博客）](https://go.dev/blog/concurrency-is-not-parallelism) · [Go Concurrency Patterns](https://go.dev/blog/pipelines) · [Go 语言并发教程](https://go.dev/doc/effective_go) |
| 泛型 | [Go 泛型教程](https://go.dev/doc/tutorial/generics) · [Type Parameters Proposal](https://go.googlesource.com/proposal/+/master/design/43651-type-parameters.md) |
| 标准库与工具 | [pkg.go.dev/std](https://pkg.go.dev/std) · [go 命令文档](https://pkg.go.dev/cmd/go) · [testing 包](https://pkg.go.dev/testing) |
| 测试进阶 | [Testing（中文）](https://go.dev/blog/table-driven-tests) · [fuzzing](https://go.dev/doc/security/fuzz/) |

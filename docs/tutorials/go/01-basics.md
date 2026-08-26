# Go 基础语法

## 变量声明

```go
package main

import "fmt"

func main() {
    // 变量声明
    var name string = "Go"
    var version = 1.22          // 类型推断
    count := 42                  // 短声明（推荐）

    // 常量
    const PI float64 = 3.14159

    // 多个变量
    var x, y int = 10, 20
    a, b := "hello", true

    // 基本类型
    var s string
    var i int
    var f float64
    var bl bool
    var by byte               // uint8 别名
    var r rune                // int32 别名，表示 Unicode

    // 零值
    fmt.Println(s)  // ""（字符串零值为空）
    fmt.Println(i)  // 0
    fmt.Println(bl) // false

    fmt.Printf("Hello, %s v%.1f!\n", name, version)
}
```

类型 | 零值 | 说明
--- | --- | ---
`int` | `0` | 平台相关（32/64 位）
`float64` | `0.0` | 浮点数
`string` | `""` | 字符串
`bool` | `false` | 布尔
`byte` | `0` | `uint8` 别名
`rune` | `0` | `int32` 别名，表示 Unicode

::: tip 关键记忆点
- Go 变量**声明即初始化为零值**（无需手动赋初值），不会出现未定义行为（基础语法详见 [Go 官方文档](https://go.dev/doc/)）。
- `:=` 短声明只能在**函数内部**使用；`var` 可在包级使用。
- `rune` 才是真正的「字符」（Unicode 码点），`byte` 只是 `uint8`，处理中文必须用 `rune` 遍历。
:::

## 控制流

```go
// 条件（不需要括号）
if score >= 90 {
    fmt.Println("A")
} else if score >= 80 {
    fmt.Println("B")
} else {
    fmt.Println("C")
}

// 带初始化的 if
if err := doSomething(); err != nil {
    fmt.Println("Error:", err)
}

// switch（不需要 break）
switch os := runtime.GOOS; os {
case "darwin":
    fmt.Println("macOS")
case "linux":
    fmt.Println("Linux")
default:
    fmt.Println(os)
}

// switch 也可替代 if-else 链
score := 85
switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
default:
    fmt.Println("C")
}

// 循环（Go 只有 for）
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// while 风格
count := 0
for count < 5 {
    count++
}

// 无限循环
for {
    break
}

// range 遍历
nums := []int{10, 20, 30}
for index, value := range nums {
    fmt.Println(index, value)
}

for key, val := range map[string]string{"a": "1"} {
    fmt.Println(key, val)
}
```

## 函数

```go
// 多返回值（Go 的特色）
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为零")
    }
    return a / b, nil
}

// 命名返回值
func getStats(nums []int) (sum int, avg float64) {
    for _, n := range nums {
        sum += n
    }
    avg = float64(sum) / float64(len(nums))
    return  // 裸返回
}

// 可变参数
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

// 函数作为值
func apply(fn func(int, int) int, a, b int) int {
    return fn(a, b)
}

// 闭包
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

// 匿名函数
func main() {
    add := func(a, b int) int { return a + b }
    fmt.Println(add(3, 5))
}
```

## 数据结构

```go
// 数组（固定长度）
var arr [5]int
arr[0] = 1
primes := [5]int{2, 3, 5, 7, 11}

// 切片（动态长度，更常用）
nums := []int{1, 2, 3, 4, 5}
nums = append(nums, 6, 7)
slice := nums[1:4]            // [2, 3, 4]
copy := make([]int, len(nums))
copy(copy, nums)

// 切片容量与长度
s := make([]int, 3, 5)       // len=3, cap=5
s = append(s, 1, 2)           // 未超 cap，不重新分配
s = append(s, 3)              // 超过 cap，底层数组重新分配

::: tip 关键点：切片的三要素
- 切片 = **指针（指向底层数组）+ 长度 len + 容量 cap**。
- 切片**共享底层数组**：`slice := nums[1:4]` 与原数组共享内存，修改会互相影响；需要独立副本时用 `copy`。
- `append` 超出 cap 会分配新数组（旧数据复制过去），此时新切片不再共享原数组——这正是很多「改了切片但原数组没变」的来源。
:::

// 映射
ages := make(map[string]int)
ages["Alice"] = 30
delete(ages, "Bob")
age, exists := ages["Alice"]  // 安全访问

// 结构体
type User struct {
    Name    string
    Email   string
    Age     int
    Tags    []string
}

u := User{
    Name:  "Alice",
    Email: "alice@example.com",
    Age:   30,
    Tags:  []string{"go", "dev"},
}
u.Age = 31
fmt.Println(u.Name)
```

## 方法

```go
// Go 没有类，但可以给类型定义方法
type Rectangle struct {
    Width, Height float64
}

// 值接收者（不修改原对象）
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// 指针接收者（修改原对象）
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

r := Rectangle{10, 5}
area := r.Area()   // 50
r.Scale(2)         // 修改为 20x10
```

## 接口

```go
// 定义接口
type Shape interface {
    Area() float64
    Perimeter() float64
}

// 隐式实现（无需显式声明）
type Circle struct {
    Radius float64
}

::: tip 关键点：隐式接口
- Go 的接口是**鸭子类型**：只要一个类型实现了接口的全部方法，就自动满足该接口，**不需要 `implements` 声明**（详见 [Go 语言规范](https://go.dev/ref/spec)）。
- 这带来「小接口」哲学——常用 `io.Reader` / `io.Writer` 这类仅含一两个方法的接口，组合出强大抽象。
- 推荐「**接受接口、返回具体类型**」，便于替换实现与单元测试。
:::

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// 使用接口
func printShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}
```

## 并发

```go
// Goroutine（轻量级线程）
go func() {
    fmt.Println("并发执行")
}()

// Channel（通信）
ch := make(chan string)

go func() {
    ch <- "Hello from goroutine"
}()

msg := <-ch
fmt.Println(msg)

// 缓冲 channel
chBuf := make(chan int, 3)
chBuf <- 1
chBuf <- 2
chBuf <- 3

// 关闭 channel
close(chBuf)
for v := range chBuf {
    fmt.Println(v)
}

// select（多路复用）
select {
case msg1 := <-ch1:
    fmt.Println(msg1)
case msg2 := <-ch2:
    fmt.Println(msg2)
case <-time.After(1 * time.Second):
    fmt.Println("超时")
default:
    fmt.Println("无数据")
}

// WaitGroup
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println(n)
    }(i)
}
wg.Wait()
```

## 错误处理

Go 没有 `try/catch`，而是把错误当作**普通返回值**（最后一个返回值通常是 `error`）。这是 Go 显式错误处理的核心风格。

```go
// 错误即值
result, err := doSomething()
if err != nil {
    log.Fatalf("失败: %v", err)
}

// 自定义错误
type ValidationError struct {
    Field string
    Value interface{}
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("字段 %s 值 %v 无效", e.Field, e.Value)
}

// 错误包装 (Go 1.13+)
if err != nil {
    return fmt.Errorf("处理失败: %w", err)
}

// errors.Is / errors.As
if errors.Is(err, io.EOF) {
    // 处理 EOF
}
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println("验证错误:", ve.Field)
}

// panic / recover（类似异常，但 Go 鼓励使用 error）
defer func() {
    if r := recover(); r != nil {
        fmt.Println("恢复:", r)
    }
}()

::: tip 关键点
- **不要滥用 panic**：panic 应只用于真正不可恢复的程序错误。常规错误处理一律用 `error` 返回值并显式 `if err != nil` 检查。
- `defer + recover` 仅用于 goroutine 顶层兜底，避免单个协程崩溃拖垮整个进程。
- `fmt.Errorf("...: %w", err)` 的 `%w` 会**包装**原错误，配合 `errors.Is` / `errors.As` 做错误类型判断。
:::
```

## 常用标准库

```go
import (
    "fmt"       // 格式化 I/O
    "os"        // 操作系统功能
    "io"        // I/O 接口
    "net/http"  // HTTP 客户端/服务器
    "encoding/json" // JSON 编解码
    "time"      // 时间
    "strings"   // 字符串操作
    "strconv"   // 字符串转换
    "sync"      // 并发同步
    "log"       // 日志
    "sort"      // 排序
)

// JSON 处理
type User struct {
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
}

data, _ := json.Marshal(user)
var u User
json.Unmarshal(data, &u)

// HTTP 服务器
http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "Hello"})
})
log.Fatal(http.ListenAndServe(":8080", nil))

// 时间操作
now := time.Now()
later := now.Add(2 * time.Hour)
fmt.Println(later.Format("2006-01-02 15:04:05"))  // Go 的参考时间布局

// 字符串操作
parts := strings.Split("a,b,c", ",")
joined := strings.Join(parts, "-")
n := strings.HasPrefix("golang", "go")

## 官方文档与延伸阅读

- **官方文档**：[go.dev/doc](https://go.dev/doc/) · [Go Spec（语言规范）](https://go.dev/ref/spec) · [pkg.go.dev 标准库](https://pkg.go.dev/std) · [Go Modules Reference](https://go.dev/ref/mod)
- **官方博客与实践**：[Go Blog](https://go.dev/blog/) · [Effective Go](https://go.dev/doc/effective_go)
- **常用框架**：[Gin](https://gin-gonic.com/docs/) · [Echo](https://echo.labstack.com/docs) · [GORM](https://gorm.io/zh_CN/docs/)
- **源码与提案**：[golang/go](https://github.com/golang/go) · [Go Proposals](https://github.com/golang/proposal)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

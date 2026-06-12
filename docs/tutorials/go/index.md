# Go 教程

Go（Golang）是 Google 开发的开源编程语言，以简洁的语法、高效的并发模型和快速的编译速度著称。

```sh
go version
go mod init my-project
go run main.go
go build -o app
go test ./...
```

## 基础语法

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
    var b bool
    var by byte               // uint8 别名
    var r rune                // int32 别名，表示 Unicode

    // 零值
    fmt.Println(s)  // ""（字符串零值为空）
    fmt.Println(i)  // 0
    fmt.Println(b)  // false

    fmt.Printf("Hello, %s v%.1f!\n", name, version)
}
```

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
ch := make(chan int, 3)
ch <- 1
ch <- 2
ch <- 3

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

// panic / recover（类似异常，但 Go 鼓励使用 error）
defer func() {
    if r := recover(); r != nil {
        fmt.Println("恢复:", r)
    }
}()
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
```

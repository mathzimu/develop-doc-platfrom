# Rust 基础语法

Rust 是一门系统级编程语言，其核心设计理念是 **内存安全**、**无数据竞争** 和 **零成本抽象**。本章涵盖 Rust 最核心的基础概念。

## 变量与基本类型

Rust 变量默认**不可变**，使用 `mut` 关键字使其可变。

```rust
fn main() {
    // 变量（默认不可变）
    let x = 5;
    let mut y = 10;
    y += 1;

    // 常量（编译期确定，必须标注类型）
    const MAX_POINTS: u32 = 100_000;

    // 类型标注
    let num: i32 = 42;
    let pi: f64 = 3.14159;
    let is_active: bool = true;
    let letter: char = 'R';

    // 元组
    let tuple: (i32, f64, &str) = (500, 6.4, "hello");
    let (a, b, c) = tuple;  // 解构
    println!("{}, {}, {}", a, b, c);

    // 数组（固定长度）
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    let slice = &arr[1..3];  // 切片
}
```

基本类型一览：

| 类别 | 类型 |
|------|------|
| 有符号整数 | `i8`, `i16`, `i32`, `i64`, `i128`, `isize` |
| 无符号整数 | `u8`, `u16`, `u32`, `u64`, `u128`, `usize` |
| 浮点数 | `f32`, `f64` |
| 布尔 | `bool` |
| 字符 | `char` |

## 所有权系统

所有权是 Rust 最独特的特性，它在编译时通过所有权规则管理内存，无需垃圾回收器。

**三条规则：**
1. 每个值都有一个**所有者**
2. 同一时间只能有一个所有者
3. 所有者超出作用域时值被丢弃

```rust
fn main() {
    // 所有权转移（Move）
    let s1 = String::from("hello");
    let s2 = s1;               // s1 失效，所有权移至 s2
    // println!("{}", s1);     // 编译错误！s1 已失效

    // 克隆（深拷贝）
    let s3 = s2.clone();
    println!("{} {}", s2, s3);

    // 实现了 Copy trait 的类型（整数、布尔等）
    let a = 42;
    let b = a;                 // a 仍然有效
    println!("{} {}", a, b);

    // 函数传参同样转移所有权
    let s = String::from("hello");
    takes_ownership(s);
    // println!("{}", s);      // 错误！所有权已转移

    // 引用与借用
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("'{}' 的长度是 {}", s1, len);

    // 可变引用（同一作用域唯一）
    let mut s2 = String::from("hello");
    change(&mut s2);

    // 切片
    let s = String::from("hello world");
    let hello = &s[0..5];
    let world = &s[6..11];
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}

fn change(s: &mut String) {
    s.push_str(" world");
}
```

**借用规则：**
- 任意时刻，要么**一个**可变引用，要么**任意数量**不可变引用
- 引用必须始终有效

## 结构体

```rust
// 定义结构体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

// 元组结构体
struct Color(i32, i32, i32);

// 单元结构体
struct UnitStruct;

fn main() {
    let user = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
        active: true,
    };

    // 结构体更新语法
    let user2 = User {
        email: String::from("bob@example.com"),
        ..user
    };

    let black = Color(0, 0, 0);
}
```

### 方法

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 实例方法
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // 关联函数（类似静态方法）
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };
    println!("面积: {}", rect.area());
    let sq = Rectangle::square(20);
}
```

## 枚举

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        // 方法定义在枚举上
    }
}

// Option — Rust 没有 null
fn divide(numerator: f64, denominator: f64) -> Option<f64> {
    if denominator == 0.0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

// Result — 错误处理
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

    // if let — 简洁匹配单个模式
    let config_max = Some(3u8);
    if let Some(max) = config_max {
        println!("最大值是 {}", max);
    }

    // while let — 循环匹配
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    while let Some(top) = stack.pop() {
        println!("{}", top);
    }

    // 解构结构体
    struct Point { x: i32, y: i32 }
    let p = Point { x: 0, y: 7 };
    let Point { x, y } = p;
    println!("({}, {})", x, y);
}
```

## 错误处理

Rust 的错误处理分为两种：**可恢复错误**（`Result<T, E>`）和**不可恢复错误**（`panic!`）。

```rust
use std::fs;
use std::io;

// 返回 Result
fn read_file(path: &str) -> Result<String, io::Error> {
    fs::read_to_string(path)
}

// ? 运算符 — 自动传播错误
fn read_username() -> Result<String, io::Error> {
    let content = fs::read_to_string("user.txt")?;
    Ok(content.trim().to_string())
}

// 链式调用
fn read_config() -> Result<String, io::Error> {
    fs::read_to_string("config.toml")
        .map(|s| s.trim().to_string())
}

// 自定义错误类型
#[derive(Debug)]
enum MyError {
    Io(io::Error),
    Parse(String),
}

impl From<io::Error> for MyError {
    fn from(e: io::Error) -> MyError {
        MyError::Io(e)
    }
}

fn process() -> Result<(), MyError> {
    let _content = fs::read_to_string("file.txt")?;  // 自动转换
    Ok(())
}

// panic! — 不可恢复错误
fn main() {
    let v = vec![1, 2, 3];
    v[99];  // 越界访问 → panic
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

// trait 定义
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

// trait bound 语法
fn notify_bound<T: Summary>(item: &T) {
    println!("{}", item.summarize());
}

// 多个 trait
fn debug_summary(item: &(impl Summary + std::fmt::Debug)) {
    println!("{:?} — {}", item, item.summarize());
}

// where 子句
fn some_function<T, U>(t: &T, u: &U)
where
    T: Summary + Clone,
    U: Summary + std::fmt::Debug,
{
    // ...
}
```

## 常用集合

```rust
use std::collections::HashMap;

fn main() {
    // Vector
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    let third = &v[2];

    // 用宏创建
    let v2 = vec![1, 2, 3];

    // String
    let mut s = String::from("hello");
    s.push_str(" world");
    s.push('!');

    // 格式化
    let s2 = format!("{}-{}", "hello", "world");

    // HashMap
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    // 迭代器与闭包
    let nums = vec![1, 2, 3, 4, 5];
    let sum: i32 = nums.iter()
        .filter(|x| *x % 2 == 0)
        .map(|x| x * 2)
        .sum();

    // 闭包
    let add_one = |x: i32| x + 1;
    let result = add_one(5);

    // 带环境的闭包
    let prefix = String::from("Item: ");
    let add_prefix = |x: &str| format!("{}{}", prefix, x);
}
```

## Cargo 与包管理

```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"
anyhow = "1.0"
thiserror = "1.0"
```

```sh
cargo build              # 调试构建
cargo build --release    # 发布构建
cargo check              # 仅检查（不生成二进制）
cargo test               # 运行测试
cargo fmt                # 格式化代码
cargo clippy             # 代码检查
cargo add serde          # 添加依赖
cargo doc --open         # 生成文档
cargo update             # 更新依赖
```

## 控制流

```rust
fn main() {
    // if 表达式
    let number = 6;
    if number % 4 == 0 {
        println!("能被 4 整除");
    } else if number % 3 == 0 {
        println!("能被 3 整除");
    } else {
        println!("其他");
    }

    // if 可用于赋值
    let condition = true;
    let value = if condition { 5 } else { 6 };

    // loop 循环
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };

    // while 循环
    let mut n = 3;
    while n > 0 {
        n -= 1;
    }

    // for 循环（最常用）
    let arr = [10, 20, 30];
    for element in arr {
        println!("{}", element);
    }

    // 范围
    for i in 1..=5 {
        println!("{}", i);
    }
}
```

继续学习请前往 [02-进阶深入](/tutorials/rust/02-advanced)。

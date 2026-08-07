# Rust 进阶深入

掌握 Rust 基础后，本章深入核心进阶概念：生命周期、智能指针、并发、宏、unsafe、async/await 和测试。

## 生命周期进阶

生命周期是 Rust 确保引用始终有效的机制。

```rust
// 生命周期标注：'a 表示引用至少活到 'a 那么久
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// 结构体中的生命周期
struct Excerpt<'a> {
    part: &'a str,
}

// 多个生命周期参数
fn complex<'a, 'b>(x: &'a str, y: &'b str) -> &'a str
where
    'b: 'a,  // 'b 至少和 'a 一样长
{
    if x.len() > y.len() { x } else { y }
}
```

### 生命周期省略规则

1. 每个输入的引用参数获得独立的生命周期参数
2. 如果只有一个输入生命周期，它被赋给所有输出引用
3. 如果是方法，`&self` 的生命周期赋给所有输出引用

```rust
// 省略前
fn first_word<'a>(s: &'a str) -> &'a str { &s[..] }
// 省略后
fn first_word(s: &str) -> &str { &s[..] }
```

### 静态生命周期

```rust
// 'static 生命周期持续整个程序运行期间
let s: &'static str = "hello";
```

## 智能指针

| 类型 | 功能 | 线程安全 |
|------|------|----------|
| `Box<T>` | 堆分配，单一所有权 | 是 |
| `Rc<T>` | 引用计数，共享所有权 | 否 |
| `Arc<T>` | 原子引用计数，共享所有权 | 是 |
| `RefCell<T>` | 运行时借用检查 | 否 |
| `Cell<T>` | 内部可变性（Copy 类型） | 否 |
| `Cow<T>` | 写时克隆 | 条件满足 |

```rust
use std::rc::Rc;
use std::sync::Arc;
use std::cell::RefCell;

fn main() {
    // Box — 最简单的智能指针
    let b = Box::new(5);
    println!("{}", b);

    // Rc — 单线程引用计数
    let a = Rc::new(String::from("hello"));
    let b = Rc::clone(&a);
    println!("引用计数: {}", Rc::strong_count(&a));

    // Arc — 多线程引用计数
    let a = Arc::new(42);
    let b = Arc::clone(&a);

    // RefCell — 内部可变性
    let data = RefCell::new(5);
    *data.borrow_mut() += 1;
    println!("{}", data.borrow());

    // Cow — 写时克隆
    use std::borrow::Cow;
    fn process(input: &str) -> Cow<'_, str> {
        if input.contains(' ') {
            input.to_uppercase().into()  // 需要克隆
        } else {
            Cow::Borrowed(input)         // 直接借用
        }
    }
}
```

## 并发编程进阶

### Send 与 Sync trait

- **Send**: 类型所有权可在线程间转移
- **Sync**: 类型的引用可在线程间共享（`&T` 是 Send）

```rust
use std::thread;
use std::sync::{Mutex, RwLock, Arc};

fn main() {
    // Mutex — 互斥锁
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
    println!("结果: {}", *counter.lock().unwrap());

    // RwLock — 读写锁（多读单写）
    let data = Arc::new(RwLock::new(vec![1, 2, 3]));
    let r = data.read().unwrap();
    println!("读: {:?}", *r);
    drop(r);
    let mut w = data.write().unwrap();
    w.push(4);
}
```

### Rayon — 并行迭代器

```toml
[dependencies]
rayon = "1"
```

```rust
use rayon::prelude::*;

fn main() {
    let numbers: Vec<u64> = (0..1_000_000).collect();
    // 自动并行计算
    let sum: u64 = numbers.par_iter().sum();
    let squares: Vec<u64> = numbers.par_iter()
        .map(|n| n * n)
        .collect();
}
```

### Crossbeam — 更多并发工具

```toml
[dependencies]
crossbeam = "0.8"
```

```rust
use crossbeam::channel;

fn main() {
    let (tx, rx) = channel::unbounded();
    std::thread::spawn(move || {
        tx.send(42).unwrap();
    });
    println!("收到: {}", rx.recv().unwrap());
}
```

## 宏系统

### 声明宏（macro_rules!）

```rust
// vec! 宏的简化版
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let v = my_vec![1, 2, 3];
    println!("{:?}", v);
}
```

### derive 宏

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct User {
    id: u32,
    name: String,
}
```

### 过程宏

需要单独的 proc-macro crate：

```rust
// lib.rs — 定义过程宏
use proc_macro::TokenStream;

#[proc_macro]
pub fn make_hello(item: TokenStream) -> TokenStream {
    let name = item.to_string();
    let result = format!("fn hello() {{ println!(\"Hello, {}!\", {}); }}", name, name);
    result.parse().unwrap()
}
```

## unsafe Rust

```rust
fn main() {
    // 原始指针（绕过借用检查）
    let mut num = 5;
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    unsafe {
        println!("r1: {}", *r1);
        *r2 = 10;
    }

    // FFI — 调用 C 函数
    extern "C" {
        fn abs(input: i32) -> i32;
    }

    unsafe {
        println!("abs(-3): {}", abs(-3));
    }

    // UnsafeCell — 内部可变性基础
    use std::cell::UnsafeCell;
    let cell = UnsafeCell::new(42);
    unsafe {
        *cell.get() = 100;
    }
}
```

**unsafe 能力：**
- 解引用原始指针
- 调用 unsafe 函数或方法
- 访问或修改可变静态变量
- 实现 unsafe trait
- 访问 union 的字段

## async/await 深入

```rust
use tokio::time::{sleep, Duration};

// Future trait 的基础形式
// pub trait Future {
//     type Output;
//     fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
// }

async fn say_hello() -> String {
    sleep(Duration::from_secs(1)).await;
    "Hello, async!".to_string()
}

// Pin — 确保值不被移动（自引用结构需要）
use std::pin::Pin;
use std::marker::PhantomPinned;

#[derive(Debug)]
struct SelfReferential {
    data: String,
    ptr: *const String,
    _pin: PhantomPinned,
}

impl SelfReferential {
    fn new(data: String) -> Pin<Box<Self>> {
        let mut pinned = Box::pin(Self {
            ptr: std::ptr::null(),
            data,
            _pin: PhantomPinned,
        });
        pinned.ptr = &pinned.data;
        pinned
    }
}

#[tokio::main]
async fn main() {
    // tokio 运行时管理所有异步任务
    let handle = tokio::spawn(async {
        say_hello().await
    });

    let result = handle.await.unwrap();
    println!("{}", result);

    // 并发多个任务
    let (a, b) = tokio::join!(
        async { 1 + 2 },
        async { 3 + 4 },
    );
    println!("{}, {}", a, b);
}
```

## 单元测试与集成测试

```rust
// src/lib.rs — 单元测试
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("除数不能为 0".into())
    } else {
        Ok(a / b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_divide_ok() {
        assert_eq!(divide(10.0, 2.0).unwrap(), 5.0);
    }

    #[test]
    fn test_divide_by_zero() {
        assert!(divide(1.0, 0.0).is_err());
    }

    #[test]
    #[should_panic(expected = "越界")]
    fn test_panic() {
        let v = vec![1, 2, 3];
        v[99];
    }

    #[test]
    fn test_result_type() -> Result<(), String> {
        if 2 + 2 == 4 {
            Ok(())
        } else {
            Err("数学错误".into())
        }
    }

    #[test]
    #[ignore]
    fn expensive_test() {
        // 需要用 cargo test -- --ignored 运行
    }
}
```

```
# tests/integration_test.rs — 集成测试
use my_crate;

#[test]
fn integration_test() {
    assert_eq!(my_crate::add(1, 2), 3);
}
```

## 官方文档

生命周期、智能指针、并发、宏、unsafe 与 async，详情以 The Rust Book 与 Reference 为准。

| 主题 | 链接 |
|------|------|
| 所有权与借用 | [The Rust Book 所有权](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) · [借用检查器](https://doc.rust-lang.org/book/ch10-00-generics.html) |
| 生命周期 | [Rust Book 生命周期](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html) · [Nomicon 生命周期](https://doc.rust-lang.org/nomicon/lifetimes.html) |
| 智能指针 | [Rust Book 智能指针](https://doc.rust-lang.org/book/ch15-00-smart-pointers.html) |
| 并发 | [Rust Book 无畏并发](https://doc.rust-lang.org/book/ch16-00-concurrency.html) · [Send/Sync](https://doc.rust-lang.org/reference/types.html#static-type) |
| 宏 | [The Little Book of Rust Macros](https://veykril.github.io/tlborm/) |
| unsafe | [The Rustonomicon](https://doc.rust-lang.org/nomicon/) |
| 异步 | [Async Book](https://rust-lang.github.io/async-book/) · [Tokio 教程](https://tokio.rs/tokio/tutorial) |
| 编译错误索引 | [Error Index](https://doc.rust-lang.org/error_codes/error-index.html) |

继续学习请前往 [03-实战项目：JSON 解析器](/tutorials/rust/03-project)。

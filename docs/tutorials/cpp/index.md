# C++ 教程

C++ 是一种高性能的编译型语言，支持面向对象、泛型和函数式编程。广泛应用于游戏开发、系统编程、嵌入式设备和性能敏感的应用。

## 教程目录

- [01. C++ 基础语法](/tutorials/cpp/01-basics) — 类型与初始化、命名空间、枚举、数组与 span、字符串与 string_view、指针/引用与 const-correctness、类型转换、异常处理、OOP、模板、STL、移动语义、Ranges、文件操作、编译选项
- [02. C++ 进阶深入](/tutorials/cpp/02-advanced) — RAII、模板元编程、完美转发、C++17/20 新特性、内存管理、多线程、异常安全、设计模式
- [03. 实战项目：文本文件词频统计](/tutorials/cpp/03-project) — 完整项目实践：CMake、文件读取、词频统计、排序、格式化输出、单元测试
- [04. C++ 工程实践](/tutorials/cpp/04-engineering) — CMake、日志、测试、性能分析、包管理、CI/CD、Sanitizers
- [05. C++ 生态全景](/tutorials/cpp/05-ecosystem) — 构建系统、包管理、测试框架、日志库、序列化、网络库、GUI、编译器

```sh
g++ -std=c++20 -o app main.cpp && ./app
```

> 建议顺序学习，每章包含可运行的代码示例。

## 环境要求

- 支持 C++20 的编译器：GCC 11+ / Clang 14+ / MSVC 19.30+
- CMake 3.20+
- 调试器：GDB 或 LLDB

## 前置知识

- 了解基本编程概念（变量、循环、函数）
- 了解命令行编译流程
- 有 C 语言基础会更轻松，但非必需

## 官方文档

标准行为、编译器扩展、未定义行为边界以下列一手资料为准。

| 类型 | 链接 |
|------|------|
| 语言与标准库参考（中文） | [zh.cppreference.com](https://zh.cppreference.com/w/cpp) |
| 参考（英文） | [en.cppreference.com](https://en.cppreference.com/w/cpp) |
| 标准草案 | [eel.is/c++draft](https://eel.is/c++draft/) · [ISO/IEC 14882](https://www.iso.org/standard/83626.html) |
| 标准委员会 | [isocpp.org](https://isocpp.org/) · [提案列表](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/) |
| 编码指南 | [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) |
| 编译器文档 | [GCC](https://gcc.gnu.org/onlinedocs/) · [Clang](https://clang.llvm.org/docs/) · [MSVC](https://learn.microsoft.com/zh-cn/cpp/) |
| 构建系统 | [CMake](https://cmake.org/documentation/) · [Ninja](https://ninja-build.org/manual.html) · [Meson](https://mesonbuild.com/) |
| 包管理 | [vcpkg](https://learn.microsoft.com/zh-cn/vcpkg/) · [Conan](https://docs.conan.io/2/) |
| 测试 | [GoogleTest](https://google.github.io/googletest/) · [Catch2](https://github.com/catchorg/Catch2/blob/devel/docs/Readme.md) |
| 诊断工具 | [Sanitizers](https://github.com/google/sanitizers/wiki) · [Valgrind](https://valgrind.org/docs/manual/manual.html) · [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) |
| 常用库 | [fmt](https://fmt.dev/latest/index.html) · [spdlog](https://github.com/gabime/spdlog/wiki) · [nlohmann/json](https://json.nlohmann.me/) · [Boost](https://www.boost.org/doc/libs/release/) |
| 在线试验 | [Compiler Explorer](https://godbolt.org/) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

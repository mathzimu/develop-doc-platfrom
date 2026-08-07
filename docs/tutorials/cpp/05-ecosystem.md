# C++ 生态全景

C++ 拥有庞大且活跃的生态。以下整理了各领域的常用工具和库。

## 构建系统

| 工具 | 描述 | 特点 |
|------|------|------|
| **CMake** | 事实标准构建系统 | 跨平台、生成 IDE 项目、广泛使用 |
| **Meson** | 快速构建系统 | Ninja 后端、简洁语法、原生支持 |
| **Bazel** | Google 开源构建 | 增量构建、多语言支持、大型项目 |
| **Xmake** | 现代构建工具 | Lua 配置、内置包管理 |

## 包管理

| 工具 | 描述 | 特点 |
|------|------|------|
| **Conan** | C/C++ 包管理器 | 去中心化、支持所有平台、CMake 集成 |
| **vcpkg** | Microsoft 包管理器 | 开箱即用、大量 port、与 CMake 配合良好 |

## 测试框架

| 框架 | 描述 | 特点 |
|------|------|------|
| **Google Test** | Google 测试框架 | 功能全面、mock 支持、参数化测试 |
| **Catch2** | Header-only 框架 | 现代 C++、BDD 风格、声明式 |
| **doctest** | 最轻量测试框架 | 编译极快、功能丰富、头文件库 |
| **Boost.Test** | Boost 测试库 | 功能完善、Boost 生态 |

## 日志库

| 库 | 描述 | 特点 |
|----|------|------|
| **spdlog** | 快速日志库 | Header-only、格式化、异步 |
| **glog** | Google 日志库 | 成熟稳定、条件日志、错误处理 |
| **Boost.Log** | Boost 日志模块 | 功能强大、可定制、流式接口 |

## 序列化

| 库 | 描述 | 特点 |
|----|------|------|
| **protobuf** | Google Protocol Buffers | 高效二进制、代码生成、语言中立 |
| **flatbuffers** | 零反序列化开销 | 直接内存访问、适合游戏 |
| **msgpack** | 二进制 JSON 替代 | 紧凑格式、多语言支持 |
| **nlohmann/json** | 现代 JSON 库 | 直观 API、Header-only |
| **Boost.Serialization** | Boost 序列化 | 完整功能、支持文本/二进制 |

## 网络库

| 库 | 描述 | 特点 |
|----|------|------|
| **Boost.Asio** | 高性能网络库 | 同步/异步、Coroutine 支持 |
| **libcurl** | 客户端 URL 传输 | 多协议、稳定成熟 |
| **grpc** | gRPC 框架 | Protobuf + HTTP/2、流式通信 |
| **cpp-httplib** | Header-only HTTP | 简单易用、适合小项目 |

## GUI 框架

| 框架 | 描述 | 特点 |
|------|------|------|
| **Qt** | 全功能 GUI 框架 | 跨平台、信号槽、QML、工具链完整 |
| **wxWidgets** | 原生 GUI 框架 | 使用系统原生控件、外观一致 |
| **ImGui** | 即时模式 GUI | 调试工具、游戏编辑器、快速原型 |
| **FLTK** | 轻量 GUI 库 | 体积小、快速编译 |

## 编译器与工具链

| 编译器 | 描述 | 特点 |
|--------|------|------|
| **GCC** | GNU 编译器套件 | 最广泛支持、Linux 默认 |
| **Clang** | LLVM 前端 | 快速、错误信息友好、IDE 集成好 |
| **MSVC** | Microsoft 编译器 | Windows 生态、VS 集成、Windows 专用 API |
| **Intel oneAPI** | Intel 编译器 | 高性能计算、SIMD 优化 |
| **Apple Clang** | Xcode 默认 | macOS/iOS 开发、Swift 互操作 |

## 编译分析工具

| 工具 | 用途 |
|------|------|
| **AddressSanitizer** | 内存错误检测 |
| **UndefinedBehaviorSanitizer** | 未定义行为检测 |
| **ThreadSanitizer** | 数据竞争检测 |
| **Valgrind** | 内存泄漏和性能分析 |
| **perf** | Linux CPU 性能采样 |
| **Clang-Tidy** | 代码风格分析和现代化 |
| **Clang-Format** | 代码格式化 |

## 如何选择

- **初学者**：CMake + spdlog + Google Test + nlohmann/json
- **系统编程**：CMake + Meson + Boost.Asio
- **游戏开发**：CMake + flatbuffers + ImGui + spdlog
- **企业应用**：CMake + Conan/vcpkg + gRPC + Qt + Google Test
- **嵌入式**：CMake + GCC/Clang + doctest + spdlog（静态链接）

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 语言与标准库 | [cppreference（中文）](https://zh.cppreference.com/w/cpp) · [cppreference（英文）](https://en.cppreference.com/w/cpp) · [标准草案](https://eel.is/c++draft/) · [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) |
| 构建/包管理 | [CMake](https://cmake.org/documentation/) · [Meson](https://mesonbuild.com/) · [Bazel](https://bazel.build/) · [Xmake](https://xmake.io/) · [Conan](https://docs.conan.io/2/) · [vcpkg](https://learn.microsoft.com/zh-cn/vcpkg/) |
| 测试 | [GoogleTest](https://google.github.io/googletest/) · [Catch2](https://github.com/catchorg/Catch2) · [doctest](https://github.com/onqtam/doctest) · [Boost.Test](https://www.boost.org/doc/libs/release/libs/test/) |
| 网络 | [Boost.Asio](https://www.boost.org/doc/libs/release/libs/asio/) · [libcurl](https://curl.se/libcurl/) · [gRPC C++](https://grpc.io/docs/languages/cpp/) · [cpp-httplib](https://github.com/yhirose/cpp-httplib) |
| 编译器与诊断 | [GCC](https://gcc.gnu.org/onlinedocs/) · [Clang](https://clang.llvm.org/docs/) · [MSVC](https://learn.microsoft.com/zh-cn/cpp/) · [Sanitizers](https://github.com/google/sanitizers/wiki) · [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) |

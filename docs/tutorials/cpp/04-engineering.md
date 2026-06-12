# C++ 工程实践

从写 C++ 代码到交付可靠的产品，需要成熟的工程工具和流程。

## CMake 构建系统

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(MyApp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 依赖
find_package(fmt REQUIRED)
find_package(spdlog REQUIRED)
find_package(Boost REQUIRED COMPONENTS json)

# 源码
file(GLOB_RECURSE SOURCES src/*.cpp)
file(GLOB_RECURSE HEADERS include/*.h)

# 库
add_library(mycore ${SOURCES})
target_include_directories(mycore PUBLIC include)
target_link_libraries(mycore PRIVATE fmt::fmt spdlog::spdlog Boost::json)

# 测试
enable_testing()
add_subdirectory(tests)

# 安装
install(TARGETS mycore DESTINATION lib)
install(FILES ${HEADERS} DESTINATION include)
```

### 常用 CMake 命令

```cmake
# 选项
option(BUILD_TESTS "Build tests" ON)
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)

# 不同平台
if(WIN32)
    add_definitions(-DWIN32_LEAN_AND_MEAN)
elseif(APPLE)
    set(CMAKE_OSX_DEPLOYMENT_TARGET "12.0")
endif()

# 编译选项
target_compile_options(mycore PRIVATE
    -Wall -Wextra -Wpedantic -Werror
    -Wshadow -Wnon-virtual-dtor
)
```

### FetchContent（现代 CMake 依赖管理）

```cmake
include(FetchContent)

FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG 10.1.1
)
FetchContent_MakeAvailable(fmt)

FetchContent_Declare(
    nlohmann_json
    URL https://github.com/nlohmann/json/releases/download/v3.11.2/json.hpp
)
FetchContent_MakeAvailable(nlohmann_json)
```

## 包管理

### Conan

```python
# conanfile.py
from conan import ConanFile

class MyAppConan(ConanFile):
    name = "myapp"
    version = "1.0"
    settings = "os", "compiler", "build_type", "arch"
    requires = "fmt/10.1.1", "spdlog/1.12.0", "gtest/1.14.0"
    generators = "CMakeDeps", "CMakeToolchain"

    def layout(self):
        cmake_layout(self)
```

```sh
# 使用
conan install . --output-folder=build --build=missing
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build .
```

### vcpkg

```sh
# 安装包
vcpkg install fmt spdlog gtest

# 与 CMake 集成
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

## 日志系统

```cpp
#include <spdlog/spdlog.h>
#include <spdlog/sinks/rotating_file_sink.h>
#include <spdlog/sinks/stdout_color_sinks.h>

class Logger {
public:
    static void init() {
        auto console = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
        console->set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%^%l%$] [%t] %v");

        auto file = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(
            "logs/app.log", 10 * 1024 * 1024, 5
        );
        file->set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%l] [%t] [%s:%#] %v");

        auto logger = std::make_shared<spdlog::logger>("app",
            spdlog::sinks_init_list{console, file});
        logger->set_level(spdlog::level::info);
        spdlog::set_default_logger(logger);
    }
};

// 使用
spdlog::info("Server started on port {}", port);
spdlog::warn("High memory usage: {}%", usage);
spdlog::error("Failed to connect to database: {}", err.what());
spdlog::debug("Processing item {}", id);  // 仅在 debug 级别输出
```

### 日志最佳实践

- **不要记录敏感信息**（密码、token）
- **使用结构化日志**（JSON 格式）便于日志分析
- **日志级别分级**：TRACE < DEBUG < INFO < WARN < ERROR < CRITICAL
- **异步日志**：spdlog 支持 `async_factory` 避免阻塞业务线程

## 单元测试

### Google Test

```cpp
// tests/test_user_service.cpp
#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "user_service.h"

class MockUserRepository : public UserRepository {
public:
    MOCK_METHOD(User, findById, (int id), (override));
    MOCK_METHOD(std::vector<User>, findAll, (), (override));
};

TEST(UserServiceTest, GetUserById) {
    MockUserRepository mock_repo;
    EXPECT_CALL(mock_repo, findById(1))
        .WillOnce(testing::Return(User{1, "Alice", "alice@test.com"}));

    UserService service(&mock_repo);
    auto user = service.getUserById(1);
    EXPECT_EQ(user.name, "Alice");
}

TEST(UserServiceTest, UserNotFound) {
    MockUserRepository mock_repo;
    EXPECT_CALL(mock_repo, findById(999))
        .WillOnce(testing::Throw(std::runtime_error("Not found")));

    UserService service(&mock_repo);
    EXPECT_THROW(service.getUserById(999), std::runtime_error);
}

int main(int argc, char **argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

### 测试覆盖率

```sh
# 使用 gcov/lcov
cmake -B build -DCMAKE_CXX_FLAGS="--coverage"
cmake --build build
./build/tests/test_all
lcov --capture --directory build --output-file coverage.info
genhtml coverage.info --output-directory coverage_report
```

## 性能分析

### Google Benchmark

```cpp
#include <benchmark/benchmark.h>

static void BM_StringCreation(benchmark::State& state) {
    for (auto _ : state) {
        std::string created("hello");
        benchmark::DoNotOptimize(created);
    }
}
BENCHMARK(BM_StringCreation);

static void BM_StringCopy(benchmark::State& state) {
    std::string x = "hello";
    for (auto _ : state) {
        std::string copy(x);
        benchmark::DoNotOptimize(copy);
    }
}
BENCHMARK(BM_StringCopy);

static void BM_VectorPushBack(benchmark::State& state) {
    for (auto _ : state) {
        std::vector<int> v;
        for (int i = 0; i < state.range(0); ++i) {
            v.push_back(i);
        }
    }
}
BENCHMARK(BM_VectorPushBack)->Range(8, 8<<10);

BENCHMARK_MAIN();
```

### perf（Linux 性能分析）

```sh
# CPU 采样
perf record -g ./myapp
perf report -g

# 统计性能计数器
perf stat ./myapp
```

## Sanitizers

Sanitizers 是编译器内置的运行时检测工具，捕捉内存错误和数据竞争。

### AddressSanitizer (ASan)

```sh
# 检测内存错误（越界、use-after-free、double free）
g++ -fsanitize=address -g -O1 -fno-omit-frame-pointer -o app main.cpp
./app
# 输出详细的内存错误位置和调用栈
```

### UndefinedBehaviorSanitizer (UBSan)

```sh
# 检测未定义行为（整数溢出、空指针解引用等）
g++ -fsanitize=undefined -g -O1 -fno-omit-frame-pointer -o app main.cpp
./app
```

### ThreadSanitizer (TSan)

```sh
# 检测数据竞争和线程问题
g++ -fsanitize=thread -g -O1 -fno-omit-frame-pointer -o app main.cpp -lpthread
./app
```

### MemorySanitizer (MSan)

```sh
# 检测未初始化内存读取
clang++ -fsanitize=memory -g -O1 -fno-omit-frame-pointer -o app main.cpp
./app
```

### CMake 集成 Sanitizers

```cmake
# 通过 CMake 选项控制
option(ENABLE_ASAN "Enable AddressSanitizer" OFF)
option(ENABLE_UBSAN "Enable UBSan" OFF)
option(ENABLE_TSAN "Enable ThreadSanitizer" OFF)

if(ENABLE_ASAN)
    set(SANITIZER_FLAGS "-fsanitize=address -fno-omit-frame-pointer")
elseif(ENABLE_UBSAN)
    set(SANITIZER_FLAGS "-fsanitize=undefined")
elseif(ENABLE_TSAN)
    set(SANITIZER_FLAGS "-fsanitize=thread")
endif()

if(SANITIZER_FLAGS)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${SANITIZER_FLAGS} -g -O1")
endif()
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: C++ CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        compiler: [gcc, clang]

    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: |
          mkdir build && cd build
          cmake .. -DCMAKE_CXX_COMPILER=${{ matrix.compiler == 'gcc' && 'g++' || 'clang++' }}
          cmake --build .
      - name: Test
        run: cd build && ctest --output-on-failure
      - name: Sanitizers
        run: |
          mkdir build-san && cd build-san
          cmake .. -DENABLE_ASAN=ON
          cmake --build .
          ctest --output-on-failure
```

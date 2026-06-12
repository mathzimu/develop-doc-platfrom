# C++ 教程

C++ 是一种高性能的编译型语言，支持面向对象、泛型和函数式编程。C++ 广泛应用于游戏开发、系统编程、嵌入式设备和性能敏感的应用。

```sh
g++ --version
clang++ --version
g++ -std=c++20 -o app main.cpp
```

## 基础语法

```cpp
#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    // 变量
    int count = 42;
    double pi = 3.14159;
    char grade = 'A';
    bool isReady = true;
    string name = "C++";

    // 常量
    const int MAX_SIZE = 1000;
    constexpr double GRAVITY = 9.81;  // 编译期常量

    // 输出
    cout << "Hello, " << name << "!" << endl;
    cout << "Pi is " << pi << endl;

    // 条件
    if (count > 0) {
        cout << "正数" << endl;
    } else if (count == 0) {
        cout << "零" << endl;
    } else {
        cout << "负数" << endl;
    }

    // 循环
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << endl;

    int i = 0;
    while (i < 5) {
        cout << i << " ";
        i++;
    }

    // 范围 for (C++11)
    vector<int> nums = {1, 2, 3, 4, 5};
    for (int n : nums) {
        cout << n << " ";
    }

    return 0;
}
```

## 指针与引用

```cpp
int main() {
    int value = 42;

    // 指针
    int* ptr = &value;
    cout << *ptr;          // 解引用：42
    cout << ptr;           // 地址
    *ptr = 100;            // 修改原值

    // 空指针
    int* null_ptr = nullptr;
    if (null_ptr != nullptr) {
        cout << *null_ptr;
    }

    // 引用（别名，不能为空）
    int& ref = value;
    ref = 200;             // value 变为 200

    // 智能指针（C++11，推荐）
    #include <memory>
    auto uptr = make_unique<int>(42);  // unique_ptr
    auto sptr = make_shared<int>(42);  // shared_ptr
}
```

## 面向对象

```cpp
class Animal {
protected:
    string name;

public:
    // 构造与析构
    Animal(const string& n) : name(n) {
        cout << "Animal created: " << name << endl;
    }

    virtual ~Animal() {
        cout << "Animal destroyed: " << name << endl;
    }

    // 虚函数（支持多态）
    virtual void speak() const {
        cout << name << " makes a sound" << endl;
    }

    // 纯虚函数（抽象类）
    // virtual void move() = 0;
};

class Dog : public Animal {
private:
    string breed;

public:
    Dog(const string& n, const string& b)
        : Animal(n), breed(b) {}

    void speak() const override {
        cout << "Woof! I'm " << breed << endl;
    }
};

// 使用
int main() {
    Animal* pet = new Dog("旺财", "金毛");
    pet->speak();  // Woof! I'm 金毛
    delete pet;
}
```

## 泛型编程

```cpp
// 函数模板
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

// 类模板
template <typename T, size_t N>
class Array {
private:
    T data[N];

public:
    size_t size() const { return N; }
    T& operator[](size_t index) { return data[index]; }
};

// 概念约束（C++20）
template <typename T>
concept Numeric = is_arithmetic_v<T>;

template <Numeric T>
T add(T a, T b) {
    return a + b;
}
```

## STL 容器

```cpp
#include <vector>
#include <map>
#include <set>
#include <unordered_map>
#include <algorithm>

int main() {
    // Vector
    vector<int> vec = {1, 2, 3, 4, 5};
    vec.push_back(6);
    sort(vec.begin(), vec.end());
    auto it = find(vec.begin(), vec.end(), 3);

    // Map
    map<string, int> ages;
    ages["Alice"] = 30;
    ages["Bob"] = 25;

    for (const auto& [name, age] : ages) {
        cout << name << ": " << age << endl;
    }

    // Set
    set<int> unique_nums = {3, 1, 4, 1, 5};

    // 算法
    vector<int> numbers = {5, 2, 8, 1, 9};
    sort(numbers.begin(), numbers.end());
    auto max = max_element(numbers.begin(), numbers.end());
    int sum = accumulate(numbers.begin(), numbers.end(), 0);

    // Lambda (C++11)
    auto is_even = [](int n) { return n % 2 == 0; };
    auto even_count = count_if(numbers.begin(), numbers.end(), is_even);
}
```

## 移动语义

```cpp
class Buffer {
private:
    int* data;
    size_t size;

public:
    // 构造函数
    Buffer(size_t s) : size(s) {
        data = new int[size];
    }

    // 析构函数
    ~Buffer() { delete[] data; }

    // 拷贝构造
    Buffer(const Buffer& other) : size(other.size) {
        data = new int[size];
        copy(other.data, other.data + size, data);
    }

    // 移动构造（C++11）
    Buffer(Buffer&& other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }

    // 移动赋值
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};
```

## 文件操作

```cpp
#include <fstream>

// 写入
ofstream out("output.txt");
out << "Hello C++" << endl;
out.close();

// 读取
ifstream in("input.txt");
string line;
while (getline(in, line)) {
    cout << line << endl;
}

// 二进制
ofstream bin("data.bin", ios::binary);
int value = 42;
bin.write(reinterpret_cast<char*>(&value), sizeof(value));
```

## 编译选项

```sh
# 调试构建
g++ -g -O0 -o app main.cpp

# 发布构建
g++ -O2 -DNDEBUG -o app main.cpp

# 启用 C++ 标准
g++ -std=c++20 -o app main.cpp

# 链接库
g++ -o app main.cpp -lssl -lcrypto

# 多文件
g++ -c file1.cpp -o file1.o
g++ -c file2.cpp -o file2.o
g++ file1.o file2.o -o app
```

---

# 企业级实践

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
```

## 单元测试（Google Test）

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

int main(int argc, char **argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

## 性能分析

```cpp
// 使用 perf 进行 CPU 分析
// perf record -g ./myapp
// perf report -g

// 使用 Google Benchmark
#include <benchmark/benchmark.h>

static void BM_StringCreation(benchmark::State& state) {
    for (auto _ : state) {
        std::string created("hello");
        benchmark::DoNotOptimize(created);
    }
}
BENCHMARK(BM_StringCreation);

BENCHMARK_MAIN();

// AddressSanitizer 内存检测
// 编译: g++ -fsanitize=address -g -O1 -fno-omit-frame-pointer
// UBSan: g++ -fsanitize=undefined
// ThreadSanitizer: g++ -fsanitize=thread
```


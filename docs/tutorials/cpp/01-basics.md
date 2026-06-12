# C++ 基础语法

C++ 是 C 的超集，在保留底层内存控制能力的同时，引入了面向对象、泛型等现代编程范式。

## 变量与基本类型

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

    // auto 类型推导 (C++11)
    auto a = 42;          // int
    auto b = 3.14;        // double
    auto c = "hello"s;    // std::string

    // decltype
    int x = 10;
    decltype(x) y = 20;   // y 是 int

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

    // 引用（别名，不能为空，不能重新绑定）
    int& ref = value;
    ref = 200;             // value 变为 200

    // 指针 vs 引用：指针可重新赋值，引用不可变绑定
    int other = 999;
    ptr = &other;          // 指针可以指向其他对象
    // ref = other;        // 这会将 other 的值赋给 value，而非重新绑定 ref

    // 智能指针（C++11，推荐）
    #include <memory>
    auto uptr = make_unique<int>(42);  // unique_ptr：独占所有权
    auto sptr = make_shared<int>(42);  // shared_ptr：共享所有权

    // unique_ptr 不能拷贝，只能移动
    auto uptr2 = std::move(uptr);

    // weak_ptr：避免循环引用
    weak_ptr<int> wptr = sptr;
}
```

## 函数

```cpp
// 默认参数
void greet(const string& name, const string& prefix = "Hello") {
    cout << prefix << ", " << name << "!" << endl;
}

// 函数重载
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

// 内联函数（建议编译器展开，避免调用开销）
inline int square(int x) { return x * x; }

// noexcept 声明（不抛异常）
void safe_op() noexcept {
    // 此函数不会抛出异常
}

// constexpr 函数（编译期求值）
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
// static_assert(factorial(5) == 120);  // 编译期断言
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
    virtual void move() = 0;
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

    void move() override {
        cout << name << " runs" << endl;
    }

    // 禁止重写 (C++11)
    void wagTail() final {
        cout << "Wagging tail" << endl;
    }
};

// 使用
int main() {
    Animal* pet = new Dog("旺财", "金毛");
    pet->speak();  // Woof! I'm 金毛
    pet->move();   // 旺财 runs
    delete pet;    // 虚析构确保 Dog 的析构被调用
}

// 委托构造函数 (C++11)
class Person {
    string name;
    int age;
public:
    Person() : Person("Unknown", 0) {}
    Person(const string& n) : Person(n, 0) {}
    Person(const string& n, int a) : name(n), age(a) {}
};

// using 继承构造函数 (C++11)
class Base {
public:
    Base(int) {}
    Base(double, int) {}
};
class Derived : public Base {
    using Base::Base;  // 继承 Base 的构造函数
};
```

## 泛型编程（模板）

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
    const T& operator[](size_t index) const { return data[index]; }
};

// 模板特化
template <>
class Array<bool, 1> {
    // 特化版本
};

// 变参模板 (C++11)
template <typename... Args>
void printAll(Args... args) {
    (cout << ... << args) << endl;  // fold expression (C++17)
}

// 概念约束（C++20）
template <typename T>
concept Numeric = is_arithmetic_v<T>;

template <Numeric T>
T add(T a, T b) {
    return a + b;
}

// requires 表达式 (C++20)
template <typename T>
    requires requires(T a, T b) { a + b; }
T sum(T a, T b) { return a + b; }
```

## STL 容器与算法

```cpp
#include <vector>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <numeric>

int main() {
    // Vector
    vector<int> vec = {1, 2, 3, 4, 5};
    vec.push_back(6);
    vec.pop_back();
    sort(vec.begin(), vec.end());
    auto it = find(vec.begin(), vec.end(), 3);

    // Map (红黑树，有序)
    map<string, int> ages;
    ages["Alice"] = 30;
    ages["Bob"] = 25;

    for (const auto& [name, age] : ages) {
        cout << name << ": " << age << endl;
    }

    // unordered_map (哈希表，O(1) 查找)
    unordered_map<string, int> scores;
    scores["player1"] = 100;

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

    // Lambda 捕获
    int threshold = 3;
    auto greater_than = [threshold](int n) { return n > threshold; };
    auto gt_count = count_if(numbers.begin(), numbers.end(), greater_than);

    // 移动捕获 (C++14)
    auto uptr = make_unique<int>(42);
    auto task = [ptr = std::move(uptr)] { return *ptr; };
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
        cout << "构造" << endl;
    }

    // 析构函数
    ~Buffer() {
        delete[] data;
        cout << "析构" << endl;
    }

    // 拷贝构造
    Buffer(const Buffer& other) : size(other.size) {
        data = new int[size];
        copy(other.data, other.data + size, data);
        cout << "拷贝构造" << endl;
    }

    // 移动构造（C++11）
    Buffer(Buffer&& other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        cout << "移动构造" << endl;
    }

    // 移动赋值
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
            cout << "移动赋值" << endl;
        }
        return *this;
    }

    // 禁止拷贝赋值
    Buffer& operator=(const Buffer&) = delete;
};

// 使用 std::move 触发移动语义
int main() {
    Buffer buf1(100);
    Buffer buf2 = std::move(buf1);  // 移动构造
    buf1 = Buffer(50);              // 移动赋值
}
```

## 文件操作

```cpp
#include <fstream>
#include <filesystem>  // C++17

// 写入文本
ofstream out("output.txt");
out << "Hello C++" << endl;
out.close();

// 读取文本
ifstream in("input.txt");
string line;
while (getline(in, line)) {
    cout << line << endl;
}

// 二进制读写
ofstream bin("data.bin", ios::binary);
int value = 42;
bin.write(reinterpret_cast<char*>(&value), sizeof(value));

// 文件系统操作 (C++17)
namespace fs = std::filesystem;

// 创建目录
fs::create_directory("backup");

// 遍历目录
for (const auto& entry : fs::directory_iterator(".")) {
    cout << entry.path() << endl;
}

// 检查文件状态
if (fs::exists("input.txt")) {
    cout << "文件大小: " << fs::file_size("input.txt") << endl;
}
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

# 多文件编译
g++ -c file1.cpp -o file1.o
g++ -c file2.cpp -o file2.o
g++ file1.o file2.o -o app

# 预处理器宏定义
g++ -DDEBUG -DLOG_LEVEL=2 -o app main.cpp

# 查看预处理结果
g++ -E main.cpp -o main.i
```

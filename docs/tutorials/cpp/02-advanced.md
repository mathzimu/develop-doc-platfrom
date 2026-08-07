# C++ 进阶深入

掌握这些进阶主题是从 C++ 初学者迈向工程实践者的关键一步。

## RAII 模式深入

RAII（Resource Acquisition Is Initialization）是 C++ 最核心的资源管理技术。

```cpp
class DatabaseConnection {
    sqlite3* db;
public:
    DatabaseConnection(const string& path) {
        sqlite3_open(path.c_str(), &db);
        if (!db) throw runtime_error("Failed to open DB");
    }
    ~DatabaseConnection() {
        if (db) sqlite3_close(db);
    }
    // 禁止拷贝
    DatabaseConnection(const DatabaseConnection&) = delete;
    DatabaseConnection& operator=(const DatabaseConnection&) = delete;
    // 允许移动
    DatabaseConnection(DatabaseConnection&& other) noexcept
        : db(std::exchange(other.db, nullptr)) {}
    DatabaseConnection& operator=(DatabaseConnection&& other) noexcept {
        if (this != &other) {
            if (db) sqlite3_close(db);
            db = std::exchange(other.db, nullptr);
        }
        return *this;
    }
};

// 使用 RAII 包装器
class FileGuard {
    FILE* fp;
public:
    FileGuard(const char* name, const char* mode) : fp(fopen(name, mode)) {
        if (!fp) throw runtime_error("Cannot open file");
    }
    ~FileGuard() { if (fp) fclose(fp); }
    FILE* get() const { return fp; }
};
```

## 模板元编程

### SFINAE（Substitution Failure Is Not An Error）

```cpp
// 使用 enable_if 启用/禁用重载
template <typename T>
enable_if_t<is_integral_v<T>, T> half(T val) {
    return val / 2;
}

template <typename T>
enable_if_t<is_floating_point_v<T>, T> half(T val) {
    return val / 2.0;
}

// 检测成员是否存在
template <typename T, typename = void>
struct has_begin : false_type {};

template <typename T>
struct has_begin<T, void_t<decltype(declval<T>().begin())>> : true_type {};
```

### type_traits

```cpp
#include <type_traits>

template <typename T>
void process(T&& val) {
    if constexpr (is_pointer_v<decay_t<T>>) {
        cout << "指针类型: " << *val << endl;
    } else if constexpr (is_integral_v<decay_t<T>>) {
        cout << "整数类型: " << val << endl;
    } else if constexpr (is_class_v<decay_t<T>>) {
        cout << "类类型" << endl;
    }
}
```

### Variadic Templates & Fold Expressions

```cpp
// 变参模板类
template <typename... Types>
struct TypeList {};

// 递归变参模板
template <typename T>
T sum_all(T t) { return t; }

template <typename T, typename... Args>
T sum_all(T first, Args... rest) {
    return first + sum_all(rest...);
}

// C++17 Fold Expression
template <typename... Args>
auto sum_all_fold(Args... args) {
    return (... + args);  // 一元左折叠
}

template <typename... Args>
void print_all(Args... args) {
    (cout << ... << args) << endl;  // 折叠 + 流输出
}

// 逗号折叠
template <typename... Args>
void call_all(Args&&... args) {
    (..., args());  // 依次调用所有函数对象
}

// 模板参数包展开
template <typename... Args>
struct Tuple;

template <>
struct Tuple<> {};

template <typename First, typename... Rest>
struct Tuple<First, Rest...> : Tuple<Rest...> {
    First value;
    Tuple(First v, Rest... r) : Tuple<Rest...>(r...), value(v) {}
};
```

## 右值引用与完美转发

```cpp
// std::forward 实现完美转发
template <typename T, typename... Args>
unique_ptr<T> make_unique_with_log(Args&&... args) {
    cout << "Creating object..." << endl;
    return unique_ptr<T>(new T(std::forward<Args>(args)...));
}

// 引用折叠规则
// T&  &  → T&
// T&  && → T&
// T&& &  → T&
// T&& && → T&&

// 实际应用：工厂函数
struct Widget {
    string name;
    vector<int> data;
    Widget(string n, vector<int> d) : name(move(n)), data(move(d)) {}
};

template <typename... Args>
auto create_widget(Args&&... args) {
    return Widget(std::forward<Args>(args)...);
}
```

## C++17/20 新特性

### std::optional

```cpp
optional<int> safe_divide(int a, int b) {
    if (b == 0) return nullopt;
    return a / b;
}

// 使用
auto result = safe_divide(10, 2);
if (result) {
    cout << *result << endl;
}
cout << result.value_or(-1) << endl;
```

### std::variant

```cpp
using Value = variant<int, double, string>;

Value v1 = 42;
Value v2 = 3.14;
Value v3 = "hello"s;

// 访问
visit([](auto&& arg) { cout << arg << endl; }, v1);

// 按类型获取
if (holds_alternative<int>(v1)) {
    cout << get<int>(v1) << endl;
}
```

### std::any

```cpp
any anything = 42;
anything = string("hello");

// 安全提取
if (auto ptr = any_cast<string>(&anything)) {
    cout << *ptr << endl;
}
```

### std::span (C++20)

```cpp
// 不拥有所有权的数组视图
void process_data(span<int> data) {
    for (auto& elem : data) {
        elem *= 2;
    }
}

vector<int> vec = {1, 2, 3, 4, 5};
int arr[] = {6, 7, 8};

process_data(vec);
process_data(arr);
process_data({vec.data() + 1, 3});  // 子范围
```

### std::format (C++20)

```cpp
string msg = format("Hello, {}! You are {} years old.", "Alice", 30);
cout << msg << endl;

// 格式化控制
cout << format("{:.2f}", 3.14159) << endl;     // 3.14
cout << format("{:>10}", "right") << endl;     // 右对齐
cout << format("{:b}", 42) << endl;            // 二进制 101010
```

### Concepts (C++20)

```cpp
template <typename T>
concept Hashable = requires(T a) {
    { hash<T>{}(a) } -> convertible_to<size_t>;
};

template <typename T>
concept Comparable = requires(T a, T b) {
    { a < b } -> convertible_to<bool>;
    { a == b } -> convertible_to<bool>;
};

template <Comparable T>
const T& min(const T& a, const T& b) {
    return (b < a) ? b : a;
}

// 组合 concept
template <typename T>
concept SortableContainer = requires(T& c) {
    { c.begin() } -> forward_iterator;
    { c.end() } -> forward_iterator;
    typename T::value_type;
    requires Comparable<typename T::value_type>;
};
```

### Coroutines (C++20)

```cpp
#include <coroutine>
#include <generator>  // C++23

// 简化生成器 (C++23)
generator<int> range(int from, int to) {
    for (int i = from; i < to; ++i) {
        co_yield i;
    }
}

// 使用
for (int n : range(0, 5)) {
    cout << n << " ";  // 0 1 2 3 4
}
```

## 内存管理

### Placement New

```cpp
// 在已分配内存上构造对象
alignas(Widget) unsigned char buffer[sizeof(Widget)];

Widget* pw = new (buffer) Widget("hello", {1, 2, 3});
pw->~Widget();  // 必须手动析构
```

### 简单的内存池

```cpp
template <typename T, size_t BlockSize = 1024>
class Pool {
    union Slot { T obj; Slot* next; };
    Slot* free_list = nullptr;
    vector<Slot*> blocks;

public:
    Pool() { allocate_block(); }
    ~Pool() { for (auto* b : blocks) free(b); }

    T* allocate() {
        if (!free_list) allocate_block();
        auto* p = free_list;
        free_list = free_list->next;
        return &p->obj;
    }

    void deallocate(T* p) {
        auto* slot = reinterpret_cast<Slot*>(p);
        slot->next = free_list;
        free_list = slot;
    }

private:
    void allocate_block() {
        auto* block = static_cast<Slot*>(malloc(BlockSize * sizeof(Slot)));
        blocks.push_back(block);
        for (size_t i = 0; i < BlockSize; ++i) {
            block[i].next = free_list;
            free_list = &block[i];
        }
    }
};
```

### 定制分配器

```cpp
template <typename T>
struct LoggingAllocator {
    using value_type = T;

    LoggingAllocator() = default;

    T* allocate(size_t n) {
        cout << "Allocate " << n * sizeof(T) << " bytes" << endl;
        return static_cast<T*>(::operator new(n * sizeof(T)));
    }

    void deallocate(T* p, size_t n) {
        cout << "Deallocate " << n * sizeof(T) << " bytes" << endl;
        ::operator delete(p);
    }
};
```

## 多线程编程

### 线程基础

```cpp
#include <thread>
#include <mutex>
#include <condition_variable>
#include <future>
#include <atomic>

mutex mtx;
int shared_data = 0;

void worker(int id) {
    lock_guard<mutex> lock(mtx);
    shared_data += id;
    cout << "Thread " << id << " done" << endl;
}

// jthread (C++20): 自动 join
void worker_jthread(const stop_token& st, int id) {
    while (!st.stop_requested()) {
        cout << "Working " << id << endl;
        this_thread::sleep_for(100ms);
    }
}
```

### async / future

```cpp
int compute(int n) {
    this_thread::sleep_for(1s);
    return n * n;
}

// 异步执行
auto future = async(launch::async, compute, 5);
cout << "Waiting..." << endl;
cout << "Result: " << future.get() << endl;  // 阻塞等待

// shared_future: 多个线程共享结果
auto shared = future.share();
```

### atomic 与无锁编程基础

```cpp
atomic<int> counter{0};

void increment() {
    for (int i = 0; i < 1000; ++i) {
        counter.fetch_add(1, memory_order_relaxed);
    }
}

// 无锁栈 (简化)
template <typename T>
class LockFreeStack {
    struct Node { T data; Node* next; };
    atomic<Node*> head{nullptr};

public:
    void push(const T& val) {
        Node* node = new Node{val, head.load()};
        while (!head.compare_exchange_weak(node->next, node)) {}
    }

    bool pop(T& out) {
        Node* old_head = head.load();
        while (old_head && !head.compare_exchange_weak(old_head, old_head->next)) {}
        if (!old_head) return false;
        out = old_head->data;
        delete old_head;
        return true;
    }
};
```

## 异常安全

C++ 异常安全分为三个等级：

```cpp
class Account {
    int balance;
public:
    // 基本保证：不泄露资源，但可能状态不一致
    void deposit_basic(int amount) {
        balance += amount;  // 如果 += 抛异常，balance 状态改变
    }

    // 强保证：操作要么完全成功，要么回滚到原始状态
    void deposit_strong(int amount) {
        int new_balance = balance + amount;  // 先计算
        balance = new_balance;               // 再赋值（不抛异常）
    }

    // noexcept 保证：绝不抛异常
    int get_balance() const noexcept {
        return balance;
    }
};

// 复制并交换惯用法（强保证）
void swap(Account& other) noexcept {
    std::swap(balance, other.balance);
}
```

## 设计模式

### 工厂模式

```cpp
enum class ShapeType { Circle, Square, Triangle };

class Shape {
public:
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    void draw() const override { cout << "Circle" << endl; }
};

class Square : public Shape {
public:
    void draw() const override { cout << "Square" << endl; }
};

class ShapeFactory {
public:
    static unique_ptr<Shape> create(ShapeType type) {
        switch (type) {
            case ShapeType::Circle:  return make_unique<Circle>();
            case ShapeType::Square:  return make_unique<Square>();
            default: throw invalid_argument("Unknown shape");
        }
    }
};
```

### 单例模式

```cpp
class Singleton {
    Singleton() = default;
    ~Singleton() = default;
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

public:
    static Singleton& instance() {
        static Singleton inst;  // C++11 保证线程安全初始化
        return inst;
    }

    void do_something() { cout << "Singleton work" << endl; }
};
```

### 观察者模式

```cpp
class Observer {
public:
    virtual void update(const string& event) = 0;
    virtual ~Observer() = default;
};

class Subject {
    vector<Observer*> observers;
public:
    void attach(Observer* obs) { observers.push_back(obs); }
    void notify(const string& event) {
        for (auto* obs : observers) {
            obs->update(event);
        }
    }
};

class LogObserver : public Observer {
public:
    void update(const string& event) override {
        cout << "[LOG] " << event << endl;
    }
};
```

### 策略模式

```cpp
class SortStrategy {
public:
    virtual void sort(vector<int>& data) const = 0;
    virtual ~SortStrategy() = default;
};

class QuickSort : public SortStrategy {
public:
    void sort(vector<int>& data) const override {
        std::sort(data.begin(), data.end());
        cout << "QuickSort" << endl;
    }
};

class BubbleSort : public SortStrategy {
public:
    void sort(vector<int>& data) const override {
        for (size_t i = 0; i < data.size(); ++i)
            for (size_t j = 0; j < data.size() - i - 1; ++j)
                if (data[j] > data[j + 1]) swap(data[j], data[j + 1]);
        cout << "BubbleSort" << endl;
    }
};

class Sorter {
    unique_ptr<SortStrategy> strategy;
public:
    void set_strategy(unique_ptr<SortStrategy> s) { strategy = std::move(s); }
    void execute(vector<int>& data) const { strategy->sort(data); }
};
```

## 官方文档

移动语义、指针、模板、并发、资源管理与现代化编程，以 cppreference 与标准草案为准。

| 主题 | 链接 |
|------|------|
| 语言与 STL | [cppreference（中文）](https://zh.cppreference.com/w/cpp) · [cppreference（英文）](https://en.cppreference.com/w/cpp) |
| 标准草案 | [eel.is C++ Draft](https://eel.is/c++draft/) · [ISO/IEC 14882](https://isocpp.org/std/the-standard) |
| 移动语义 | [移动构造函数](https://en.cppreference.com/w/cpp/language/move_constructor) · [引用折叠](https://en.cppreference.com/w/cpp/language/reference) |
| 智能指针 | [std::unique_ptr](https://en.cppreference.com/w/cpp/memory/unique_ptr) · [std::shared_ptr](https://en.cppreference.com/w/cpp/memory/shared_ptr) |
| 模板与泛型 | [模板（C++ 编程指南）](https://en.cppreference.com/w/cpp/language/templates) · [SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) |
| 并发 | [std::thread](https://en.cppreference.com/w/cpp/thread) · [并发支持](https://en.cppreference.com/w/cpp/thread) |
| Modern C++ 指南 | [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) |

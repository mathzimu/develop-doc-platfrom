# C++ 基础语法

C++ 是 C 的超集，在保留底层内存控制能力的同时，引入了面向对象、泛型等现代编程范式。本章覆盖类型与初始化、命名空间、枚举、数组、字符串、指针与引用、const-correctness、函数、类型转换、异常、OOP、模板、STL、移动语义、Ranges、文件与编译选项，示例默认使用 C++20。类型与标准库细节以 [cppreference](https://en.cppreference.com/w/cpp) 为准。

::: tip 官方参考
本章所有语言与标准库行为以 [cppreference](https://en.cppreference.com/w/cpp) 与 [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) 为准。
:::

## 变量与基本类型

C++ 是**静态类型**语言，变量使用前必须声明类型。基本类型一览：

| 类别 | 类型 | 说明 |
|------|------|------|
| 有符号整数 | `signed char` `short` `int` `long` `long long` | 至少 8/16/16/32/64 位 |
| 无符号整数 | `unsigned char` `unsigned short` `unsigned` `unsigned long` `unsigned long long` | 同上，无符号 |
| 浮点数 | `float` `double` `long double` | IEEE 754 单/双精度 |
| 字符与字符串 | `char` `char8_t`(C++20) `std::string` | UTF-8 字符需 `char8_t` |
| 布尔 | `bool` | `true` / `false` |
| 空类型 | `void` | 仅用于函数返回/指针 |

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

### 初始化方式

C++ 有多种初始化形式，语义各异，初学者最容易在这里踩坑：

```cpp
int a = 5;        // 拷贝初始化
int b(5);          // 直接初始化
int c{5};          // 列表初始化（C++11），禁止窄化
int d = {5};       // 列表初始化的赋值形式

// 窄化（narrowing）：会丢失信息
double x = 3.14;
// int e{x};       // 编译错误：double → int 窄化
int f = x;         // 允许，但会截断为 3

// 内置类型默认初始化是不确定值（局部变量）
int g;             // 未初始化，读取是未定义行为！
int h{};           // 值初始化为 0
int* p{};          // 值初始化为 nullptr

// 类类型默认初始化调用默认构造函数
std::string s;     // 空字符串 ""
std::vector<int> v;// 空 vector
```

::: tip 优先用 `{}` 初始化
列表初始化（`T x{...}`）**禁止窄化转换**，且对内置类型会值初始化，是最安全的统一写法。但注意 `std::vector<int> v{10}` 调用列表构造（含 1 个元素 10），而 `v(10)` 才是「10 个默认值」——构造函数重载选择会受影响。
:::

### 常量分类

C++ 的「常量」有多种，适用场景不同：

| 关键字 | 作用域 | 求值时机 | 典型用途 |
|--------|--------|----------|----------|
| `const` | 任意 | 运行期（可能编译期） | 只读变量、保护不被修改 |
| `constexpr` | 任意 | **必须编译期** | 编译期常量、可被 constexpr 函数消费 |
| `consteval` (C++20) | 函数 | **必须编译期**且每次调用 | 立即函数（强制编译期求值） |
| `constinit` (C++20) | 静态/线程局部 | 编译期初始化 | 防止静态初始化顺序问题（SIOF） |

```cpp
const int runtime_size = get_size();   // 运行期确定，不可改
constexpr int compile_size = 42;       // 编译期确定
constexpr double PI = 3.14159265;

// constexpr 函数：可在编译期或运行期求值
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
static_assert(factorial(5) == 120, ""); // 编译期断言

// consteval：调用必须能在编译期完成
consteval int square(int n) { return n * n; }
constexpr int a = square(3);            // OK，编译期
// int b = square(get_input());         // 错误：运行期输入不能用于 consteval

// constinit：保证静态变量编译期初始化，避免 SIOF
constinit int global_counter = 0;
```

::: tip const vs constexpr
- `const` 只表示「不可修改」，不保证编译期已知——`const int x = rand();` 合法但非编译期。
- `const` 变量若由编译期表达式初始化，会自动成为编译期常量，但显式写 `constexpr` 更清晰、可作为模板参数。
- 写库时优先 `constexpr` 函数：既能编译期使用，也能在运行期当作普通函数。
:::

### 字面量

```cpp
// 整数进制
int dec = 42;          // 十进制
int oct = 052;         // 八进制（前缀 0）
int hex = 0x2A;        // 十六进制（前缀 0x）
int bin = 0b101010;    // 二进制（C++14，前缀 0b）

// 数字分隔符（C++14，单引号 '）
int big = 1'000'000;
double tiny = 0.000'001;

// 浮点字面量
double d1 = 3.14;
double d2 = 1.5e3;     // 1500.0
double d3 = 1.5e-3;    // 0.0015

// 字符与字符串字面量
char        c = 'A';
const char* s = "hello";           // const char[6]，结尾含 '\0'
wchar_t    ws = L'字';              // 宽字符
const char8_t* u8 = u8"utf-8";      // C++20
std::string_view sv = "hello"sv;   // 用户定义字面量

// 原始字符串：R"(...)"，反斜杠与换行原样保留
const char* regex = R"(\d+\.\d+)"; // 等价于 "\\d+\\.\\d+"
const char* multi = R"(
line1
line2
)";

// 用户定义字面量（标准库提供）
using namespace std::string_literals;  // 启用 "..."s
using namespace std::chrono_literals;  // 启用 1h, 30min, 1s, 500ms
auto name = "hello"s;                 // std::string
auto dur = 1h + 30min;                // std::chrono::duration
```

### 类型属性查询

```cpp
#include <limits>
#include <type_traits>

std::cout << std::numeric_limits<int>::max();      // 2147483647
std::cout << std::numeric_limits<int>::min();      // -2147483648
std::cout << std::numeric_limits<int>::digits;    // 31（符号位不计入）
std::cout << std::numeric_limits<double>::epsilon();// 2.22e-16

// 编译期类型特征
static_assert(std::numeric_limits<int>::is_signed);
static_assert(std::is_integral_v<int>);
static_assert(std::is_same_v<std::decay_t<const int&>, int>); // 退化后比较
```

### auto 与 decltype 推导规则

```cpp
int x = 42;
const int& cx = x;

auto a = cx;        // auto 推导为 int，丢弃 const 与引用
const auto& b = cx; // 显式加 const&，得到 const int&
auto& c = cx;       // 保留 const：const int&

// auto&& 是「转发引用」(forwarding reference)，可绑左值或右值
auto&& d = x;       // x 是左值 → d 是 int&
auto&& e = 42;      // 42 是右值 → d 是 int&&

// decltype 保留表达式类型（含引用与 const）
decltype(x)  y = 0; // int
decltype(cx) z = x; // const int&
decltype((x)) w = x; // 注意：带括号是左值表达式 → int&
```

::: tip auto 的常见陷阱
- `auto` 默认**丢弃顶层 const 与引用**；要保留请写 `const auto&` 或 `auto&&`。
- `auto x = {1, 2, 3}` 推导出 `std::initializer_list<int>`，不是 `vector`。
- `auto` 用于字符串字面量会得到 `const char*`，要 `std::string` 请用 `"..."s` 或显式写类型。
- `decltype(e)` 与 `decltype((e))` 不同：前者是 `e` 的声明类型，后者是「`e` 作为表达式」的类型（左值加 `&`）。
:::

## 命名空间

命名空间用于避免全局作用域的名字冲突，是组织大型 C++ 代码的基础。

```cpp
// 定义
namespace graphics {
    int width = 800;
    void render() { /* ... */ }

    // 嵌套
    namespace v2 {
        void render() { /* 新版本实现 */ }
    }
}

// 访问
graphics::render();
graphics::v2::render();

// using 声明：引入单个名字
using graphics::width;  // 之后直接用 width

// using 指令：敞开整个命名空间（慎用，易污染）
using namespace graphics;

// 命名空间别名
namespace g = graphics;
g::render();

// 内联命名空间（C++17）：内部名字直接暴露到外层
namespace mylib {
    inline namespace v2 {
        int api();     // mylib::api() 与 mylib::v2::api() 等价
    }
}
```

::: tip using 声明 vs using 指令
- `using std::cout;` 只引入 `cout`，推荐在头文件中使用。
- `using namespace std;` 引入整个 `std`，可能造成歧义（如自定义 `count` 与 `std::count` 冲突）。**不要在头文件中、尤其是全局作用域使用**，否则会传染所有包含该头文件的代码。
- 匿名命名空间 `namespace { ... }` 等价于 C 的 `static`，使名字仅在本翻译单元可见，是替代 `static` 的现代写法。
:::

### 参数依赖查找（ADL）

调用未限定名的函数时，编译器会在参数所在的命名空间中查找候选：

```cpp
namespace geo {
    struct Point { int x, y; };
    bool operator==(const Point& a, const Point& b) {
        return a.x == b.x && a.y == b.y;
    }
}

geo::Point p1{1, 2}, p2{1, 2};
// 不写 geo::，编译器依据参数类型在 geo:: 内查找 operator==
bool same = (p1 == p2);
```

> ADL 是泛型编程（如 `std::swap`、运算符重载）自动找到正确重载的关键，但也是偶尔出现「奇怪重载被选中」的原因。

## 枚举

C++ 有两类枚举：传统**无作用域枚举**与 C++11 引入的**有作用域枚举** `enum class`。

```cpp
// 无作用域枚举（传统，向外泄露名字）
enum Color { RED, GREEN, BLUE };
Color c = RED;
int n = RED;          // 隐式转换为 int（隐患：可能误用）
int first = c;        // 0

// 有作用域枚举（推荐）
enum class TrafficLight { Red, Yellow, Green };
TrafficLight t = TrafficLight::Red;
// int x = t;         // 错误：不会隐式转 int
int y = static_cast<int>(t); // 必须显式转换

// 指定底层类型
enum class Level : unsigned char { Debug, Info, Warn, Error };

// 显式赋值
enum class Flags : unsigned int { None = 0, A = 1, B = 2, C = 4 };

// using enum（C++20）：把枚举项引入当前作用域
enum class Direction { Up, Down, Left, Right };
void move(Direction d);
void f() {
    using enum Direction;
    move(Up);         // 等价于 Direction::Up
}
```

::: tip 优先用 enum class
- 无作用域 `enum` 的名字污染外层作用域，且会隐式转 `int`，容易与整数混用出 bug。
- `enum class` 限定作用域、不会隐式转换，是默认选择；只在需要和 C 接口互通、或希望隐式转 int 时用传统 `enum`。
:::

### 枚举与 switch

```cpp
enum class Status { Ok, NotFound, Error };

std::string describe(Status s) {
    switch (s) {
        case Status::Ok:       return "OK";
        case Status::NotFound: return "Not Found";
        case Status::Error:    return "Error";
    }
    // 未覆盖所有枚举项时，部分编译器会警告（-Wswitch）
    return "Unknown";
}
```

## 数组、array 与 span

```cpp
// C 风格数组：固定长度，退化为指针
int arr[5] = {1, 2, 3, 4, 5};
int first = arr[0];
int* p = arr;          // 退化：arr 的类型变成 int*
// sizeof(arr) = 20；sizeof(p) = 8（指针大小）
```

`std::array` 是 C++11 对 C 数组的现代封装：固定长度、零额外开销、可拷贝、有迭代器。

```cpp
#include <array>

std::array<int, 5> a = {1, 2, 3, 4, 5};
std::cout << a.size();          // 5
std::cout << a.front();         // 1
std::cout << a.back();          // 5
std::sort(a.begin(), a.end());

// C++17 CTAD：可省略模板参数
std::array b = {1.0, 2.0, 3.0}; // std::array<double, 3>

// 多维
std::array<std::array<int, 3>, 3> matrix = {
    1, 2, 3, 4, 5, 6, 7, 8, 9
};
```

`std::span`（C++20）是「不拥有所有权的连续区间视图」，类似 Rust 的 slice 或 `string_view` 之于字符串。

```cpp
#include <span>

// 函数接受任何连续区间，零拷贝
void process(std::span<int> data) {
    for (auto& x : data) x *= 2;
    std::cout << data.size();
}

std::array<int, 5> a = {1, 2, 3, 4, 5};
int c_arr[] = {6, 7, 8};
std::vector<int> v = {9, 10};

process(a);                       // 接受 array
process(c_arr);                  // 接受 C 数组
process(v);                      // 接受 vector
process({a.data() + 1, 3});      // 子区间
```

::: tip 数组退化的陷阱
- `void f(int arr[5])` 形参中的数组大小被忽略，等价于 `int* arr`——在函数内 `sizeof(arr)` 得到指针大小。
- 数组传参应改用 `std::array<T, N>`、`std::span<T>` 或引用 `int (&arr)[5]`，后者保留大小信息但需精确匹配。
:::

## 字符串与 string_view

```cpp
#include <string>
#include <string_view>

// 构造与拼接
std::string s = "Hello";
s += ", ";
s.append("World");
std::string full = s + "!";

// 常用操作
s.size();           // 长度（等价 s.length()）
s.empty();          // 是否为空
s[0];               // 第一个字符（不检查越界）
s.at(0);            // 会做越界检查，越界抛 std::out_of_range
s.substr(0, 3);     // 子串
s.find("World");    // 查找，返回下标，找不到返回 std::string::npos
s.find("World", 3); // 从下标 3 开始查
s.rfind("l");       // 从后向前查
s.replace(0, 5, "Hi"); // 替换
s.insert(5, ", ");
s.erase(0, 2);      // 删除前 2 个字符
s.compare("Hi");    // 字典序比较，返回 <0/0/>0

// 比较：直接用运算符
if (s == "Hi, World!") { /* ... */ }
if (s < "Zoo")      { /* 字典序比较 */ }

// 数字 ↔ 字符串
#include <string>
std::string n = std::to_string(42);    // "42"
int i = std::stoi("42");                // 42
double d = std::stod("3.14");           // 3.14
// 失败抛 std::invalid_argument / std::out_of_range
```

`std::string_view`（C++17）是只读字符串视图，**不拥有内存**，开销仅是一对指针 + 长度，适合函数参数。

```cpp
// 函数参数：接受 const char*、std::string、字面量，无需拷贝
void log(std::string_view msg) {
    std::cout << msg << '\n';
}

log("literal");           // const char*
std::string s = "std::string";
log(s);                    // std::string 隐式转 string_view
log(s.substr(0, 3));       // 子串（仍是 view，零拷贝）

// C 字符串 vs string_view：C 字符串以 '\0' 结尾，string_view 可包含 '\0'
std::string_view sv = "hello";
std::cout << sv.size();    // 5（不含 '\0'）
```

::: tip string_view 的生命周期陷阱
- `string_view` 不拥有内存，**指向的源对象失效后访问 view 是未定义行为**。
- 典型错误：函数返回 `string_view` 指向局部 `std::string` 的临时对象。
  ```cpp
  std::string_view bad() { return std::string("tmp"); } // 返回后 string 已析构
  ```
- 规则：`string_view` 仅用于「函数参数 + 同步使用」，**不要存为成员、不要返回指向临时对象的 view**。
:::

### 原始字符串字面量

```cpp
// 反斜杠与换行原样保留，常用于正则与多行文本
const char* regex = R"(\d+\.\d+)";          // 等价 "\\d+\\.\\d+"
const char* json  = R"({"key": "value"})";   // 双引号无需转义
const char* multi = R"(
line1
line2
)";

// 自定义分隔符避免内容中出现 )" 冲突
const char* tricky = R"DELIM(内容里可以包含 )" 字符)DELIM";
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

::: tip 指针 vs 引用 vs 智能指针
- **原始指针**只保存地址，不负责释放，**容易内存泄漏/悬垂指针**，现代 C++ 中应尽量避免裸用。
- **引用**是别名，必须初始化、不能为 null、不可重新绑定，适合作为函数参数传递（避免拷贝）。
- **智能指针**（`unique_ptr` / `shared_ptr`）自动管理生命周期：离开作用域时自动释放，是首选。规则：默认用 `unique_ptr`（独占、零开销）；需共享时用 `shared_ptr`；`weak_ptr` 专门打破 `shared_ptr` 的循环引用。
- 传参：`const T&` 用于「只读、避免拷贝」；`T&` 用于「需要修改原对象」。
:::

### const 的位置与含义

`const` 在指针声明中的位置决定修饰的是「指针本身」还是「所指对象」：

```cpp
int value = 42;
int other = 99;

const int* a = &value;        // 指向 const int：不能通过 a 改 value
int const* b = &value;        // 同上（const 与类型名谁前谁后等价）
int* const c = &value;        // const 指针：c 本身不能改指向
const int* const d = &value;  // 两者都 const

a = &other;                   // OK：可改 a 的指向
// *a = 10;                    // 错误：不能通过 a 改所指对象
*c = 10;                      // OK：c 指向可改，但 c 本身不能换指向
// c = &other;                 // 错误：c 是 const 指针，不能改指向
```

> 口诀：**`const` 修饰它左边的东西；若在最左则修饰右边**。`const int*` 与 `int const*` 完全等价。

### const 引用与右值

```cpp
// const 引用可绑定到右值，并延长其生命周期
const std::string& ref = std::string("tmp");  // 临时对象生命周期延长到 ref 作用域结束
// std::string& bad = std::string("tmp");    // 错误：非 const 引用不能绑右值

// 函数返回 const T&：禁止调用方修改，常用于返回内部成员的只读访问
class Container {
    std::vector<int> data_;
public:
    const std::vector<int>& data() const { return data_; }
};
```

### const 成员函数

```cpp
class Account {
    mutable int cache_hits = 0;  // mutable：const 函数中也可改
    int balance_;
public:
    int get_balance() const {     // const 方法：不改对象状态
        ++cache_hits;             // mutable 字段除外
        return balance_;
    }
    void deposit(int amt) { balance_ += amt; } // 非 const 方法
};

const Account a;
a.get_balance();                  // OK：const 对象只能调 const 方法
// a.deposit(10);                 // 错误：const 对象不能调非 const 方法
```

::: tip const-correctness
- 默认把成员函数声明为 `const`（只要不修改逻辑状态），这样 const 对象也能调用。
- 参数能传 `const T&` 就传 `const T&`：避免拷贝，又能接受 const 对象和右值。
- `mutable` 仅用于「与逻辑状态无关」的缓存、统计字段，不要滥用。
:::

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

// 返回类型推导（C++14）
auto add(int a, int b) { return a + b; }  // 返回类型由 return 推导

// 后置返回类型（用于模板或参数依赖返回）
template <typename T, typename U>
auto mul(T a, U b) -> decltype(a * b) { return a * b; }

// 默认参数：必须从右向左依次省略，声明中只能出现一次
void log_msg(const std::string& msg, int level = 0, bool flush = false);
```

## 类型转换

C++ 区分**隐式转换**与多种**显式转换**，并禁止 C 风格转换的滥用。

### 隐式转换与整型提升

```cpp
int i = 42;
double d = i;            // int → double：安全
int j = d;               // double → int：截断，可能丢失信息
unsigned u = -1;         // int → unsigned：得到一个大正数（陷阱！）

// 比较时的隐式转换陷阱
unsigned a = 5;
int b = -1;
if (b < a) { /* 可能不进入：b 被转为 unsigned，变成大正数 */ }

// 算术运算前进行整型提升
short s1 = 1, s2 = 2;
auto r = s1 + s2;        // r 是 int（short 提升为 int）
```

::: tip 无符号陷阱
- `int` 与 `unsigned` 混合运算时 `int` 会转为 `unsigned`，负数变成大正数，导致比较与循环出错。
- 循环写 `for (size_t i = n - 1; i >= 0; --i)` 是无限循环——`size_t` 无符号，永远 `>= 0`。
- 规则：避免混用有/无符号；循环计数优先 `ptrdiff_t` 或显式判断 `i != 0`。
:::

### 四种显式转换

| 转换 | 用途 | 示例 |
|------|------|------|
| `static_cast<T>(e)` | 相关类型间的合理转换 | `int`↔`double`、`void*`↔`T*`、枚举↔整数 |
| `dynamic_cast<T>(e)` | 多态向下转换（需虚函数），运行期检查 | `Base*`→`Derived*` |
| `const_cast<T>(e)` | 增删 `const` / `volatile` | 去掉 const 修改（危险） |
| `reinterpret_cast<T>(e)` | 位模式重新解释（不安全） | 指针↔整数、不相关指针互转 |

```cpp
double pi = 3.14;
int rounded = static_cast<int>(pi);          // 3，显式且可搜索

// void* 转回原类型
int x = 42;
void* vp = &x;
int* ip = static_cast<int*>(vp);

// dynamic_cast：必须有多态（虚函数）
class Base { public: virtual ~Base() = default; };
class Derived : public Base { public: void special(); };

void f(Base* b) {
    if (auto d = dynamic_cast<Derived*>(b)) { // 失败返回 nullptr
        d->special();
    }
}

// const_cast：去掉只读属性（仅当原对象本就非 const 才安全）
const char* cs = "hello";
// *const_cast<char*>(cs) = 'H';  // 未定义行为：字符串字面量是只读内存！

// reinterpret_cast：危险，慎用
long addr = reinterpret_cast<long>(&x);      // 指针转整数（可移植性差）

// 用户定义转换：单参数构造函数与 operator 转换函数
struct Distance {
    double meters;
    Distance(double m) : meters(m) {}        // 隐式转换构造函数
    operator double() const { return meters; } // 转换为 double
};
Distance d = 3.5;   // double → Distance（隐式）
double m = d;       // Distance → double（隐式）
```

```cpp
struct Smart {
    explicit Smart(int x) : v(x) {}          // explicit：禁止隐式转换
    int v;
};
// Smart s = 5;                               // 错误：explicit 阻止隐式
Smart s(5);                                   // OK：显式构造
```

::: tip 防窄化与 explicit
- 列表初始化 `int x{3.14}` 会因窄化报错，是发现意外的隐式截断的好工具。
- 单参数构造函数默认会作为隐式转换函数，建议加 `explicit` 防止意外隐式转换（除非确实想暴露转换，如 `std::string(const char*)`）。
- **禁用 C 风格转换 `(int)x`**：它依次尝试 `const_cast`、`static_cast`、`reinterpret_cast` 组合，语义不明确且难以在代码中搜索。统一用 `static_cast` 等具名转换。
:::

## 异常处理基础

C++ 异常通过 `try` / `catch` / `throw` 处理错误，与 Java 不同的是**所有异常都是非受检**的，且类型派生自 `std::exception`。

```cpp
#include <stdexcept>
#include <iostream>

// 抛出与自定义异常
struct DivideByZero : std::runtime_error {
    using std::runtime_error::runtime_error; // 继承构造
};

double safe_divide(int a, int b) {
    if (b == 0) throw DivideByZero{"denominator is zero"};
    return static_cast<double>(a) / b;
}

// try / catch
int main() {
    try {
        safe_divide(1, 0);
    } catch (const DivideByZero& e) {
        std::cerr << "divide error: " << e.what() << '\n';
    } catch (const std::exception& e) {  // 按基类兜底，必须放后面
        std::cerr << "other: " << e.what() << '\n';
    } catch (...) {                       // 捕获任意类型
        std::cerr << "unknown error\n";
    }
}
```

### 标准异常层次

```
std::exception
├── std::logic_error       （程序逻辑错误：可在编码期避免）
│   ├── std::invalid_argument
│   ├── std::out_of_range
│   ├── std::length_error
│   └── std::domain_error
└── std::runtime_error      （运行期错误：外部输入/IO）
    ├── std::overflow_error
    ├── std::underflow_error
    └── std::system_error
```

抛出时优先用 `<stdexcept>` 中已有的类型，自定义异常继承 `std::runtime_error` 或 `std::exception` 并实现 `what()`。

### 按引用捕获与重抛

```cpp
try {
    do_work();
} catch (const std::exception& e) {  // 按引用或 const 引用捕获，避免对象切片
    std::cerr << e.what() << '\n';
    throw;                             // 重抛当前异常，保留原始类型与栈信息
}
```

::: tip 异常安全三原则
1. **按 `const` 引用捕获**异常（`catch (const std::exception& e)`），避免切片与多余拷贝。
2. **RAII 管理资源**：构造函数申请、析构函数释放。即便异常抛出，栈展开时局部对象也会被析构，资源不泄漏——这是 C++ 异常安全的基础，无需 `try/finally`。
3. **`noexcept` 用于绝不抛异常的函数**（析构函数默认 `noexcept`）。标 `noexcept` 后若仍抛出会调用 `std::terminate`，不要滥用。
:::

### noexcept 与代价

```cpp
void must_not_throw() noexcept {
    // 若此处抛出异常 → std::terminate，不会继续栈展开
}

// noexcept 还可作为条件：移动构造若 noexcept，容器扩容会移动而非拷贝
class Buffer {
public:
    Buffer(Buffer&&) noexcept;            // 标 noexcept，vector<Buffer> 扩容用移动
    Buffer(const Buffer&);               // 否则退回拷贝
};
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

## Ranges 与 Views（C++20）

Ranges 是 C++20 对 STL 算法的现代化重构：算法直接接受「范围」而非迭代器对，配合 Views 可惰性组合管线。

```cpp
#include <ranges>
#include <algorithm>
#include <vector>

namespace rv = std::ranges::views;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5, 6};

    // 过滤偶数并平方
    auto squared_evens = nums
        | rv::filter([](int n) { return n % 2 == 0; })
        | rv::transform([](int n) { return n * n; });

    for (int n : squared_evens) {
        cout << n << " ";  // 4 16 36
    }

    // 取前 3 个
    for (int n : nums | rv::take(3)) {
        cout << n << " ";  // 1 2 3
    }

    // 逆向
    for (int n : nums | rv::reverse) {
        cout << n << " ";  // 6 5 4 3 2 1
    }

    // ranges 算法：直接传容器，无需 begin()/end()
    std::ranges::sort(nums);
    std::ranges::find(nums, 3);
}
```

::: tip 算法 vs Views
- `<algorithm>` 中的算法（`sort`/`find`/`count_if`）**立即求值**，会修改容器或返回结果。
- Views（`filter`/`transform`/`take`）**惰性求值**，只是描述变换，遍历时才计算，可链式组合且零拷贝。
:::

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

继续学习请前往 [02-进阶深入](/tutorials/cpp/02-advanced)。

## 官方文档与延伸阅读

- **语言标准**：[C++ Reference（cppreference）](https://en.cppreference.com/w/cpp) · [中文版](https://zh.cppreference.com/w/cpp) · [ISO C++](https://isocpp.org/std) · [标准草案](https://eel.is/c++draft/)
- **官方教程**：[C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) · [learn.cpp](https://www.learncpp.com/)
- **构建系统**：[CMake](https://cmake.org/documentation/) · [vcpkg](https://learn.microsoft.com/zh-cn/vcpkg/) · [Conan](https://docs.conan.io/2/)
- **编译器**：[GCC](https://gcc.gnu.org/onlinedocs/) · [Clang](https://clang.llvm.org/docs/) · [MSVC](https://learn.microsoft.com/zh-cn/cpp/)
- **测试/静态分析**：[GoogleTest](https://google.github.io/googletest/) · [Catch2](https://github.com/catchorg/Catch2) · [clang-tidy](https://clang.llvm.org/extra/clang-tidy/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

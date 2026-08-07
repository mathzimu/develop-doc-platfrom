# Python 进阶深入

## 装饰器进阶

### 带参数的装饰器

```python
from functools import wraps

def repeat(n: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name: str):
    print(f"Hello, {name}")

greet("Alice")
# Hello, Alice
# Hello, Alice
# Hello, Alice
```

### 类装饰器

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"调用第 {self.count} 次")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # 调用第 1 次
say_hello()  # 调用第 2 次
```

### functools.wraps

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的元信息
    def wrapper(*args, **kwargs):
        """Wrapper doc"""
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def example():
    """Example doc"""
    pass

print(example.__name__)  # 'example'（没有 wraps 会输出 'wrapper'）
print(example.__doc__)   # 'Example doc'
```

## 生成器与迭代器

### yield from

```python
def chain(*iterables):
    for it in iterables:
        yield from it

list(chain([1, 2, 3], "abc"))  # [1, 2, 3, 'a', 'b', 'c']

# 等价于：
def chain_manual(*iterables):
    for it in iterables:
        for item in it:
            yield item
```

### 生成器表达式

```python
# 生成器表达式 vs 列表推导式
list_comp = [x**2 for x in range(10)]     # 立即求值，O(n) 内存
gen_expr  = (x**2 for x in range(10))     # 惰性求值，O(1) 内存

# 常用于大数据流处理
def read_large_file(file_path: str):
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.strip()
```

### 协程基础

```python
def coroutine():
    print("协程启动")
    while True:
        value = yield
        print(f"收到: {value}")

co = coroutine()
next(co)          # 预激协程
co.send("Hello")  # 收到: Hello
co.send("World")  # 收到: World
co.close()        # 关闭协程
```

## 上下文管理器

### __enter__ / __exit__

```python
class ManagedFile:
    def __init__(self, filename: str, mode: str = "r"):
        self.filename = filename
        self.mode = mode

    def __enter__(self):
        self.file = open(self.filename, self.mode, encoding="utf-8")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()
        if exc_type is not None:
            print(f"发生异常: {exc_val}")
        return False  # 不抑制异常

with ManagedFile("test.txt", "w") as f:
    f.write("Hello, context manager!")
```

### contextlib.contextmanager

```python
from contextlib import contextmanager

@contextmanager
def managed_file(filename: str, mode: str = "r"):
    file = open(filename, mode, encoding="utf-8")
    try:
        yield file
    finally:
        file.close()

with managed_file("test.txt") as f:
    content = f.read()
```

### 嵌套上下文管理器

```python
from contextlib import contextmanager

@contextmanager
def tag(name: str):
    print(f"<{name}>")
    yield
    print(f"</{name}>")

with tag("div"):
    with tag("p"):
        print("Hello")
# <div>
# <p>
# Hello
# </p>
# </div>
```

## 异步编程

### async/await 基础

```python
import asyncio

async def fetch_data(url: str) -> dict:
    print(f"开始请求: {url}")
    await asyncio.sleep(1)  # 模拟 IO
    print(f"完成请求: {url}")
    return {"url": url, "status": 200}

async def main():
    # 顺序执行
    result1 = await fetch_data("/api/1")
    result2 = await fetch_data("/api/2")

    # 并发执行
    tasks = [
        fetch_data("/api/1"),
        fetch_data("/api/2"),
        fetch_data("/api/3"),
    ]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
```

### Task 与 Future

```python
async def main():
    task1 = asyncio.create_task(fetch_data("/api/1"))
    task2 = asyncio.create_task(fetch_data("/api/2"))

    # 等待首个完成
    done, pending = await asyncio.wait(
        [task1, task2],
        return_when=asyncio.FIRST_COMPLETED,
    )

    # 超时控制
    try:
        result = await asyncio.wait_for(
            fetch_data("/api/slow"), timeout=2.0
        )
    except asyncio.TimeoutError:
        print("请求超时")
```

### aiohttp 示例

```python
import aiohttp
import asyncio

async def fetch(session: aiohttp.ClientSession, url: str) -> str:
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, "https://example.com")
        print(len(html))

asyncio.run(main())
```

## 类型系统进阶

### Generic 与 TypeVar

```python
from typing import TypeVar, Generic, Sequence

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

stack = Stack[int]()
stack.push(1)
value = stack.pop()  # int
```

### Protocol（结构子类型）

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("绘制圆形")

class Square:
    def draw(self) -> None:
        print("绘制方形")

def render(obj: Drawable) -> None:
    obj.draw()

render(Circle())  # OK
render(Square())  # OK
```

### TypedDict 与 Literal

```python
from typing import TypedDict, Literal, overload

class UserDict(TypedDict):
    name: str
    age: int
    email: str

user: UserDict = {"name": "Alice", "age": 30, "email": "alice@example.com"}

# Literal
def set_mode(mode: Literal["read", "write", "append"]) -> None:
    print(f"设置为 {mode} 模式")

# overload
@overload
def process(data: int) -> int: ...
@overload
def process(data: str) -> str: ...
def process(data: int | str) -> int | str:
    if isinstance(data, int):
        return data * 2
    return data.upper()
```

## Python 设计模式

### 单例模式

```python
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton()
b = Singleton()
print(a is b)  # True
```

### 工厂模式

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self) -> None: ...

class MySQLDatabase(Database):
    def connect(self) -> None:
        print("连接 MySQL")

class PostgreSQLDatabase(Database):
    def connect(self) -> None:
        print("连接 PostgreSQL")

def create_database(db_type: str) -> Database:
    databases = {
        "mysql": MySQLDatabase,
        "postgresql": PostgreSQLDatabase,
    }
    return databases[db_type]()

db = create_database("postgresql")
db.connect()
```

### 策略模式

```python
from typing import Callable

def quick_sort(data: list) -> list:
    print("快速排序")
    return sorted(data)

def merge_sort(data: list) -> list:
    print("归并排序")
    return sorted(data)

class Sorter:
    def __init__(self, strategy: Callable[[list], list]):
        self.strategy = strategy

    def sort(self, data: list) -> list:
        return self.strategy(data)

sorter = Sorter(quick_sort)
sorter.sort([3, 1, 4, 1, 5])
```

### 观察者模式

```python
from abc import ABC, abstractmethod

class Observer(ABC):
    @abstractmethod
    def update(self, message: str) -> None: ...

class Subject:
    def __init__(self):
        self._observers: list[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def notify(self, message: str) -> None:
        for observer in self._observers:
            observer.update(message)

class EmailNotifier(Observer):
    def update(self, message: str) -> None:
        print(f"邮件通知: {message}")

class SMSNotifier(Observer):
    def update(self, message: str) -> None:
        print(f"短信通知: {message}")

subject = Subject()
subject.attach(EmailNotifier())
subject.attach(SMSNotifier())
subject.notify("系统更新完成")
```

## 性能优化

### __slots__

```python
class Point:
    __slots__ = ("x", "y")  # 禁止动态属性，节省内存

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# Point 实例没有 __dict__，内存减少约 40-50%
p = Point(3.0, 4.0)
# p.z = 5.0  # AttributeError
```

### JIT 加速工具

```python
# Numba — JIT 编译
from numba import jit

@jit(nopython=True)
def sum_array(arr):
    total = 0.0
    for i in range(len(arr)):
        total += arr[i]
    return total

# PyPy — Python JIT 编译器，无需修改代码即可加速
# $ pypy script.py
```

### 常见优化技巧

```python
import math

def slow(radius_list):
    return [math.pi * r ** 2 for r in radius_list]

def fast(radius_list):
    pi = math.pi  # 全局变量绑定为局部变量
    return [pi * r ** 2 for r in radius_list]

# 使用 join 而非 +
def bad(words: list[str]) -> str:
    result = ""
    for w in words:
        result += w  # O(n²)
    return result

def good(words: list[str]) -> str:
    return "".join(words)  # O(n)
```

## 官方文档

类型系统、GIL、异步、装饰器与元类细节以下列一手文档为准。

| 主题 | 链接 |
|------|------|
| 语言参考 | [Language Reference](https://docs.python.org/3/reference/index.html) |
| 数据模型 | [Data Model（特殊方法）](https://docs.python.org/3/reference/datamodel.html) |
| 类型注解 | [typing 模块](https://docs.python.org/3/library/typing.html) · [PEP 484](https://peps.python.org/pep-0484/) · [PEP 695（新类型语法）](https://peps.python.org/pep-0695/) |
| 并发 | [asyncio](https://docs.python.org/3/library/asyncio.html) · [并发执行](https://docs.python.org/3/library/concurrency.html) |
| GIL 与 CPython | [Python Wiki GIL](https://wiki.python.org/moin/GlobalInterpreterLock) · [PEP 703（移除 GIL）](https://peps.python.org/pep-0703/) |
| 装饰器/元类 | [Python Decorators 指南](https://docs.python.org/3/glossary.html#term-decorator) · [元类](https://docs.python.org/3/reference/datamodel.html#customizing-class-creation) |
| 性能分析 | [profile](https://docs.python.org/3/library/profile.html) · [timeit](https://docs.python.org/3/library/timeit.html) |

# Python 教程

Python 是一种易学、可读性强、功能强大的高级编程语言。它广泛应用于 Web 开发、数据科学、人工智能、自动化脚本等领域。

## 环境准备

```sh
# 检查版本
python --version
python3 --version

# 包管理器
pip install package_name
pip install -r requirements.txt
pip freeze > requirements.txt

# 虚拟环境
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows
```

## 基础语法

### 变量与数据类型

```python
# 动态类型，无需声明
name = "Python"       # str
version = 3.12        # float
year = 1991           # int
is_popular = True     # bool
nothing = None        # NoneType

# 类型提示（3.5+）
name: str = "Python"
count: int = 42
items: list[str] = ["a", "b"]

# 类型检查
type(name)          # <class 'str'>
isinstance(42, int) # True
```

### 基本输入输出

```python
# 输出
print("Hello, World!")
print(f"版本: {version}")       # f-string（推荐）
print("版本: {}".format(version))
print("版本: %s" % version)

# 输入
name = input("请输入名字: ")
age = int(input("请输入年龄: "))  # 类型转换
```

### 字符串

```python
s = "Hello Python"

# 常见操作
len(s)                 # 12
s[0]                   # 'H'
s[-1]                  # 'n'
s[0:5]                 # 'Hello'
s.upper()              # 'HELLO PYTHON'
s.lower()              # 'hello python'
s.strip()              # 去首尾空格
s.replace("Python", "World")
s.split(" ")           # ['Hello', 'Python']
" ".join(["a", "b"])   # 'a b'
s.startswith("Hello")  # True
s.endswith("Python")   # True
s.find("Py")           # 6
s.count("o")           # 2

# 多行字符串
multiline = """
这是
多行
字符串
"""
```

## 控制流

### 条件判断

```python
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
else:
    grade = 'D'

# 三元表达式
status = "成年" if age >= 18 else "未成年"

# 模式匹配（3.10+）
match status:
    case "A":
        print("优秀")
    case "B" | "C":
        print("良好")
    case _:
        print("需努力")
```

### 循环

```python
# for 循环
for i in range(5):          # 0,1,2,3,4
    print(i)

for i in range(2, 10, 2):   # 2,4,6,8
    print(i)

for idx, val in enumerate(['a', 'b', 'c']):
    print(idx, val)

# while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# break / continue / else
for n in range(10):
    if n == 3:
        continue     # 跳过
    if n == 7:
        break        # 终止
    print(n)
else:
    print("循环正常结束（未 break）")
```

## 数据结构

### 列表

```python
nums = [3, 1, 4, 1, 5]

# 基本操作
len(nums)                # 5
nums[0]                  # 3
nums[-1]                 # 5
nums[1:3]                # [1, 4]
nums.append(9)           # 末尾添加
nums.insert(0, 0)        # 插入
nums.pop()               # 移除末尾
nums.remove(1)           # 移除第一个匹配
nums.sort()              # 排序
nums.sort(reverse=True)
sorted(nums)             # 返回新列表
nums.reverse()

# 列表推导式
squares = [x**2 for x in range(10)]
evens = [x for x in nums if x % 2 == 0]
matrix = [[i*j for j in range(3)] for i in range(3)]

# 解包
first, *middle, last = nums
```

### 元组（不可变）

```python
point = (3, 4)
x, y = point              # 解包
single = (1,)             # 单元素需加逗号
```

### 字典

```python
user = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "JS"],
}

# 访问
user["name"]              # 'Alice'
user.get("email", "N/A")  # 安全访问，带默认值

# 修改
user["age"] = 31
user["email"] = "alice@example.com"

# 检查
"name" in user            # True

# 遍历
for key in user:             # 键
for key, val in user.items():  # 键值对
for val in user.values():    # 值

# 字典推导式
squares = {x: x**2 for x in range(5)}

# 合并
merged = {**dict1, **dict2}   # 3.5+
merged = dict1 | dict2        # 3.9+
```

### 集合

```python
a = {1, 2, 3, 3}         # {1, 2, 3}（自动去重）
b = set([3, 4, 5])

a | b  # 并集 {1,2,3,4,5}
a & b  # 交集 {3}
a - b  # 差集 {1,2}
a ^ b  # 对称差 {1,2,4,5}

a.add(6)
a.remove(2)
```

## 函数

```python
# 基本函数
def greet(name: str) -> str:
    """返回问候语"""
    return f"Hello, {name}!"

# 默认参数
def power(base, exp=2):
    return base ** exp

# 关键字参数
def create_user(name, age=18, city="Beijing"):
    pass
create_user("Alice", city="Shanghai")

# 可变参数
def log(*args, **kwargs):
    print(args)      # 元组
    print(kwargs)    # 字典

# 匿名函数
squares = list(map(lambda x: x**2, range(5)))
sorted(items, key=lambda x: x["age"])

# 装饰器
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时 {time.time()-start:.3f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
```

## 面向对象

```python
class Animal:
    """动物基类"""
    count = 0  # 类变量

    def __init__(self, name: str):
        self.name = name  # 实例变量
        Animal.count += 1

    def speak(self) -> str:
        return f"{self.name} makes a sound"

    @classmethod
    def total(cls) -> int:
        return cls.count

    @staticmethod
    def info() -> str:
        return "这是一个动物类"

class Dog(Animal):
    def __init__(self, name: str, breed: str):
        super().__init__(name)
        self.breed = breed

    def speak(self) -> str:  # 多态
        return "Woof!"

# 使用
dog = Dog("旺财", "金毛")
dog.speak()           # 'Woof!'
Animal.total()        # 1

# 特殊方法
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)
```

## 模块与包

```python
# 导入
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
import json
import math
import random

# 自定义模块
# my_module.py
# def hello(): print("Hello")
# from my_module import hello
```

## 文件操作

```python
# 读取
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()           # 全部
    lines = f.readlines()        # 列表
    for line in f:               # 逐行（内存友好）
        print(line)

# 写入
with open("output.txt", "w") as f:
    f.write("Hello\n")
    f.writelines(["line1\n", "line2\n"])

# 路径操作
from pathlib import Path
p = Path("data/file.txt")
p.parent        # Path('data')
p.stem          # 'file'
p.suffix        # '.txt'
p.exists()      # True/False
p.mkdir(parents=True, exist_ok=True)
```

## 常用标准库

```python
import os
os.getcwd()              # 当前目录
os.listdir(".")          # 列出文件
os.environ.get("HOME")   # 环境变量

import json
json.dumps(data)         # Python → JSON 字符串
json.loads(string)       # JSON 字符串 → Python
json.dump(data, f)       # 写入文件
json.load(f)             # 读取文件

import re
re.search(r"\d+", text)  # 搜索
re.findall(r"\w+", text) # 查找所有
re.sub(r"\s+", " ", s)   # 替换

import csv
with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"])

from collections import Counter, defaultdict, deque
Counter("hello")          # {'l': 2, 'h': 1, 'e': 1, 'o': 1}
d = defaultdict(list)     # 访问不存在的键自动创建空列表
queue = deque([1,2,3])    # 双端队列

import itertools
itertools.chain(a, b)     # 合并迭代
itertools.cycle("AB")     # A B A B ...
itertools.product([1,2], [3,4])  # 笛卡尔积
```

## 错误处理

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"除数不能为零: {e}")
except (ValueError, TypeError):
    print("类型错误")
else:
    print("无异常时执行")
finally:
    print("始终执行")

# 主动抛出
if age < 0:
    raise ValueError("年龄不能为负数")

# 自定义异常
class InsufficientFunds(Exception):
    pass
```

## 虚拟环境与依赖

```sh
# 创建虚拟环境
python -m venv .venv

# 激活
source .venv/bin/activate

# 安装依赖
pip install flask requests pandas

# 导出依赖
pip freeze > requirements.txt

# 安装项目依赖
pip install -r requirements.txt
```

## 性能与风格

1. **遵循 PEP 8**：使用 4 空格缩进，行宽 79 字符
2. **使用类型提示**：提升代码可读性和 IDE 支持
3. **优先使用推导式**：列表/字典推导式比循环更快
4. **使用 `with` 语句**：自动管理资源（文件、锁）
5. **用 `is None` 而非 `== None`**
6. **用 `isinstance` 而非 `type()`**
7. **避免可变默认参数**：用 `None` 替代
   ```python
   def bad(items=[]): ...     # 错误
   def good(items=None): ...  # 正确
   ```
8. **使用 `__slots__`**：节省大量简单对象的内存

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

---

# 企业级实践

## 项目结构

```sh
# 企业级 Python 项目标准结构
my-project/
├── src/
│   ├── my_project/           # 主包
│   │   ├── __init__.py
│   │   ├── main.py           # 入口
│   │   ├── config.py         # 配置
│   │   ├── api/              # API 层
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   ├── core/             # 核心业务
│   │   │   ├── domain.py
│   │   │   └── services.py
│   │   ├── infrastructure/   # 基础设施
│   │   │   ├── database.py
│   │   │   ├── cache.py
│   │   │   └── logging.py
│   │   └── models/           # 数据模型
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_api/
│   │   └── test_core/
│   ├── alembic/              # 数据库迁移
│   └── Dockerfile
├── pyproject.toml
├── .env.example
├── .pre-commit-config.yaml
└── Makefile
```

```toml
# pyproject.toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.110",
    "uvicorn[standard]>=0.29",
    "sqlalchemy>=2.0",
    "alembic>=1.13",
    "pydantic-settings>=2.0",
    "celery>=5.3",
    "redis>=5.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-cov>=5.0",
    "mypy>=1.9",
    "ruff>=0.3",
    "pre-commit>=3.6",
]

[tool.ruff]
line-length = 100
target-version = "py312"
[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]

[tool.mypy]
strict = true
ignore_missing_imports = true
```

## 配置管理

```python
# config.py — 使用 pydantic-settings
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # 应用
    app_name: str = "My API"
    debug: bool = False

    # 数据库
    database_url: str = "postgresql://localhost/mydb"
    database_pool_size: int = 10
    database_max_overflow: int = 20
    database_echo: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # 外部服务
    payment_api_key: str = ""
    payment_webhook_secret: str = ""

    # Celery
    celery_broker_url: str = "redis://localhost:6379/1"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

```sh
# .env（不上传到仓库）
DATABASE_URL=postgresql://user:password@prod-db:5432/mydb
PAYMENT_API_KEY=sk_live_xxx
```

## FastAPI 生产级应用

```python
# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from my_project.api import router
from my_project.config import get_settings
from my_project.infrastructure.database import engine, dispose_engine

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时
    logger.info("application.starting")
    yield
    # 关闭时
    await dispose_engine()
    logger.info("application.stopped")

app = FastAPI(
    title="My API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if not get_settings().debug else None,
    redoc_url=None,
)

# 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    structlog.contextvars.bind_contextvars(
        request_id=request.headers.get("x-request-id"),
        method=request.method,
        path=request.url.path,
    )
    response = await call_next(request)
    logger.info("request.completed", status_code=response.status_code)
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled_error")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "request_id": request.headers.get("x-request-id")},
    )

app.include_router(router, prefix="/api/v1")
```

### API 路由

```python
# api/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from my_project.core.services import UserService
from my_project.infrastructure.database import get_session
from my_project.api.schemas import UserCreate, UserRead, PaginatedResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=PaginatedResponse[UserRead])
async def list_users(
    page: int = 1,
    size: int = 20,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)
    users, total = await service.get_paginated(page=page, size=size)
    return PaginatedResponse(items=users, total=total, page=page, size=size)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    data: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    service = UserService(session)
    existing = await service.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=409, detail="邮箱已存在")
    return await service.create(data)
```

### Schema 定义

```python
# api/schemas.py
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Generic, TypeVar, Sequence

T = TypeVar("T")

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    created_at: datetime

class PaginatedResponse(BaseModel, Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    size: int
```

## 数据库（SQLAlchemy 2.0）

```python
# infrastructure/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from my_project.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.database_echo,
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
```

## Celery 任务队列

```python
# infrastructure/celery_app.py
from celery import Celery
from my_project.config import get_settings

settings = get_settings()

celery_app = Celery(
    "my_project",
    broker=settings.celery_broker_url,
    backend=settings.redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Shanghai",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,          # 任务完成后才确认
    worker_prefetch_multiplier=1, # 一次只取一个任务
    task_soft_time_limit=300,     # 5 分钟超时
    task_time_limit=330,
)

@celery_app.task(bind=True, max_retries=3)
def send_email(self, to: str, subject: str, body: str):
    try:
        mail_client.send(to, subject, body)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

# 周期性任务
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(3600.0, cleanup_expired_tokens.s(), name="每小時清理")
```

## 日志系统

```python
# infrastructure/logging.py
import structlog
import logging

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

# 生产环境使用 JSON 格式
if not settings.debug:
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.filter_by_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
    )
```

## 测试策略

```python
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from my_project.main import app
from my_project.infrastructure.database import Base, get_session

@pytest.fixture(scope="session")
def event_loop():
    import asyncio
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture
async def db_session():
    engine = create_async_engine("sqlite+aiosqlite:///test.db")
    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_session():
        yield db_session
    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

# tests/test_api/test_users.py
@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post("/api/v1/users/", json={
        "name": "Test User",
        "email": "test@example.com",
        "age": 25,
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert "id" in data

@pytest.mark.asyncio
async def test_duplicate_email(client):
    await client.post("/api/v1/users/", json={
        "name": "First", "email": "dup@example.com", "age": 20,
    })
    response = await client.post("/api/v1/users/", json={
        "name": "Second", "email": "dup@example.com", "age": 30,
    })
    assert response.status_code == 409
```

## Docker 多阶段构建

```dockerfile
# 构建阶段
FROM python:3.12-slim AS builder
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir . && \
    pip install --no-cache-dir uvicorn gunicorn

# 运行阶段
FROM python:3.12-slim
WORKDIR /app
RUN groupadd -r app && useradd -r -g app app

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY src/ ./src/

USER app
EXPOSE 8000
CMD ["gunicorn", "my_project.main:app", "--worker-class", "uvicorn.workers.UvicornWorker", "--workers", "4", "--bind", "0.0.0.0:8000", "--access-logfile", "-"]
```

## 性能分析

```python
import cProfile
import pstats
from pyinstrument import Profiler

# 使用 pyinstrument 进行采样分析
@app.middleware("http")
async def profile_request(request: Request, call_next):
    if request.headers.get("x-profile"):
        profiler = Profiler()
        profiler.start()
        response = await call_next(request)
        profiler.stop()
        profiler.print()
        return response
    return await call_next(request)

# 内存分析
from memory_profiler import profile

@profile
def heavy_function():
    data = [i for i in range(1000000)]
    return sum(data)
```

---

## 生态全景

### Web 框架选型

```python
# FastAPI —— 异步、类型安全、自动 OpenAPI（推荐）
from fastapi import FastAPI
app = FastAPI()

@app.get("/users")
async def get_users():
    return [{"id": 1, "name": "Alice"}]

# Django —— 全功能、内置 ORM + Admin
# django-admin startproject mysite
# python manage.py runserver

# Flask —— 轻量、灵活
from flask import Flask
app = Flask(__name__)
```

| 框架 | 特点 | 适用 |
|------|------|------|
| **FastAPI** | 异步、Pydantic 验证、OpenAPI 自动生成 | API 服务、微服务 |
| **Django** | 全栈、ORM、Admin、生态完善 | 内容平台、后台 |
| **Flask** | 轻量、扩展灵活 | 小服务、原型 |
| **Litestar** | 类型安全、DI | 企业级 API |

### ORM 与数据库

```python
# SQLAlchemy 2.0 —— 企业级 ORM（推荐）
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Django ORM —— Django 内置
from django.db import models
class User(models.Model):
    name = models.CharField(max_length=100)

# Tortoise ORM —— 异步 ORM（FastAPI 配合）
from tortoise.models import Model
from tortoise import fields

# Alembic —— 数据库迁移
# alembic revision --autogenerate -m "add user"
# alembic upgrade head
```

### 任务队列与异步

```python
# Celery —— 分布式任务队列（推荐）
from celery import Celery
app = Celery('tasks', broker='redis://localhost')

@app.task
def send_email(to, subject):
    print(f"Sending to {to}: {subject}")

# Arq —— 轻量异步任务队列
from arq import create_pool
from arq.connections import RedisSettings

# Dramatiq —— 简单可靠的消息队列

# asyncio 生态
# httpx —— 异步 HTTP 客户端
# aiohttp —— 异步 Web 框架/客户端
# aiofiles —— 异步文件操作
# databases —— 异步数据库驱动
```

### 数据科学生态

```
数据处理: Pandas → Polars (更快)
科学计算: NumPy, SciPy
可视化: Matplotlib, Plotly, Seaborn
机器学习: scikit-learn, XGBoost, LightGBM
深度学习: PyTorch, TensorFlow
大模型: LangChain, LlamaIndex, Hugging Face
```

### 开发工具链

```sh
# 包管理器
pip         # 默认（Python 3.4+）
pipx        # 隔离安装 CLI 工具
uv          # Rust 编写，极速（推荐新项目）
poetry      # 依赖+虚拟环境管理
rye         # 一站式 Python 项目工具

# 代码质量
ruff         # 极速 Linter + Formatter（推荐替代 flake8 + isort + black）
mypy         # 静态类型检查
pyright      # Microsoft 的类型检查（VS Code 内置）
pre-commit   # Git hooks 自动化

# 测试
pytest       # 测试框架（推荐）
pytest-cov   # 覆盖率
hypothesis   # 属性测试
tox          # 多版本测试

# 构建
setuptools   # 传统打包
hatch        # 现代项目管理
flit         # 纯 Python 包发布
```

### 项目模板

```sh
# 现代 Python 项目初始化
mkdir myapp && cd myapp

# 使用 uv
uv init myapp
uv add fastapi uvicorn sqlalchemy alembic
uv add --dev pytest ruff mypy

# 使用 poetry
poetry new myapp
poetry add fastapi
poetry add --dev pytest
```

```toml
# pyproject.toml 完整配置
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```
```


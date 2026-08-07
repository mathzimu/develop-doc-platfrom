# Python 生态全景

## Web 框架选型

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

## ORM 与数据库

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

## 任务队列与异步

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

## 数据科学生态

```
数据处理: Pandas → Polars (更快)
科学计算: NumPy, SciPy
可视化: Matplotlib, Plotly, Seaborn
机器学习: scikit-learn, XGBoost, LightGBM
深度学习: PyTorch, TensorFlow
大模型: LangChain, LlamaIndex, Hugging Face
```

## 开发工具链

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

## 项目模板

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

## 官方文档入口

| 类别 | 入口 |
|------|------|
| 语言与标准库 | [官方文档（中文）](https://docs.python.org/zh-cn/3/) · [标准库](https://docs.python.org/3/library/index.html) · [PEP Index](https://peps.python.org/) |
| 打包分发 | [Python Packaging Guide](https://packaging.python.org/) · [PyPI](https://pypi.org/) |
| Web 框架 | [FastAPI](https://fastapi.tiangolo.com/zh/) · [Django](https://docs.djangoproject.com/zh-hans/stable/) · [Flask](https://flask.palletsprojects.com/) · [Litestar](https://litestar.dev/) |
| ORM/迁移 | [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) · [Tortoise ORM](https://tortoise.github.io/) · [Alembic](https://alembic.sqlalchemy.org/en/latest/) |
| 任务队列 | [Celery](https://docs.celeryq.dev/en/stable/) · [Arq](https://arq-docs.helpmanual.io/) · [Dramatiq](https://dramatiq.io/) |
| 数据科学 | [NumPy](https://numpy.org/doc/stable/) · [pandas](https://pandas.pydata.org/docs/) · [SciPy](https://scipy.org/doc/) · [SciKit-learn](https://scikit-learn.org/stable/) · [PyTorch](https://pytorch.org/docs/stable/index.html) |
| 工具链 | [pip](https://pip.pypa.io/en/stable/) · [uv](https://docs.astral.sh/uv/) · [Poetry](https://python-poetry.org/docs/) · [ruff](https://docs.astral.sh/ruff/) · [mypy](https://mypy.readthedocs.io/en/stable/) · [pytest](https://docs.pytest.org/en/stable/) |

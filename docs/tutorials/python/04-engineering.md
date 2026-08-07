# Python 工程实践

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
    sender.add_periodic_task(3600.0, cleanup_expired_tokens.s(), name="每小时清理")
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

## CI/CD

### GitHub Actions 工作流

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -e ".[dev]"
      - run: ruff check .
      - run: mypy src/
      - run: pytest --cov=src/ --cov-report=xml
      - uses: codecov/codecov-action@v4
```

该工作流在每次推送和 PR 时自动运行：代码风格检查（ruff）、类型检查（mypy）和测试（pytest）。矩阵构建确保代码在多个 Python 版本上兼容。

## 官方文档

| 主题 | 链接 |
|------|------|
| 项目配置 | [pyproject.toml / PEP 621](https://packaging.python.org/en/latest/specifications/pyproject-toml/) |
| Lint/Format | [Ruff](https://docs.astral.sh/ruff/) |
| 类型检查 | [mypy](https://mypy.readthedocs.io/en/stable/) · [pyright](https://github.com/microsoft/pyright) |
| 测试 | [pytest](https://docs.pytest.org/en/stable/) · [pytest-cov](https://pytest-cov.readthedocs.io/) |
| 迁移 | [Alembic](https://alembic.sqlalchemy.org/en/latest/) |
| 容器化 | [Docker 官方 Python 镜像](https://hub.docker.com/_/python) |
| CI/CD | [GitHub Actions](https://docs.github.com/zh/actions) · [Codecov](https://docs.codecov.com/docs) |

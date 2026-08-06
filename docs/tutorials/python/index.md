# Python 教程

Python 是一种易学、可读性强、功能强大的高级编程语言。广泛应用于 Web 开发、数据科学、人工智能、自动化脚本等领域。

## 环境要求

- Python 3.10+
- pip（包管理器）
- 任意文本编辑器或 IDE（推荐 VS Code / PyCharm）

## 前置知识

- 基础的计算机操作能力
- 了解命令行基本使用
- 无需编程经验（零基础友好）

## 内容目录

- [基础语法](/tutorials/python/01-basics) — 变量、数据类型、控制流、函数、面向对象、标准库
- [进阶深入](/tutorials/python/02-advanced) — 装饰器、生成器、异步编程、元类、设计模式、性能优化
- [实战项目](/tutorials/python/03-project) — 文件搜索 CLI 工具
- [工程实践](/tutorials/python/04-engineering) — 项目结构、配置管理、测试、CI/CD、Docker
- [生态全景](/tutorials/python/05-ecosystem) — 框架选型、ORM、任务队列、开发工具

## 学习建议

- 按顺序学习，基础语法 → 进阶 → 项目 → 工程
- 动手实践每个代码示例
- 完成实战项目以巩固知识

## 快速开始

```sh
python --version
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## 官方文档

标准库签名、语言语义、打包规范以下列一手文档为准。

| 类型 | 链接 |
|------|------|
| 官方文档（中文） | [docs.python.org/zh-cn/3](https://docs.python.org/zh-cn/3/) |
| 标准库 | [Standard Library](https://docs.python.org/3/library/index.html) |
| 语言参考 | [Language Reference](https://docs.python.org/3/reference/index.html) |
| 类型注解 | [typing 模块](https://docs.python.org/3/library/typing.html) · [mypy](https://mypy.readthedocs.io/en/stable/) |
| 异步 | [asyncio](https://docs.python.org/3/library/asyncio.html) |
| 增强提案 | [PEP Index](https://peps.python.org/) · [PEP 8 代码风格](https://peps.python.org/pep-0008/) |
| 打包与分发 | [Python Packaging Guide](https://packaging.python.org/) · [PyPI](https://pypi.org/) |
| 环境与依赖 | [pip](https://pip.pypa.io/en/stable/) · [venv](https://docs.python.org/3/library/venv.html) · [uv](https://docs.astral.sh/uv/) · [Poetry](https://python-poetry.org/docs/) |
| 质量工具 | [Ruff](https://docs.astral.sh/ruff/) · [pytest](https://docs.pytest.org/en/stable/) |
| Web 框架 | [Django](https://docs.djangoproject.com/zh-hans/stable/) · [FastAPI](https://fastapi.tiangolo.com/zh/) · [Flask](https://flask.palletsprojects.com/) |
| ORM 与数据库 | [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) · [Alembic](https://alembic.sqlalchemy.org/en/latest/) |
| 任务队列 | [Celery](https://docs.celeryq.dev/en/stable/) · [RQ](https://python-rq.org/docs/) |
| 数据与 AI | [NumPy](https://numpy.org/doc/stable/) · [pandas](https://pandas.pydata.org/docs/) · [PyTorch](https://pytorch.org/docs/stable/index.html) |
| 版本支持周期 | [Python 版本状态](https://devguide.python.org/versions/) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

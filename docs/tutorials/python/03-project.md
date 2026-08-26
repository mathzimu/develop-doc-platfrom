# 实战项目：文件搜索 CLI 工具

## 项目需求

构建一个命令行文件搜索工具，支持：
- 递归搜索指定目录
- 按文件名模式匹配（支持通配符）
- 按文件内容匹配（搜索文本）
- 彩色的格式化输出
- 排除指定目录
- 限定文件扩展名
- 搜索结果显示行号和文件路径

## 项目结构

```
file-search/
├── search.py          # 主入口
├── searcher.py        # 搜索核心逻辑
├── formatter.py       # 输出格式化
└── requirements.txt   # 依赖
```

## Step-by-Step 实现

### 1. CLI 参数解析

```python
# search.py
import argparse

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="文件搜索工具 — 支持文件名和内容匹配",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("path", help="搜索目录路径")
    parser.add_argument("pattern", help="搜索模式（文件名或内容）")
    parser.add_argument("--type", choices=["name", "content"], default="name",
                        help="搜索类型：按文件名或文件内容")
    parser.add_argument("--exclude", nargs="*", default=[".git", "__pycache__"],
                        help="排除的目录名")
    parser.add_argument("--ext", nargs="*", default=[],
                        help="限定文件扩展名，如 .py .md")
    parser.add_argument("--no-color", action="store_true",
                        help="禁用彩色输出")
    return parser.parse_args()
```

### 2. 递归文件搜索

```python
# searcher.py
from pathlib import Path
from typing import Generator

def walk_directory(root: Path, exclude: list[str], exts: list[str]) -> Generator[Path, None, None]:
    """递归遍历目录，跳过排除目录并可选限定扩展名"""
    for item in root.iterdir():
        if item.name in exclude:
            continue
        if item.is_dir():
            yield from walk_directory(item, exclude, exts)
        elif not exts or item.suffix in exts:
            yield item
```

### 3. 文件名/内容模式匹配

```python
import fnmatch
import re

def search_by_name(filepath: Path, pattern: str) -> list[tuple[int, str]]:
    """按文件名模式匹配"""
    if fnmatch.fnmatch(filepath.name, pattern):
        return [(0, str(filepath))]
    return []

def search_by_content(filepath: Path, pattern: str) -> list[tuple[int, str]]:
    """按文件内容搜索，返回 (行号, 行内容) 列表"""
    matches: list[tuple[int, str]] = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            for line_no, line in enumerate(f, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    matches.append((line_no, line.rstrip()))
    except (PermissionError, IsADirectoryError, UnicodeDecodeError):
        pass
    return matches
```

### 4. 结果格式化输出

```python
# formatter.py
from pathlib import Path

def format_results(path: Path, matches: list[tuple[int, str]]) -> str:
    """格式化搜索结果"""
    lines = [f"📄 {path}"]
    for line_no, content in matches:
        lines.append(f"  {line_no:4d} | {content}")
    return "\n".join(lines)
```

### 5. 添加颜色输出

```python
# formatter.py（续）
import sys

class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

def colorize(text: str, color: str, bold: bool = False) -> str:
    if not sys.stdout.isatty():
        return text
    prefix = color + (Colors.BOLD if bold else "")
    return f"{prefix}{text}{Colors.RESET}"

def format_colored(path: Path, matches: list[tuple[int, str]]) -> str:
    """带颜色的格式化输出"""
    lines = [colorize(f"📄 {path}", Colors.BLUE, bold=True)]
    for line_no, content in matches:
        line = f"  {colorize(str(line_no), Colors.YELLOW):>4s} | {content}"
        lines.append(line)
    return "\n".join(lines)
```

### 6. 整合完整代码

```python
# search.py（完整版）
import argparse
from pathlib import Path
import sys

from searcher import walk_directory, search_by_name, search_by_content
from formatter import format_colored, colorize, Colors

def parse_args():
    parser = argparse.ArgumentParser(
        description="文件搜索工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("path", help="搜索目录路径")
    parser.add_argument("pattern", help="搜索模式")
    parser.add_argument("--type", choices=["name", "content"], default="name",
                        help="搜索类型")
    parser.add_argument("--exclude", nargs="*", default=[".git", "__pycache__", "node_modules"],
                        help="排除的目录名")
    parser.add_argument("--ext", nargs="*", default=[],
                        help="限定扩展名，如 .py .md")
    parser.add_argument("--no-color", action="store_true",
                        help="禁用彩色输出")
    return parser.parse_args()

def main():
    args = parse_args()
    root = Path(args.path).resolve()

    if not root.exists():
        print(f"错误：目录不存在 {root}", file=sys.stderr)
        sys.exit(1)

    if args.ext:
        args.ext = [f".{ext.lstrip('.')}" for ext in args.ext]

    total_files = 0
    total_matches = 0

    search_fn = search_by_name if args.type == "name" else search_by_content
    fmt_fn = format_colored if not args.no_color else format_results

    for filepath in walk_directory(root, args.exclude, args.ext):
        matches = search_fn(filepath, args.pattern)
        if matches:
            print(fmt_fn(filepath, matches))
            total_files += 1
            total_matches += len(matches)

    summary = f"\n找到 {total_files} 个文件，共 {total_matches} 处匹配"
    if args.no_color:
        print(summary)
    else:
        print(colorize(summary, Colors.GREEN, bold=True))

if __name__ == "__main__":
    main()
```

## 运行示例

```sh
# 按文件名搜索
python search.py /path/to/project "*.py"

# 按内容搜索
python search.py --type content /path/to/project "def main"

# 排除目录
python search.py . "config" --exclude .git __pycache__ node_modules

# 限定扩展名
python search.py . "import" --type content --ext .py

# 搜索 TODO/FIXME 标记
python search.py . "TODO|FIXME" --type content --ext .py .md
```

## 扩展思路

1. **正则表达式高亮**：在匹配行中高亮显示匹配部分
2. **并行搜索**：使用 `concurrent.futures` 或 `asyncio` 加速大目录搜索
3. **输出到文件**：添加 `--output` 参数将结果保存到文件
4. **大小写敏感开关**：添加 `--case-sensitive` 选项
5. **最大深度限制**：添加 `--max-depth` 参数限制递归深度
6. **结果去重**：软链接和硬链接的去重处理
7. **交互模式**：基于 `prompt_toolkit` 的交互式搜索
8. **配置文件**：支持 `.searchconfig` 配置默认排除规则

## 官方文档与延伸阅读

实战项目用到的标准库与工具的一手文档：

- **命令行**：[argparse](https://docs.python.org/3/library/argparse.html) · [pathlib](https://docs.python.org/3/library/pathlib.html) · [os](https://docs.python.org/3/library/os.html) · [fnmatch](https://docs.python.org/3/library/fnmatch.html) · [re](https://docs.python.org/3/library/re.html)
- **错误与异常**：[Built-in Exceptions](https://docs.python.org/3/library/exceptions.html) · [errno](https://docs.python.org/3/library/errno.html)
- **进阶 CLI**：[click](https://click.palletsprojects.com/) · [typer](https://typer.tiangolo.com/) · [prompt_toolkit](https://python-prompt-toolkit.readthedocs.io/)
- **并发加速**：[concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html) · [asyncio](https://docs.python.org/3/library/asyncio.html)
- **测试**：[pytest](https://docs.pytest.org/en/stable/)
- **打包发布**：[Python Packaging Guide](https://packaging.python.org/) · [PyPI](https://pypi.org/)

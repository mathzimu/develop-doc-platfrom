# Bash 教程

Bash（Bourne Again Shell）是 Linux 和 macOS 上使用最广泛的命令行 Shell，也是编写自动化脚本的首选语言。

## 目录

- **[01 - Bash 基础语法](/tutorials/bash/01-basics)** — 文件操作、查看文件、查找、权限、进程管理、网络、变量、字符串、控制流、函数、I/O、常用技巧
- **[02 - Bash 进阶深入](/tutorials/bash/02-advanced)** — 正则表达式、数组、进程替换、命名管道、信号处理、并行执行、调试技巧、安全编程、性能优化
- **[03 - 实战项目：日志分析脚本](/tutorials/bash/03-project)** — 参数解析、日志读取、统计级别、错误堆栈提取、时间聚合、报告输出、定时执行
- **[04 - Bash 工程实践](/tutorials/bash/04-engineering)** — 脚本规范、CI/CD 集成、运维脚本、监控健康检查、日志轮转、部署流水线
- **[05 - Bash 生态全景](/tutorials/bash/05-ecosystem)** — 替代 Shell、现代 CLI 工具、测试工具、任务编排、配置管理工具

## 快速开始

```bash
#!/bin/bash
echo "Hello, Bash World!"
```

## 环境要求

- **任何 Unix-like 环境**：Linux、macOS、WSL（Windows Subsystem for Linux）
- Bash 4.x+（macOS 自带 3.2，建议 `brew install bash` 升级）
- 不建议在 Windows 原生 cmd/PowerShell 下学习（脚本兼容性差）

## 前置知识

- 无需编程经验
- 熟悉终端基本操作即可

## 官方文档与延伸阅读

- **官方手册**：[GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- **POSIX Shell 规范**：[POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- **编码规范**：[Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- **静态检查与格式化**：[ShellCheck](https://www.shellcheck.net/) · [shfmt](https://github.com/mvdan/sh)
- **测试框架**：[Bats-core](https://bats-core.readthedocs.io/en/stable/)

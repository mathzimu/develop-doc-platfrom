# Bash 生态全景

## 替代 Shell

| Shell | 特点 | 适用场景 |
|-------|------|----------|
| **Zsh** | 更强大的补全、主题系统（oh-my-zsh）、拼写修正、全局别名 | 日常交互使用 |
| **Fish** | 开箱即用、语法高亮、自动建议、Web 配置界面 | 新手友好、交互体验优先 |
| **Dash** | 极致轻量（Debian /bin/sh）、POSIX 兼容 | 容器镜像、嵌入式系统 |

## 现代 CLI 工具（替代传统命令）

| 工具 | 替代 | 功能 |
|------|------|------|
| **jq** | — | JSON 命令行处理器（`jq '.users[].name' data.json`） |
| **yq** | — | YAML/TOML/XML 处理器（类似 jq 语法） |
| **ripgrep (rg)** | `grep` | 极速递归搜索，默认忽略 .gitignore |
| **fd** | `find` | 更快、更友好的文件查找 |
| **bat** | `cat` | 带语法高亮、行号、Git 变更标记 |
| **htop** | `top` | 交互式进程查看（树形、鼠标操作） |
| **tmux** | `screen` | 终端复用器（分屏、会话保持） |
| **fzf** | — | 模糊搜索（文件、历史、进程） |
| **delta** | `diff` | Git diff 增强（语法高亮、行内差异） |
| **duf** | `df` | 磁盘使用情况（彩色、树形） |
| **dog** | `dig` | DNS 查询（更友好的输出） |
| **httpie** | `curl` | HTTP 客户端（JSON 高亮、简洁语法） |

## 测试与代码质量

| 工具 | 用途 | 示例 |
|------|------|------|
| **bats** | Bash 单元测试框架 | `bats test_script.bats` |
| **shellcheck** | Shell 脚本静态分析 | `shellcheck script.sh` |
| **shfmt** | Shell 格式化 | `shfmt -w script.sh` |
| **bashate** | 代码风格检查 | `bashate script.sh` |

```bash
# shellcheck 示例 — 检测常见问题
# 安装: brew install shellcheck
shellcheck myscript.sh

# 常见检查项:
# 1. 未使用双引号的变量
# 2. 可移植性问题（#!/bin/bash vs #!/bin/sh）
# 3. 废弃语法（`cmd` vs $(cmd)）
# 4. 可能的逻辑错误
```

## 任务编排

| 工具 | 描述 | 适用场景 |
|------|------|----------|
| **Makefile** | 最广泛的任务运行器 | 构建、测试、部署流水线 |
| **Just** | 更简洁的 Makefile 替代 | 命令集合、项目本地任务 |
| **Task** | YAML 定义的任务运行器 | 复杂工作流、跨平台 |

```makefile
# Makefile 示例
.PHONY: test lint deploy

test:
	bats tests/

lint:
	shellcheck bin/*.sh

deploy: lint test
	./bin/deploy.sh --env production
```

## 配置管理

| 工具 | 描述 | 适用场景 |
|------|------|----------|
| **Ansible** | 基于 SSH 的配置管理（YAML + Jinja2） | 服务器批量配置、应用部署 |
| **SaltStack** | 远程执行 + 配置管理（Python） | 大规模基础设施管理 |
| **Terraform** | 基础设施即代码（声明式） | 云资源编排（叠加 Bash provisioner） |

## 学习资源

- [GNU Bash 官方手册](https://www.gnu.org/software/bash/manual/)
- [shellcheck](https://www.shellcheck.net/) — 在线 Shell 检查
- [bash-guide](https://github.com/Idnan/bash-guide) — Bash 速查
- [pure-bash-bible](https://github.com/dylanaraps/pure-bash-bible) — 纯 Bash 实现合集
- [explainshell](https://explainshell.com/) — 逐段解释 Shell 命令

## 官方文档与延伸阅读

- **官方手册**：[GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html) · [GNU Bash 官方手册（概览）](https://www.gnu.org/software/bash/manual/)
- **POSIX Shell 规范**：[POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- **编码规范**：[Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- **静态检查与格式化**：[ShellCheck](https://www.shellcheck.net/) · [shfmt](https://github.com/mvdan/sh) · [Bats-core](https://bats-core.readthedocs.io/en/stable/)
- **GNU 核心工具**：[Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- **现代 CLI 工具**：[jq](https://jqlang.github.io/jq/) · [yq](https://mikefarah.gitbook.io/yq) · [ripgrep](https://github.com/BurntSushi/ripgrep) · [fd](https://github.com/sharkdp/fd) · [bat](https://github.com/sharkdp/bat) · [fzf](https://github.com/junegunn/fzf) · [httpie](https://httpie.io/docs/cli)
- **任务与配置管理**：[Ansible](https://docs.ansible.com/) · [Terraform](https://developer.hashicorp.com/terraform/docs)
- **学习资源**：[bash-guide](https://github.com/Idnan/bash-guide) · [pure-bash-bible](https://github.com/dylanaraps/pure-bash-bible) · [explainshell](https://explainshell.com/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

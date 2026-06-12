# Git 进阶深入

## 内部原理

### 对象存储

Git 是一个内容寻址文件系统，核心存储四种对象：

```
类型        存储内容                       示例
──────      ──────────────────────────     ──────────────────────
blob        文件内容                        e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
tree        目录结构（文件名、权限、blob引用） 4c3b5c7e9f5a5c5d5b5a5c5d5e5f5a5b5c5d5e5f
commit      快照（tree、parent、author、message） 5a5b5c5d5e5f5a5b5c5d5e5f5a5b5c5d5e5f5a5b
tag         附注标签（object、type、tag、tagger） 6a6b6c6d6e6f6a6b6c6d6e6f6a6b6c6d6e6f6a6b
```

```sh
# 查看对象类型
git cat-file -t <hash>
# 查看对象内容
git cat-file -p <hash>

# 查看文件对应的 blob hash
git hash-object file.txt

# .git 目录结构
.git/
├── objects/       # 对象数据库（blob/tree/commit/tag）
│   ├── 01/        # 前缀目录（前2位）
│   ├── info/
│   └── pack/      # 打包文件（packfile 压缩存储）
├── refs/          # 引用
│   ├── heads/     # 本地分支
│   ├── remotes/   # 远程分支
│   └── tags/      # 标签
├── HEAD           # 当前引用指针
├── config         # 仓库配置
├── index          # 暂存区
└── logs/          # 操作日志（reflog）
```

### HEAD 与引用

```sh
# HEAD 指向当前分支
cat .git/HEAD           # ref: refs/heads/main

# 查看分支指向的提交
git rev-parse HEAD
git rev-parse main
git rev-parse v1.0.0

# 相对引用
HEAD~1    # 父提交
HEAD~2    # 祖父提交
HEAD^     # 父提交（等同于 HEAD~1）
HEAD^2    # 合并提交的第二个父提交
```

### Packfile 压缩

```sh
# 手动清理和优化仓库
git gc                    # 垃圾回收，压缩对象
git gc --aggressive       # 更激进的压缩（耗时）
git count-objects -v      # 查看对象数量和大小
git verify-pack .git/objects/pack/*.idx  # 查看打包内容
```

## Rebase 深入

### 交互式变基技巧

```sh
# 整理最近的提交
git rebase -i HEAD~5

# 修改历史提交的提交者信息
git rebase -i HEAD~5
# 将需要修改的提交标记为 edit，然后：
git commit --amend --author="New Author <email>"
git rebase --continue
```

### Auto-squash & Fixup

```sh
# 自动将 fixup! 提交合并到目标提交
git commit --fixup <commit-hash>     # 创建 fixup! 提交
git commit --squash <commit-hash>    # 创建 squash! 提交

# 一键合并所有 fixup/squash 提交
git rebase -i --autosquash HEAD~10
# 简化（假设 git config --global alias.fixup "rebase -i --autosquash"）
git fixup HEAD~10
```

### Rebase --onto

```sh
# 将 feature 分支基于 topic 而不是 main
# 场景：feature 从 main 拉出，但需要改为基于 topic
# before:  main → topic → feature
# after:   main → topic → feature'（基于 topic）
git rebase --onto topic main feature

# 从分支中提取部分提交到另一个分支
git checkout master
git rebase --onto master topic-branch feature-branch
```

## Cherry-pick 高级用法

```sh
# 挑选连续提交
git cherry-pick A..B                  # A+1 到 B 的所有提交
git cherry-pick A^..B                 # A 到 B 的所有提交（包含 A）

# 处理冲突
git cherry-pick <hash>
# 冲突解决后
git cherry-pick --continue
# 或跳过
git cherry-pick --skip
# 或取消
git cherry-pick --abort

# 保留原始提交者信息
git cherry-pick -x <hash>             # 自动添加 "(cherry picked from commit ...)"

# 应用到多个分支
git checkout release/v1 && git cherry-pick <hash>
git checkout release/v2 && git cherry-pick <hash>
```

## Reflog 数据恢复

```sh
# reflog 记录 HEAD 的所有移动（本地日志，过期自动清理）
git reflog                     # 查看 HEAD 移动历史
git reflog main                # 查看 main 分支的移动历史
git reflog --date=iso          # 显示 ISO 格式日期

# 恢复丢失的提交
git reflog                     # 找到丢失的 commit hash
git checkout -b recovery <hash>  # 创建分支指向该提交
git reset --hard HEAD@{2}      # 恢复到 reflog 中的位置

# 恢复被删除的分支
git reflog                     # 找到分支最后一次的 commit
git branch recovered-branch <hash>

# reflog 保留期限
git config gc.reflogExpire "90 days"       # 未引用的 reflog 保留 90 天
git config gc.reflogExpireUnreachable "30 days"
```

## Submodule vs Subtree

### Submodule（子模块）

```sh
# 添加子模块
git submodule add https://github.com/user/lib.git libs/lib
git submodule init
git submodule update

# 克隆包含子模块的仓库
git clone --recurse-submodules <url>

# 更新子模块
git submodule update --remote --merge

# 子模块的注意事项
# 子模块默认处于 detached HEAD 状态
# 需要单独进入子模块目录进行修改和提交
```

### Subtree（子树合并）

```sh
# 添加子树
git subtree add --prefix=libs/lib https://github.com/user/lib.git main --squash

# 拉取子树更新
git subtree pull --prefix=libs/lib https://github.com/user/lib.git main

# 推送子树修改回上游
git subtree push --prefix=libs/lib origin lib-main

# 分离子目录到独立仓库
git subtree push --prefix=packages/shared origin shared-main
```

| 特性 | Submodule | Subtree |
|------|-----------|---------|
| 仓库克隆 | 需要额外 `--recurse-submodules` | 全量代码，无需额外操作 |
| 修改流程 | 需进入子目录单独操作 | 在父仓库中直接操作 |
| 版本记录 | 记录指针 commit | 嵌入实际代码到父仓库历史 |
| 学习曲线 | 中等（多命令） | 较低 |

## Filter-branch vs Filter-repo

> **推荐使用 `git filter-repo`**：官方已不推荐 `filter-branch`，改用 `git filter-repo`。

```sh
# 安装 filter-repo（需要单独安装）
pip install git-filter-repo

# 删除所有历史中的敏感文件
git filter-repo --path config/credentials.json --invert-paths

# 只保留特定目录（将子目录变为新仓库根目录）
git filter-repo --path src/ --path tests/

# 替换作者信息
git filter-repo --name-callback 'return name.replace(b"Old", b"New")'

# filter-branch（旧版，速度慢）
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch config/credentials.json' \
  --prune-empty -- --all
```

## Worktree（并行工作）

```sh
# 创建新的工作目录关联到同一仓库
git worktree add ../feature-login feature/login
git worktree add -b hotfix/critical ../hotfix-fix main

# 每个 worktree 有独立的工作区和暂存区
# 共享 objects 和 refs

# 查看 worktree
git worktree list

# 清理已删除分支的 worktree
git worktree prune

# 移除 worktree
git worktree remove ../feature-login

# 应用场景
# - 同时维护多个分支（hotfix + 日常开发）
# - 并行代码审查
# - 无需 stash，直接在独立目录切换
```

## Git 性能优化

### 部分克隆（Partial Clone）

```sh
# 按需获取对象，只有需要时才下载大文件
git clone --filter=blob:none <url>       # 不下载 blob（默认下载）
git clone --filter=tree:0 <url>          # 不下载 tree（更轻量）
git clone --filter=blob:limit=1m <url>   # 跳过 >1MB 的 blob

# 浅克隆 + 部分克隆
git clone --depth=1 --filter=blob:none <url>
```

### 稀疏检出（Sparse Checkout）

```sh
# 只检出仓库中的部分目录（适合 monorepo）
git sparse-checkout init --cone
git sparse-checkout set packages/api packages/web
git sparse-checkout add docs

# 查看当前稀疏模式
git sparse-checkout list

# 禁用稀疏检出
git sparse-checkout disable
```

### 其他优化

```sh
# 增量压缩
git repack -adf     # 重新打包，优化存储
git prune           # 清理孤立对象

# 配置优化
git config core.preloadIndex true     # 加速索引加载
git config core.fscache true          # 文件系统缓存（Windows）
git config fetch.prune true           # fetch 时自动清理远程引用
git config gc.auto 256                # 自动 GC 阈值
```

## Git 高级调试

### Bisect Run 自动二分

```sh
# 编写测试脚本（exit 0 = good, exit 1 = bad）
cat > test-bug.sh << 'EOF'
#!/bin/bash
npm run test -- --grep "broken test" 2>/dev/null
EOF
chmod +x test-bug.sh

# 自动执行二分查找
git bisect start HEAD v1.0
git bisect run ./test-bug.sh

# bisect 运行流程
# 1. Git 切换到中间提交
# 2. 运行 test-bug.sh
# 3. exit 0 → git bisect good → 切换右半区间
# 4. exit 1 → git bisect bad → 切换左半区间
# 5. 重复直到找到首个坏提交
```

### Blame Ignore

```sh
# 查看每行代码的最后修改作者
git blame file.txt

# 忽略空白修改
git blame -w file.txt

# 忽略特定提交（如大规模格式化重构）
git blame --ignore-rev <refactor-commit-hash> file.txt

# 持久化忽略列表
echo "<refactor-commit-hash>" > .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### 调试工具

```sh
# 追踪文件每一次修改
git log -p --follow file.txt

# 找出所有修改了某行的方法
git log -L 10,20:file.txt     # 显示某文件的第 10-20 行历史

# grep 在提交历史中搜索
git grep "TODO" HEAD~10       # 在历史版本中搜索
git log -S "deprecatedFunc" --source --all  # 查找某函数何时被引入/删除
```

# Git 基础语法

Git 是目前最流行的分布式版本控制系统，用于跟踪文件的变更历史，支持多人协作开发。

## 基础概念

```
工作区              暂存区              本地仓库            远程仓库
(Workspace)    →   (Index/Stage)  →   (Local Repo)   →   (Remote Repo)
   │                  │                  │                   │
git add <file>    git commit          git push
                   ←  git reset        ←  git pull
                                        ←  git clone
```

::: tip 关键记忆点
- Git 维护**三个区域**：工作区（你编辑的文件）→ 暂存区（待提交快照）→ 本地仓库（已提交历史）。`add` 把改动搬进暂存区，`commit` 把暂存区固化为一次提交。
- **几乎任何误操作都可恢复**：`reset`/`restore` 只移动指针，Git 的「悬空提交」在 `reflog` 中可找回（默认保留 30 天），所以 `reset --hard` 前务必确认。
:::

## 初始配置

```sh
# 用户信息（首次使用必须设置）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 默认分支名
git config --global init.defaultBranch main

# 换行符处理
git config --global core.autocrlf input  # macOS/Linux

# 别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "restore --staged"

# 查看配置
git config --list
git config user.name

# 配置优先级：local < global < system
git config --local user.name "Project Specific"
git config --global user.name "Global Default"
git config --system user.name "System Default"
```

## 基本操作

### 创建仓库

```sh
# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git      # SSH
git clone --depth 1 <url>                   # 浅克隆（只取最新）
git clone --branch main --single-branch <url>  # 只克隆特定分支
```

### 添加与提交

```sh
# 查看状态
git status
git status -s          # 简略输出（M 修改, A 添加, D 删除, ? 未跟踪）

# 添加文件到暂存区
git add file.txt       # 添加单个文件
git add .              # 添加所有变更
git add -p             # 交互式分段添加（逐块确认）
git add -A             # 添加所有（包括删除）
git add src/           # 添加目录下所有文件

# 删除与移动
git rm file.txt        # 删除文件并记录到暂存区
git mv old.txt new.txt # 重命名文件并记录到暂存区
git clean -n           # 预览将被删除的未跟踪文件
git clean -fd          # 强制删除未跟踪的文件和目录

# 提交
git commit -m "提交说明"
git commit -am "说明"  # 跳过 git add（仅跟踪过的文件）
git commit --amend     # 修改上一次提交（信息或内容）
git commit --amend --no-edit  # 修改内容，不修改提交信息

# 查看提交历史
git log
git log --oneline
git log --oneline --graph --all
git log --author="name"
git log --since="2 weeks ago"
git log --until="2025-01-01"
git log --grep="fix"       # 按提交信息搜索
git log -S"functionName"   # 按代码内容搜索
git log -p                 # 显示每次提交的 diff
git log --stat             # 显示文件变更统计
git log --format="%h - %an, %ar : %s"  # 自定义格式
```

### 差异查看

```sh
git diff                    # 工作区 vs 暂存区
git diff --staged           # 暂存区 vs 最近提交
git diff HEAD               # 工作区 vs 最近提交
git diff commit1..commit2   # 两个提交之间的差异
git diff branch1 branch2    # 两个分支的差异
git diff --name-only        # 只显示文件名
git diff --stat             # 显示变更统计
git diff --word-diff        # 单词级别对比
```

## 分支管理

```sh
# 查看分支
git branch                 # 本地分支列表（* 标记当前分支）
git branch -r              # 远程分支
git branch -a              # 所有分支
git branch -v              # 显示最新提交
git branch --merged        # 已合并到当前分支的分支
git branch --no-merged     # 未合并的分支

# 创建与切换
git branch feature-a       # 创建分支
git checkout feature-a     # 切换分支
git switch feature-a       # 切换分支（新版）
git checkout -b feature-a  # 创建并切换
git switch -c feature-a    # 同上

# 重命名分支
git branch -m old new      # 重命名当前分支
git branch -m feature-a feature-b  # 重命名指定分支

# 合并分支
git merge feature-a        # 将 feature-a 合并到当前分支
git merge --no-ff feature-a       # 禁用快进合并（保留分支历史）
git merge --squash feature-a      # 压缩合并（将多个 commit 压成一个）

# 删除分支
git branch -d feature-a           # 删除已合并的分支
git branch -D feature-a           # 强制删除
git push origin --delete feature-a  # 删除远程分支
```

### 合并冲突解决

当两个分支修改了同一文件的同一区域时，Git 会产生冲突：

```sh
git merge feature-a
# CONFLICT in file.txt

# 冲突标记格式：
<<<<<<< HEAD
当前分支的内容
=======
合并分支的内容
>>>>>>> feature-a

# 手动编辑文件解决后：
git add file.txt
git merge --continue       # 或 git commit -m "解决冲突"
# 或取消合并
git merge --abort
```

冲突解决三路合并工具：

```sh
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
git mergetool              # 启动可视化合并工具
```

## 远程操作

```sh
# 管理远程仓库
git remote add origin <url>
git remote -v                        # 查看远程
git remote remove origin
git remote rename origin upstream
git remote set-url origin <new-url>

# 推送
git push origin main                 # 推送到远程
git push -u origin main              # 设置上游并推送
git push origin --all                # 推送所有分支
git push origin --tags               # 推送标签
git push origin :feature-a           # 删除远程分支（旧版语法）
git push --force                     # 强制推送（小心使用）
git push --force-with-lease          # 安全强制推送（检查远程状态）

# 拉取
git pull                            # fetch + merge
git pull --rebase                   # fetch + rebase（更整洁）
git fetch                           # 获取不合并
git fetch origin feature-a          # 获取远程分支

# 远程分支
git checkout -b local-name origin/remote-name
git fetch --prune                   # 清理已删除的远程分支引用
```

## 撤销操作

```sh
# 撤销工作区修改
git restore file.txt          # 丢弃工作区修改（新版推荐）
git checkout -- file.txt      # 旧版语法
git restore .                 # 丢弃所有工作区修改

# 撤销暂存区
git restore --staged file.txt # 从暂存区移回工作区
git reset HEAD file.txt       # 旧版语法

# 撤销提交
git reset --soft HEAD~1       # 撤销提交，保留工作区和暂存区
git reset --mixed HEAD~1      # 撤销提交，保留工作区，清空暂存区（默认）
git reset --hard HEAD~1       # 完全回退，丢弃所有修改（危险）

::: warning `reset --soft / --mixed / --hard` 的区别
- `--soft`：只把 HEAD 回退，所有改动**仍在暂存区**（像没 commit 过）。
- `--mixed`（默认）：HEAD 回退，改动回到**工作区未暂存**状态。
- `--hard`：**直接丢弃**目标提交之后的所有改动，不可恢复（除非有 reflog）。生产环境回退公开分支请用 `git revert` 而非 `reset --hard`。
:::

# 回退到指定版本
git reset --hard <commit-hash>

# 还原某次提交（创建反向提交）
git revert <commit-hash>       # 安全撤销，不修改历史
git revert --no-commit HEAD~3..HEAD  # 还原多个提交但不自动提交
```

## 标签

```sh
# 创建标签
git tag v1.0.0                        # 轻量标签
git tag -a v1.0.0 -m "版本1.0"        # 附注标签（推荐，含作者、日期、信息）
git tag -a v1.0.0 <commit-hash>       # 为历史提交打标签

# 查看标签
git tag
git tag -l "v1.*"
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push origin --tags

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## 储藏（Stash）

```sh
# 暂存当前工作区修改
git stash                      # 默认储藏
git stash push -m "正在修改登录逻辑"   # 带信息
git stash -u                   # 包含未跟踪文件
git stash -a                   # 包含所有文件（包括忽略文件）

# 恢复
git stash pop                  # 恢复并删除最近储藏
git stash apply                # 恢复但不删除
git stash apply stash@{2}      # 恢复指定储藏

# 管理
git stash list                 # 查看储藏列表
git stash show stash@{1}       # 查看指定储藏的详情
git stash show -p stash@{0}    # 查看储藏的 diff
git stash drop stash@{0}       # 删除指定储藏
git stash clear                # 清空所有储藏

# 从储藏创建分支
git stash branch new-feature stash@{0}
```

## 进阶操作

### Rebase

```sh
# 变基（线性化历史）
git checkout feature
git rebase main               # 将 feature 基于 main 的最新提交

# 交互式变基（整理提交历史）
git rebase -i HEAD~3          # 修改最近 3 个提交
git rebase -i main            # 基于 main 进行交互式变基

# 交互式命令：
# pick    - 使用该提交
# reword  - 修改提交信息
# squash  - 合并到上一个提交
# fixup   - 合并并丢弃信息
# edit    - 停止并修改
# drop    - 删除提交
# reword  - 修改提交信息

# 遇到冲突时
git rebase --continue        # 解决冲突后继续
git rebase --skip            # 跳过当前提交
git rebase --abort           # 取消变基
```

### Cherry-pick

```sh
# 挑选特定提交到当前分支
git cherry-pick <commit-hash>
git cherry-pick <hash1> <hash2>
git cherry-pick A..B          # 区间内的所有提交
git cherry-pick -n <hash>     # 只应用到工作区，不自动提交
git cherry-pick --signoff     # 添加 Signed-off-by 签名
```

### Bisect（二分查找）

```sh
# 二分查找引入 bug 的提交
git bisect start
git bisect bad                # 当前版本有 bug
git bisect good v1.0          # v1.0 是好的
# Git 会切换到中间提交，测试后标记
git bisect good               # 或 git bisect bad
# 重复直到找到首个坏提交
git bisect reset              # 结束

# 使用脚本自动执行
git bisect start HEAD v1.0
git bisect run npm test       # 自动运行测试，直到找到故障提交
```

## .gitignore

```conf
# 创建 .gitignore 文件
/node_modules
.env
*.log
dist/
.DS_Store
.idea/
*.pyc
__pycache__/
.env.local
.env.*.local
*.swp
*.swo
```

```sh
# 全局忽略（所有仓库生效）
git config --global core.excludesFile ~/.gitignore_global

# 查看某文件为何被忽略
git check-ignore -v file.txt

# 强制跟踪已被忽略的文件
git add -f ignored-file.log
```

## Git 工作流程

### 集中式工作流

```sh
main  ←── 所有开发者直接提交到 main
```

### Feature Branch 工作流

```sh
main
  └── feature/login
  └── feature/payment
  └── hotfix/critical-bug
```

### Git Flow

```sh
main  ─── 只包含发布版本
  └── develop  ─── 开发主线
        └── feature/*   ─── 功能分支
        └── release/*   ─── 发布准备
  └── hotfix/*    ─── 紧急修复
```

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 当前状态 | `git status` |
| 添加文件 | `git add <file>` |
| 提交 | `git commit -m "msg"` |
| 推送 | `git push origin <branch>` |
| 拉取 | `git pull` |
| 查看日志 | `git log --oneline --graph` |
| 创建分支 | `git branch <name>` |
| 切换分支 | `git switch <name>` |
| 创建+切换 | `git switch -c <name>` |
| 合并分支 | `git merge <name>` |
| 暂存修改 | `git stash` |
| 恢复暂存 | `git stash pop` |
| 撤销本地修改 | `git restore <file>` |
| 查看差异 | `git diff` |

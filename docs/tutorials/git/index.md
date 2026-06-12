# Git 教程

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

# 查看配置
git config --list
git config user.name
```

## 基本操作

### 创建仓库

```sh
# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git  # SSH
git clone --depth 1 <url>               # 浅克隆（只取最新）
```

### 添加与提交

```sh
# 查看状态
git status
git status -s          # 简略输出

# 添加文件到暂存区
git add file.txt       # 添加单个文件
git add .              # 添加所有变更
git add -p             # 交互式分段添加

# 提交
git commit -m "提交说明"
git commit -am "说明"  # 跳过 git add（仅跟踪过的文件）
git commit --amend     # 修改上一次提交（信息或内容）

# 查看提交历史
git log
git log --oneline
git log --oneline --graph --all
git log --author="name"
git log --since="2 weeks ago"
```

### 差异查看

```sh
git diff               # 工作区 vs 暂存区
git diff --staged       # 暂存区 vs 最近提交
git diff HEAD          # 工作区 vs 最近提交
git diff commit1..commit2  # 两个提交之间的差异
```

## 分支管理

```sh
# 查看分支
git branch             # 本地分支列表
git branch -r          # 远程分支
git branch -a          # 所有分支

# 创建与切换
git branch feature-a   # 创建分支
git checkout feature-a # 切换分支
git switch feature-a   # 切换分支（新版）
git checkout -b feature-a  # 创建并切换
git switch -c feature-a    # 同上

# 合并分支
git merge feature-a    # 将 feature-a 合并到当前分支
git merge --no-ff feature-a  # 禁用快进合并

# 删除分支
git branch -d feature-a      # 删除已合并的分支
git branch -D feature-a      # 强制删除
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
git commit -m "解决冲突"
```

## 远程操作

```sh
# 管理远程仓库
git remote add origin <url>
git remote -v                        # 查看远程
git remote remove origin
git remote set-url origin <new-url>

# 推送
git push origin main                 # 推送到远程
git push -u origin main              # 设置上游并推送
git push origin --all                # 推送所有分支
git push origin --tags               # 推送标签

# 拉取
git pull                             # fetch + merge
git pull --rebase                    # fetch + rebase（更整洁）
git fetch                            # 获取不合并
git fetch origin feature-a           # 获取远程分支

# 远程分支
git checkout -b local-name origin/remote-name
```

## 撤销操作

```sh
# 撤销工作区修改
git restore file.txt          # 丢弃工作区修改
git checkout -- file.txt      # 旧版语法

# 撤销暂存区
git restore --staged file.txt # 从暂存区移回工作区
git reset HEAD file.txt       # 旧版语法

# 撤销提交
git reset --soft HEAD~1       # 撤销提交，保留工作区和暂存区
git reset --mixed HEAD~1      # 撤销提交，保留工作区，清空暂存区（默认）
git reset --hard HEAD~1       # 完全回退，丢弃所有修改（危险）

# 回退到指定版本
git reset --hard <commit-hash>

# 还原某次提交（创建反向提交）
git revert <commit-hash>
```

## 标签

```sh
# 创建标签
git tag v1.0.0               # 轻量标签
git tag -a v1.0.0 -m "版本1.0"  # 附注标签
git tag -a v1.0.0 <commit-hash>  # 为历史提交打标签

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
git stash push -m "消息"       # 带信息
git stash -u                   # 包含未跟踪文件

# 恢复
git stash pop                  # 恢复并删除最近储藏
git stash apply                # 恢复但不删除
git stash apply stash@{2}      # 恢复指定储藏

# 管理
git stash list                 # 查看储藏列表
git stash drop stash@{0}       # 删除指定储藏
git stash clear                # 清空所有储藏
```

## 进阶操作

### Rebase

```sh
# 变基（线性化历史）
git checkout feature
git rebase main               # 将 feature 基于 main 的最新提交

# 交互式变基（整理提交历史）
git rebase -i HEAD~3          # 修改最近 3 个提交

# 交互式命令：
# pick    - 使用该提交
# reword  - 修改提交信息
# squash  - 合并到上一个提交
# fixup   - 合并并丢弃信息
# edit    - 停止并修改
# drop    - 删除提交
```

### Cherry-pick

```sh
# 挑选特定提交到当前分支
git cherry-pick <commit-hash>
git cherry-pick <hash1> <hash2>
git cherry-pick A..B          # 区间内的所有提交
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
```

## .gitignore

```sh
# 创建 .gitignore 文件
/node_modules
.env
*.log
dist/
.DS_Store
.idea/
```

```sh
# 全局忽略
git config --global core.excludesFile ~/.gitignore_global
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

---

# 企业级实践

## 约定式提交（Conventional Commits）

```
<type>(<scope>): <description>

[body]

[footer(s)]
```

### 类型

| 类型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `chore` | 构建/工具 |
| `ci` | CI 配置 |
| `breaking` | 破坏性变更 |

```sh
git commit -m "feat(auth): add OAuth2 login flow"
git commit -m "fix(api): handle null pointer in user serializer"
git commit -m "breaking(core): remove deprecated v1 endpoints"

# BREAKING CHANGE 在 footer 中
git commit -m "refactor(db)!: migrate to SQLAlchemy 2.0"
```

### 自动生成 Changelog

```sh
npm install -g conventional-changelog-cli
conventional-changelog -p conventionalcommits -i CHANGELOG.md -s
```

## 分支策略

### Trunk-Based Development（主干开发）

```sh
# 原则：短命分支，频繁合并到 main
main
  ├── feat/xxx     # 2-3 天内合并
  ├── fix/xxx
  └── refactor/xxx

# 使用 feature flag 控制发布
if feature_flag_enabled("new-checkout"):
    show_new_checkout()
else:
    show_old_checkout()
```

### GitHub Flow

```sh
main
  └── feature-branch → PR → merge to main → deploy
```

### Git Flow（适合版本发布）

```sh
main          —— 生产发布
  └── develop    —— 开发主线
       ├── feature/xxx  → merge to develop
       ├── release/x.x  → merge to main & develop
       └── hotfix/xxx   → merge to main & develop
```

## Monorepo 管理

### 工作流

```sh
# 使用 git subtree 或 git submodule
# 推荐使用 pnpm workspace / Nx / Turborepo

# 分离子目录到独立仓库
git subtree push --prefix packages/shared origin shared-main
```

### CODEOWNERS

```sh
# .github/CODEOWNERS
# 自动指派代码审查人

# 全局默认
* @team-core

# 特定路径
/packages/api/ @team-backend
/packages/web/ @team-frontend
/docs/ @team-docs

# 安全相关
/security/ @security-team @cto
*.pem @security-team
```

### 分支保护规则

```
Settings → Branches → Add rule:
├── Require pull request before merging
├── Require approvals (至少 1 人)
├── Dismiss stale review approvals
├── Require status checks (CI 通过)
├── Require branches up to date
├── Include administrators
└── Require signed commits
```

## Git Hooks

### husky（自动化 Git 钩子）

```sh
npm install -D husky lint-staged
npx husky init
```

```sh
# .husky/pre-commit
npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

```sh
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

```sh
# .husky/pre-push
npm run test:ci
npm run build
```

### commitlint

```sh
npm install -D @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'ci', 'breaking']],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72],
  },
}
```

## 代码审查规范

### PR 模板

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## 描述
请简要描述变更内容

## 类型
- [ ] feat: 新功能
- [ ] fix: Bug 修复
- [ ] refactor: 重构
- [ ] docs: 文档
- [ ] test: 测试

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 无引入新的警告
- [ ] 更新了相关文档
- [ ] 添加了必要的测试

## 相关 Issue
Closes #123
```

### 审查要点

1. **功能正确性**：代码是否实现预期功能
2. **代码风格**：是否遵循项目规范
3. **安全**：是否存在注入、XSS、权限漏洞
4. **性能**：是否存在 N+1 查询、内存泄漏
5. **错误处理**：边界情况是否有处理
6. **可测试性**：是否易于编写测试
7. **可维护性**：命名、抽象是否合理
8. **文档**：是否需要更新文档

## Git LFS（大文件存储）

```sh
# 管理二进制大文件
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "assets/**/*.png"

git add .gitattributes
git lfs ls-files

# 查看 LFS 使用量
git lfs status
git lfs migrate info --everything
```

## 合并策略

| 策略 | 命令 | 适用场景 |
|------|------|---------|
| 直接合并 | `git merge` | 简单分支，保留分叉 |
| 快进合并 | `git merge --ff-only` | 线性历史 |
| 压缩合并 | `git merge --squash` | 将多个 commit 压成一个 |
| 变基合并 | `git rebase` + `git merge --ff` | 保持线性历史 |
| Cherry Pick | `git cherry-pick` | 挑选特定提交 |

### 合并 vs 变基

```sh
# 合并：保留完整历史
#    A---B---C feature
#   /
# D---E---F main
#        ↓ merge
#    A---B---C feature
#   /         \
# D---E---F---G main

# 变基：线性历史
#    A---B---C feature
#   /
# D---E---F main
#        ↓ rebase
# D---E---F---A'---B'---C' feature
```

## CI/CD 集成

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # 获取全部历史（用于 lint-staged）

      - uses: actions/setup-node@v4
        with:
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:ci
      - run: npm run build

      - name: Check for missing changelog
        run: |
          if [[ $(git diff --name-only ${{ github.event.before }} ${{ github.sha }} -- packages/) ]]; then
            if ! git diff --name-only ${{ github.event.before }} ${{ github.sha }} -- CHANGELOG.md; then
              echo "Error: CHANGELOG.md is not updated"
              exit 1
            fi
          fi
```

## 度量与监控

```sh
# Git 统计
git shortlog -sn                    # 按提交次数排序
git log --format='%an' | sort | uniq -c | sort -rn
git diff --shortstat <tag1> <tag2>  # 版本间变更统计

# 代码行数统计
git ls-files | xargs wc -l
git log --since="2025-01-01" --format='' --numstat | awk '{added+=$1; deleted+=$2} END {print added, deleted}'

# GitInspector（可视化报告）
npm install -g gitinspector
gitinspector --format html > report.html
```

---

## 生态全景

### Git 托管平台

| 平台 | 特点 | CI/CD |
|------|------|-------|
| **GitHub** | 最大社区、Actions、Copilot | GitHub Actions |
| **GitLab** | 自托管、完整 DevOps | GitLab CI/CD |
| **Bitbucket** | Atlassian 集成 | Bitbucket Pipelines |
| **Gitee** | 中国区、国内加速 | Gitee Go |

### CI/CD 工具链

```
代码提交 → 代码检查 → 测试 → 构建 → 部署
   │          │        │       │      │
   ├ husky    ├ ESLint  ├ Jest  ├ Vite ├ Docker
   ├ commitlint├ Prettier├ Vitest├ Webpack├ K8s
   └ lint-staged└ mypy   └ pytest└ esbuild└ Serverless
```

### Git GUI 工具

```sh
# CLI 是基础，GUI 辅助
gitk              # Git 内置历史浏览器
git gui           # Git 内置 GUI

# 第三方 GUI
GitHub Desktop    # 免费、简洁
Sourcetree        # 功能完整（Windows/Mac）
GitKraken         # 可视化 Git 图
Fork              # 快速、优雅（Mac）
```

### 项目管理集成

```sh
# GitHub Issues + Projects
# git commit 关联 Issue
git commit -m "fix(#123): handle null pointer"

# 自动关闭 Issue
# Closes #123, Fixes #456

# GitLab Issue Boards
# Jira 集成
# Linear 集成
```

### 语义化版本（SemVer）

```
v1.2.3
│ │ │
│ │ └── patch: 修复 Bug
│ └──── minor: 新增功能（向后兼容）
└────── major: 破坏性变更

# 工具
npm version patch  # 1.2.3 → 1.2.4
npm version minor  # 1.2.3 → 1.3.0
npm version major  # 1.2.3 → 2.0.0

# 自动生成 Changelog
standard-version
semantic-release
changesets       # Monorepo 版本管理
```

### Git 安全工具

```sh
# 扫描敏感信息
git secrets --scan
trufflehog git --repo https://github.com/user/repo
gitleaks detect

# 签名提交
git config --global user.signingkey <KEY>
git config --global commit.gpgsign true
git commit -S -m "signed commit"
```

```


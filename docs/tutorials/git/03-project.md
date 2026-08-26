# 实战项目：团队协作工作流模拟

本教程模拟一个三人开发团队，从零开始建立仓库、协作开发、发布版本的全流程。

## 1. 初始化仓库

```sh
# 创建项目目录
mkdir team-project && cd team-project

# 初始化仓库
git init
git config user.name "Project Manager"
git config user.email "pm@team.com"

# 创建初始代码
echo "# Team Project" > README.md
mkdir src
echo "console.log('hello world');" > src/index.js

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
dist/
EOF

# 首次提交
git add -A
git commit -m "chore: initial project setup"

# 创建 develop 分支
git checkout -b develop
git push origin -u develop   # 假设已配置远程
```

## 2. Feature Branch 开发

### 开发者 A：实现用户登录

```sh
# 从 develop 拉出功能分支
git checkout develop
git pull origin develop
git checkout -b feature/login

# 开发登录功能
echo "function login() {}" > src/auth.js
git add src/auth.js
git commit -m "feat(auth): add login function stub"

echo "function validate() {}" >> src/auth.js
git commit -am "feat(auth): add input validation"

# 同步最新 develop
git fetch origin
git rebase origin/develop
```

### 开发者 B：实现支付模块

```sh
# 另一开发者同时工作
git checkout develop
git checkout -b feature/payment

echo "function processPayment() {}" > src/payment.js
git add src/payment.js
git commit -m "feat(payment): add payment processing"

echo "function refund() {}" >> src/payment.js
git commit -am "feat(payment): add refund support"

git rebase origin/develop
```

## 3. PR 流程（模拟）

```sh
# 开发者 A 推送分支并创建 PR
git push origin feature/login

# PR 创建后自动触发 CI（见 04-engineering CI/CD 章节）
# 设置 PR 标题: "feat(auth): implement user login module"

# 推送后其他人可以审查
git fetch origin
git checkout -b review/login origin/feature/login

# 审查过程中可以添加修正提交
echo "// TODO: add JWT token" >> src/auth.js
git commit -am "chore: add TODO for JWT"
git push origin feature/login
```

## 4. 冲突解决

```sh
# 假设 feature/login 和 feature/payment 都修改了 src/index.js
# 当 develop 合并了 payment 后再合并 login 时产生冲突

# 切换到 develop 并合并 payment
git checkout develop
git merge feature/payment

# 尝试合并 login
git merge feature/login
# CONFLICT in src/index.js

# 查看冲突
git status
git diff

# 手动编辑解决冲突
cat > src/index.js << 'EOF'
console.log('hello world');
require('./auth');
require('./payment');
EOF

# 标记为已解决
git add src/index.js
git commit -m "merge: resolve conflict in src/index.js"
```

### 冲突预防

```sh
# 在合并前查看差异
git diff develop feature/login -- src/index.js
git diff develop feature/login --name-only

# 使用 git merge --no-commit 分步检查
git merge --no-commit feature/login
git diff --cached    # 查看即将合并的内容
git merge --abort    # 如果有问题可以取消
```

## 5. Code Review

```sh
# 审查者拉取分支
git fetch origin
git checkout feature/login

# 逐 commit 审查
git log --oneline develop..feature/login
git diff develop...feature/login   # 三路差异

# 提出修改意见，开发者修改
git commit -am "refactor: apply review feedback"
git push origin feature/login

# 修改提交历史（整理成清晰提交）
git rebase -i develop
# pick 第一个, fixup 其余的修正提交

# 强制推送（在 PR 分支上可以 force push）
git push --force-with-lease origin feature/login
```

## 6. Merge 到 Develop

```sh
# PR 审查通过，合并
git checkout develop
git merge --no-ff feature/login
git push origin develop

# --no-ff 保留分支历史，方便追溯
git log --oneline --graph develop
```

## 7. Release Tagging

```sh
# 准备发布
git checkout develop
git checkout -b release/v1.0.0

# 版本号更新、changelog
echo "# v1.0.0" >> CHANGELOG.md
git add CHANGELOG.md
git commit -m "chore: add changelog for v1.0.0"

# 合并到 main
git checkout main
git merge --no-ff release/v1.0.0

# 打标签
git tag -a v1.0.0 -m "First public release"
git push origin main --tags

# 合并回 develop
git checkout develop
git merge --no-ff release/v1.0.0
git branch -d release/v1.0.0
```

### SemVer 版本规则

```sh
# v1.0.0
# major: 不兼容的 API 修改
# minor: 向后兼容的功能新增
# patch: 向后兼容的 bug 修复

npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

## 8. Hotfix

```sh
# 生产环境发现紧急 Bug，从 main 拉出 hotfix 分支
git checkout main
git checkout -b hotfix/critical-npe

# 修复并测试
echo "// fixed" >> src/index.js
git commit -am "fix: prevent NullPointerException in parse"

# 合并到 main 和 develop
git checkout main
git merge --no-ff hotfix/critical-npe
git tag -a v1.0.1 -m "Hotfix: NPE in parse"
git push origin main --tags

# 同步到 develop
git checkout develop
git merge --no-ff hotfix/critical-npe

# 清理
git branch -d hotfix/critical-npe
git push origin --delete hotfix/critical-npe
```

## 工作流总结

```
main:        v1.0.0 ──── v1.0.1(hotfix) ──── v2.0.0
               │              │                   │
develop:    feature/login ── feature/payment ── release/v2.0
               │              │                   │
feature/*:    login     payment               release work
```

### 关键命令速查

| 阶段 | 命令 |
|------|------|
| 创建分支 | `git checkout -b feature/xxx develop` |
| 同步上游 | `git rebase origin/develop` |
| 创建 PR | `git push origin feature/xxx` |
| 解决冲突 | `git merge --no-ff` / 手动编辑 |
| 发布 | `git tag -a v1.0.0 -m "msg"` |
| Hotfix | `git checkout -b hotfix/xxx main` |

## 官方文档与延伸阅读

- **官方文档**：[Pro Git（中文）](https://git-scm.com/book/zh/v2) · [Git Reference](https://git-scm.com/docs) · [git-scm.com/doc](https://git-scm.com/doc)
- **分支与协作**：[Pro Git 分支](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E6%96%B0%E5%BB%BA%E4%B8%8E%E5%90%88%E5%B9%B6) · [Pro Git 远程仓库](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E4%B8%8E%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E5%8D%8F%E4%BD%9C)
- **命令参考**：[git rebase](https://git-scm.com/docs/git-rebase) · [git tag](https://git-scm.com/docs/git-tag)
- **托管平台**：[GitHub Docs](https://docs.github.com/zh) · [GitLab Docs](https://docs.gitlab.com/) · [GitHub PR 文档](https://docs.github.com/zh/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- **规范**：[Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) · [SemVer](https://semver.org/lang/zh-CN/)
- **相关工具**：[Git LFS](https://git-lfs.com/) · [git-filter-repo](https://github.com/newren/git-filter-repo) · [gitleaks](https://github.com/gitleaks/gitleaks)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

# Git 工程实践

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

* @team-core
/packages/api/ @team-backend
/packages/web/ @team-frontend
/docs/ @team-docs
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
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "assets/**/*.png"

git add .gitattributes
git lfs ls-files

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
          fetch-depth: 0

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

## 官方文档与延伸阅读

- **官方文档**：[git-scm.com/doc](https://git-scm.com/doc) · [Pro Git（中文）](https://git-scm.com/book/zh/v2) · [Git Reference](https://git-scm.com/docs)
- **分支策略**：[Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) · [Trunk-Based Development](https://trunkbaseddevelopment.com/) · [GitHub Flow](https://docs.github.com/zh/get-started/using-github/github-flow)
- **提交规范**：[Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) · [SemVer](https://semver.org/lang/zh-CN/)
- **Git Hooks**：[Git Hooks](https://git-scm.com/docs/githooks) · [husky](https://typicode.github.io/husky/) · [commitlint](https://commitlint.js.org/)
- **托管平台与 CI/CD**：[GitHub Docs](https://docs.github.com/zh) · [GitLab Docs](https://docs.gitlab.com/) · [GitHub Actions](https://docs.github.com/zh/actions) · [GitLab CI](https://docs.gitlab.com/ci/) · [CODEOWNERS](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- **相关工具**：[Git LFS](https://git-lfs.com/) · [git-filter-repo](https://github.com/newren/git-filter-repo) · [gitleaks](https://github.com/gitleaks/gitleaks)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

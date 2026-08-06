# 工具链与包管理

按职责分类收录各技术栈工具的官方文档。选型建议见各技术的「生态全景」章节，本页只负责给出权威入口。

## 包管理与依赖

| 生态 | 工具 | 官方文档 |
|------|------|----------|
| JavaScript | npm | [docs.npmjs.com](https://docs.npmjs.com/) |
| JavaScript | pnpm | [pnpm.io（中文）](https://pnpm.io/zh/motivation) |
| JavaScript | Yarn | [yarnpkg.com](https://yarnpkg.com/getting-started) |
| JavaScript | Bun | [bun.sh/docs/cli/install](https://bun.sh/docs/cli/install) |
| Python | pip | [pip.pypa.io](https://pip.pypa.io/en/stable/) |
| Python | uv | [docs.astral.sh/uv](https://docs.astral.sh/uv/) |
| Python | Poetry | [python-poetry.org](https://python-poetry.org/docs/) |
| Java | Maven | [maven.apache.org](https://maven.apache.org/guides/) |
| Java | Gradle | [docs.gradle.org](https://docs.gradle.org/current/userguide/userguide.html) |
| Go | go mod | [go.dev/ref/mod](https://go.dev/ref/mod) |
| Rust | Cargo | [doc.rust-lang.org/cargo](https://doc.rust-lang.org/cargo/) |
| C++ | vcpkg | [learn.microsoft.com/vcpkg](https://learn.microsoft.com/zh-cn/vcpkg/) |
| C++ | Conan | [docs.conan.io](https://docs.conan.io/2/) |

## 构建与编译

| 用途 | 工具 | 官方文档 |
|------|------|----------|
| 前端打包 | Vite | [vite.dev（中文）](https://cn.vite.dev/guide/) |
| 前端打包 | Rollup | [rollupjs.org](https://rollupjs.org/introduction/) |
| 前端打包 | webpack | [webpack.docschina.org](https://webpack.docschina.org/concepts/) |
| 极速转译 | esbuild | [esbuild.github.io](https://esbuild.github.io/) |
| Rust 系工具链 | Rspack | [rspack.dev](https://rspack.dev/zh/guide/start/quick-start) |
| TS 编译 | tsc | [tsconfig 参考](https://www.typescriptlang.org/tsconfig) |
| TS/JS 转译 | SWC | [swc.rs](https://swc.rs/docs/getting-started) · Babel [babeljs.io](https://babeljs.io/docs/) |
| C/C++ 构建 | CMake | [cmake.org/documentation](https://cmake.org/documentation/) |
| C/C++ 构建 | Ninja / Meson | [ninja-build.org](https://ninja-build.org/manual.html) · [mesonbuild.com](https://mesonbuild.com/) |
| Monorepo | Turborepo | [turborepo.com/docs](https://turborepo.com/docs) |
| Monorepo | Nx | [nx.dev](https://nx.dev/getting-started/intro) |

## 格式化与静态检查

| 生态 | 工具 | 官方文档 |
|------|------|----------|
| JS / TS | ESLint | [eslint.org](https://eslint.org/docs/latest/) |
| JS / TS | Prettier | [prettier.io](https://prettier.io/docs/) |
| JS / TS | Biome | [biomejs.dev](https://biomejs.dev/zh-cn/guides/getting-started/) |
| TS 类型规则 | typescript-eslint | [typescript-eslint.io](https://typescript-eslint.io/getting-started/) |
| CSS | Stylelint | [stylelint.io](https://stylelint.io/) |
| Python | Ruff | [docs.astral.sh/ruff](https://docs.astral.sh/ruff/) |
| Python | mypy | [mypy.readthedocs.io](https://mypy.readthedocs.io/en/stable/) |
| Go | golangci-lint | [golangci-lint.run](https://golangci-lint.run/) |
| Go | gofmt / vet | [go.dev/blog/gofmt](https://go.dev/blog/gofmt) · [go vet](https://pkg.go.dev/cmd/vet) |
| Rust | Clippy / rustfmt | [Clippy](https://doc.rust-lang.org/clippy/) · [rustfmt](https://rust-lang.github.io/rustfmt/) |
| Java | Checkstyle / SpotBugs | [checkstyle.org](https://checkstyle.org/) · [spotbugs.readthedocs.io](https://spotbugs.readthedocs.io/en/stable/) |
| C++ | clang-tidy / clang-format | [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) · [clang-format](https://clang.llvm.org/docs/ClangFormat.html) |
| Shell | ShellCheck / shfmt | [shellcheck.net](https://www.shellcheck.net/) · [mvdan/sh](https://github.com/mvdan/sh) |
| SQL | sqlfluff | [docs.sqlfluff.com](https://docs.sqlfluff.com/en/stable/) |
| Dockerfile | hadolint | [hadolint](https://github.com/hadolint/hadolint) |

## 测试

| 生态 | 工具 | 官方文档 |
|------|------|----------|
| JS / TS 单元测试 | Vitest | [vitest.dev（中文）](https://cn.vitest.dev/guide/) |
| JS / TS 单元测试 | Jest | [jestjs.io（中文）](https://jestjs.io/zh-Hans/docs/getting-started) |
| 组件测试 | Testing Library | [testing-library.com](https://testing-library.com/docs/) |
| 端到端 | Playwright | [playwright.dev（中文）](https://playwright.dev/docs/intro) |
| 端到端 | Cypress | [docs.cypress.io](https://docs.cypress.io/) |
| Python | pytest | [docs.pytest.org](https://docs.pytest.org/en/stable/) |
| Java | JUnit 5 | [junit.org/junit5](https://junit.org/junit5/docs/current/user-guide/) |
| Go | testing | [pkg.go.dev/testing](https://pkg.go.dev/testing) |
| Rust | cargo test | [Rust Book 测试章节](https://doc.rust-lang.org/book/ch11-00-testing.html) |
| C++ | GoogleTest | [google.github.io/googletest](https://google.github.io/googletest/) |
| Shell | Bats-core | [bats-core.readthedocs.io](https://bats-core.readthedocs.io/en/stable/) |
| 接口压测 | k6 | [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/) |

## CI/CD 与交付

| 用途 | 工具 | 官方文档 |
|------|------|----------|
| CI | GitHub Actions | [docs.github.com/actions](https://docs.github.com/zh/actions) |
| CI | GitLab CI | [docs.gitlab.com/ci](https://docs.gitlab.com/ci/) |
| CI | Jenkins | [jenkins.io/doc](https://www.jenkins.io/doc/) |
| 容器构建 | Docker Build | [docs.docker.com/build](https://docs.docker.com/build/) |
| 部署编排 | Kubernetes | [kubernetes.io（中文）](https://kubernetes.io/zh-cn/docs/home/) |
| 部署编排 | Helm | [helm.sh（中文）](https://helm.sh/zh/docs/) |
| GitOps | Argo CD | [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/stable/) |
| IaC | Terraform | [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs) |
| 托管平台 | Vercel | [vercel.com/docs](https://vercel.com/docs) |
| 发布自动化 | semantic-release | [semantic-release.gitbook.io](https://semantic-release.gitbook.io/semantic-release/) |
| 提交钩子 | husky / lint-staged | [typicode.github.io/husky](https://typicode.github.io/husky/) · [lint-staged](https://github.com/lint-staged/lint-staged) |

## 可观测性与安全扫描

| 用途 | 工具 | 官方文档 |
|------|------|----------|
| 指标 | Prometheus | [prometheus.io/docs](https://prometheus.io/docs/introduction/overview/) |
| 可视化 | Grafana | [grafana.com/docs](https://grafana.com/docs/grafana/latest/) |
| 链路追踪 | OpenTelemetry | [opentelemetry.io/docs](https://opentelemetry.io/docs/) |
| 错误监控 | Sentry | [docs.sentry.io](https://docs.sentry.io/) |
| 日志栈 | Loki / ELK | [Loki](https://grafana.com/docs/loki/latest/) · [Elastic](https://www.elastic.co/guide/index.html) |
| 依赖漏洞 | Dependabot | [Dependabot 文档](https://docs.github.com/zh/code-security/dependabot) |
| 镜像与依赖扫描 | Trivy | [trivy.dev](https://trivy.dev/latest/docs/) |
| 代码质量 | SonarQube | [docs.sonarsource.com](https://docs.sonarsource.com/sonarqube-server/latest/) |
| 密钥泄露检测 | gitleaks | [gitleaks](https://github.com/gitleaks/gitleaks) |
| 前端性能审计 | Lighthouse | [developer.chrome.com/docs/lighthouse](https://developer.chrome.com/docs/lighthouse/overview) |

## 编辑器与调试

| 用途 | 工具 | 官方文档 |
|------|------|----------|
| 编辑器 | VS Code | [code.visualstudio.com/docs](https://code.visualstudio.com/docs) |
| IDE | IntelliJ IDEA | [jetbrains.com/help/idea](https://www.jetbrains.com/help/idea/getting-started.html) |
| 浏览器调试 | Chrome DevTools | [developer.chrome.com/docs/devtools](https://developer.chrome.com/docs/devtools) |
| Node 调试 | Node Inspector | [nodejs.org/en/learn/getting-started/debugging](https://nodejs.org/en/learn/getting-started/debugging) |
| 原生调试 | GDB / LLDB | [GDB](https://sourceware.org/gdb/current/onlinedocs/gdb.html/) · [LLDB](https://lldb.llvm.org/use/tutorial.html) |
| API 调试 | curl / HTTPie | [curl.se/docs](https://curl.se/docs/manpage.html) · [httpie.io/docs](https://httpie.io/docs/cli) |

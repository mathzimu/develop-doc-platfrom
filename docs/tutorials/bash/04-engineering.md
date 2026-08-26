# Bash 工程实践

## Shell 脚本规范

### 脚本模板

```bash
#!/usr/bin/env bash
# 企业级 Shell 脚本模板
set -euo pipefail
IFS=$'\n\t'

# 颜色输出
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

log_info()    { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }

# 使用说明
usage() {
    cat <<EOF
Usage: $(basename "$0") [options]

Options:
  -e, --env ENV     环境 (dev/staging/prod)
  -t, --tag TAG     镜像标签
  -h, --help        显示帮助
EOF
    exit 1
}

# 参数解析
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -e|--env) ENV="$2"; shift 2 ;;
            -t|--tag) TAG="$2"; shift 2 ;;
            -h|--help) usage ;;
            *) log_error "未知参数: $1"; usage ;;
        esac
    done
}

# 错误处理
cleanup() {
    log_info "清理临时文件..."
    rm -rf /tmp/deploy-*
}
trap cleanup EXIT
```

### 项目结构

```
project/
├── bin/                    # 可执行脚本
│   ├── deploy.sh
│   ├── backup.sh
│   └── healthcheck.sh
├── lib/                    # 公共函数库
│   ├── logging.sh
│   ├── utils.sh
│   └── config.sh
├── conf/                   # 配置文件
│   └── project.conf
├── tests/                  # 测试
│   └── test_utils.bats
└── Makefile                # 任务编排
```

### 函数库组织

```bash
# lib/logging.sh
log_info()    { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }

# 使用函数库
# 在脚本中 source 加载
source "$(dirname "$0")/lib/logging.sh"
source "$(dirname "$0")/lib/utils.sh"
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 部署到服务器
        env:
          HOST: ${{ secrets.DEPLOY_HOST }}
          USERNAME: ${{ secrets.DEPLOY_USER }}
          SSH_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

          ssh -o StrictHostKeyChecking=no $USERNAME@$HOST << 'EOF'
            set -euo pipefail
            cd /app
            git pull origin main
            docker compose pull
            docker compose up -d --force-recreate
            docker system prune -f
            echo "部署完成"
          EOF
```

### GitLab CI

```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - chmod +x bin/deploy.sh
    - ./bin/deploy.sh --env production --tag $CI_COMMIT_TAG
  only:
    - tags
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                sh 'bin/deploy.sh --env staging'
            }
        }
    }
}
```

## 运维脚本

### 日志轮转与归档

```bash
#!/bin/bash
# 日志轮转归档
BACKUP_DIR="/backup/$(date +%Y%m%d)"
LOG_DIR="/var/log/myapp"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

for log in "$LOG_DIR"/*.log; do
    if [[ -f "$log" ]] && [[ $(stat -f%m "$log") -gt 86400 ]]; then
        gzip -c "$log" > "$BACKUP_DIR/$(basename "$log").$(date +%H%M%S).gz"
        : > "$log"  # 清空原文件
        log_info "已归档: $log"
    fi
done

# 删除过期备份
find /backup -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +
```

### 数据库备份

```bash
#!/bin/bash
set -euo pipefail

DB_NAME="${1:-myapp}"
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
RETENTION_DAYS=7

log_info "开始备份: $DB_NAME"

mysqldump --single-transaction --quick "$DB_NAME" | gzip > "$BACKUP_FILE"

log_info "备份完成: $BACKUP_FILE"

# 清理旧备份
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
```

### 服务器初始化检查

```bash
#!/bin/bash
set -euo pipefail

check() {
    local name=$1
    local cmd=$2
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "  [✓] $name"
    else
        echo -e "  [✗] $name"
        FAILED=1
    fi
}

echo "服务器健康检查: $(hostname) at $(date)"
echo "----------------------------------------"

check "磁盘空间充足"    '[ $(df / | awk "NR==2 {print \$5}" | tr -d %) -lt 90 ]'
check "内存充足"        '[ $(free | awk "/Mem:/ {print int(\$3/\$2 * 100)}") -lt 90 ]'
check "Docker 运行中"   'docker info'
check "Nginx 运行中"    'pgrep nginx'
check "SSL 证书有效"    'openssl x509 -checkend 604800 -in /etc/ssl/certs/server.crt > /dev/null 2>&1'

echo "----------------------------------------"
exit ${FAILED:-0}
```

## 监控健康检查

```bash
#!/bin/bash
# healthcheck.sh
ENDPOINT="http://localhost:3000/health"
THRESHOLD=3
FAIL_COUNT=0

for i in $(seq 1 $THRESHOLD); do
    if curl -sf "$ENDPOINT" > /dev/null 2>&1; then
        log_info "Health check passed"
        exit 0
    fi
    FAIL_COUNT=$((FAIL_COUNT + 1))
    sleep 5
done

log_error "Health check failed after $FAIL_COUNT attempts"
# 触发告警
curl -X POST -H "Content-Type: application/json" \
    -d "{\"text\": \"服务健康检查失败: $ENDPOINT\"}" \
    "$WEBHOOK_URL"
exit 1
```

## 部署流水线

```bash
#!/usr/bin/env bash
set -euo pipefail

# deploy.sh — 多环境部署脚本
readonly ENVIRONMENTS=("dev" "staging" "prod")

deploy() {
    local env=$1
    local tag=$2

    log_info "开始部署: $env ($tag)"

    case "$env" in
        dev)
            docker compose -f docker-compose.dev.yml up -d
            ;;
        staging)
            docker compose -f docker-compose.staging.yml up -d
            run_integration_tests
            ;;
        prod)
            # 蓝绿部署
            deploy_blue_green "$tag"
            ;;
    esac

    log_info "部署完成: $env ($tag)"
}

rollback() {
    local env=$1
    log_warn "回滚: $env"
    docker compose down
    docker compose up -d
}

main() {
    local action="${1:-deploy}"
    local env="${2:-dev}"
    local tag="${3:-latest}"

    case "$action" in
        deploy)  deploy "$env" "$tag" ;;
        rollback) rollback "$env" ;;
        *)       log_error "未知操作: $action"; exit 1 ;;
    esac
}

main "$@"
```

## 最佳实践

```bash
# 1. 始终使用严格模式
set -euo pipefail

# 2. 使用函数组织代码，避免全局代码
# 3. 每个函数只做一件事
# 4. 参数校验前置
# 5. 必须的临时文件使用 mktemp
# 6. 始终 trap 清理
# 7. 错误信息输出到 stderr
# 8. 日志带上时间戳
# 9. 使用 readonly 声明常量
# 10. 复杂逻辑添加单元测试（bats）

# 日志最佳实践
log() {
    local level=$1
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" >&2
}
```

## 官方文档与延伸阅读

- **编码规范**：[Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- **静态检查与格式化**：[ShellCheck](https://www.shellcheck.net/) · [shfmt](https://github.com/mvdan/sh) · [bashate](https://github.com/openstack/bashate)
- **测试框架**：[Bats-core](https://bats-core.readthedocs.io/en/stable/)
- **日志轮转**：[logrotate(8)](https://man7.org/linux/man-pages/man8/logrotate.8.html)
- **CI/CD**：[GitHub Actions](https://docs.github.com/zh/actions) · [GitLab CI](https://docs.gitlab.com/ci/)
- **进程管理**：[systemd](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) · [supervisord](http://supervisord.org/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

# 实战项目：日志分析脚本

构建一个完整的企业级日志分析 CLI 工具，支持参数解析、多维度统计、报告生成和定时执行。

## 完整脚本

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# ============================================
# 日志分析工具 (log-analyzer.sh)
# ============================================

readonly VERSION="2.0.0"
readonly SCRIPT_NAME=$(basename "$0")

# 颜色
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ============================================
# 参数解析
# ============================================

usage() {
    cat <<EOF
$SCRIPT_NAME — 日志分析工具 v$VERSION

用法:
  $SCRIPT_NAME [选项] <日志文件>

选项:
  -l, --level LEVEL    统计级别 (INFO/WARN/ERROR, 逗号分隔)
  -t, --time-range R   时间范围 (如: 2025-01-01,2025-01-31)
  -o, --output FILE    输出报告到文件
  -f, --format FORMAT  输出格式 (text/json/csv)
  -s, --schedule CRON  设置定时执行 (cron 表达式)
  -h, --help           显示帮助
  -V, --version        显示版本

示例:
  $SCRIPT_NAME app.log
  $SCRIPT_NAME -l ERROR,WARN -o report.json app.log
  $SCRIPT_NAME -f json -t "2025-01-01,2025-01-31" app.log
EOF
    exit 0
}

parse_args() {
    LEVELS="INFO,WARN,ERROR"
    TIME_RANGE=""
    OUTPUT_FILE=""
    FORMAT="text"
    SCHEDULE=""

    while [[ $# -gt 0 ]]; do
        case "$1" in
            -l|--level)
                LEVELS="$2"
                shift 2
                ;;
            -t|--time-range)
                TIME_RANGE="$2"
                shift 2
                ;;
            -o|--output)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            -f|--format)
                FORMAT="$2"
                shift 2
                ;;
            -s|--schedule)
                SCHEDULE="$2"
                shift 2
                ;;
            -h|--help)
                usage
                ;;
            -V|--version)
                echo "$SCRIPT_NAME v$VERSION"
                exit 0
                ;;
            -*)
                log_error "未知参数: $1"
                usage
                ;;
            *)
                LOG_FILE="$1"
                shift
                ;;
        esac
    done

    if [[ -z "${LOG_FILE:-}" ]]; then
        log_error "请指定日志文件"
        usage
    fi

    if [[ ! -f "$LOG_FILE" ]]; then
        log_error "文件不存在: $LOG_FILE"
        exit 1
    fi

    IFS=',' read -ra LEVEL_ARRAY <<< "$LEVELS"
}
```

## 读取日志文件

```bash
# ============================================
# 读取与解析
# ============================================

# 支持的日志格式:
# 2025-01-15 10:30:45 INFO  用户登录成功
# 2025-01-15 10:31:12 WARN  连接超时，重试中
# 2025-01-15 10:32:01 ERROR 数据库连接失败
#                           Traceback (most recent call last):
#                             File "app.py", line 42, in connect
#                               raise ConnectionError("timeout")
#                           ConnectionError: timeout

parse_log_entry() {
    local line="$1"

    # 匹配时间戳 + 级别
    if [[ "$line" =~ ^([0-9]{4}-[0-9]{2}-[0-9]{2}\ [0-9]{2}:[0-9]{2}:[0-9]{2})\ (INFO|WARN|ERROR)\ (.+)$ ]]; then
        TIMESTAMP="${BASH_REMATCH[1]}"
        LEVEL="${BASH_REMATCH[2]}"
        MESSAGE="${BASH_REMATCH[3]}"
        return 0
    fi
    return 1
}

read_log_file() {
    local file="$1"
    local current_error=""
    local in_error_block=false

    while IFS= read -r line; do
        if parse_log_entry "$line"; then
            in_error_block=false

            # 过滤级别
            for level in "${LEVEL_ARRAY[@]}"; do
                if [[ "$LEVEL" == "$level" ]]; then
                    ENTRIES+=("$TIMESTAMP|$LEVEL|$MESSAGE")
                    break
                fi
            done

            # 记录 ERROR 上下文
            if [[ "$LEVEL" == "ERROR" ]]; then
                current_error="$TIMESTAMP|$MESSAGE"
                in_error_block=true
            fi
        elif $in_error_block && [[ -n "$line" ]]; then
            ERROR_STACKS["$current_error"]+="  $line"$'\n'
        fi
    done < "$file"
}
```

## 统计级别数量

```bash
# ============================================
# 统计
# ============================================

declare -A LEVEL_COUNTS
declare -A HOURLY_COUNTS
declare -A ERROR_STACKS
ENTRIES=()

count_levels() {
    for entry in "${ENTRIES[@]}"; do
        local level="${entry#*|}"
        level="${level%%|*}"
        ((LEVEL_COUNTS[$level]++))
    done
}

aggregate_by_time() {
    for entry in "${ENTRIES[@]}"; do
        local ts="${entry%%|*}"
        local hour="${ts:0:13}"       # "2025-01-15 10"
        local level="${entry#*|}"
        level="${level%%|*}"

        ((HOURLY_COUNTS["$hour|$level"]++))
    done
}
```

## 输出报告

```bash
# ============================================
# 报告输出
# ============================================

generate_report_text() {
    local report=""
    report+="========================================\n"
    report+="  日志分析报告\n"
    report+="  文件: $LOG_FILE\n"
    report+="  时间: $(date '+%Y-%m-%d %H:%M:%S')\n"
    report+="========================================\n\n"

    report+="--- 级别统计 ---\n"
    for level in "${LEVEL_ARRAY[@]}"; do
        local count=${LEVEL_COUNTS[$level]:-0}
        report+=$(printf "  %-8s %d\n" "$level" "$count")
    done

    report+="\n--- 时间分布（按小时） ---\n"
    for key in "${!HOURLY_COUNTS[@]}"; do
        local hour="${key%%|*}"
        local level="${key##*|}"
        report+=$(printf "  %s %-8s %d\n" "$hour" "$level" "${HOURLY_COUNTS[$key]}")
    done | sort

    if [[ ${#ERROR_STACKS[@]} -gt 0 ]]; then
        report+="\n--- 错误堆栈 ---\n"
        for err_ts in "${!ERROR_STACKS[@]}"; do
            report+="  [$err_ts]\n"
            report+="  ${ERROR_STACKS[$err_ts]}\n"
        done
    fi

    echo -e "$report"
}

generate_report_json() {
    local first=true
    echo "{"
    echo '  "file": "'"$LOG_FILE"'",'
    echo '  "time": "'"$(date -Iseconds)"'",'
    echo '  "levels": {'
    for level in "${!LEVEL_COUNTS[@]}"; do
        $first || echo ","
        first=false
        printf '    "%s": %d' "$level" "${LEVEL_COUNTS[$level]}"
    done
    echo -e "\n  },"
    echo '  "errors": ['
    first=true
    for err_ts in "${!ERROR_STACKS[@]}"; do
        $first || echo ","
        first=false
        echo '    {"time": "'"$err_ts"'", "stack": "'"${ERROR_STACKS[$err_ts]//\"/\\\"}"'"}'
    done
    echo -e "\n  ]\n}"
}

generate_report_csv() {
    echo "level,count"
    for level in "${!LEVEL_COUNTS[@]}"; do
        echo "$level,${LEVEL_COUNTS[$level]}"
    done
    echo ""
    echo "hour,level,count"
    for key in "${!HOURLY_COUNTS[@]}"; do
        echo "${key%%|*},${key##*|},${HOURLY_COUNTS[$key]}"
    done | sort
}

output_report() {
    local report=""

    case "$FORMAT" in
        json) report=$(generate_report_json) ;;
        csv)  report=$(generate_report_csv) ;;
        text) report=$(generate_report_text) ;;
        *)    log_error "不支持的格式: $FORMAT"; exit 1 ;;
    esac

    if [[ -n "$OUTPUT_FILE" ]]; then
        echo "$report" > "$OUTPUT_FILE"
        log_info "报告已写入: $OUTPUT_FILE"
    else
        echo "$report"
    fi
}
```

## 定时执行

```bash
# ============================================
# 定时任务
# ============================================

setup_cron() {
    local cron_expr="$1"
    local script_path
    script_path=$(realpath "$0")
    local log_path="${LOG_FILE}.analyzed"

    local cron_line="$cron_expr $script_path -o $log_path $LOG_FILE"

    # 检查是否已存在
    if crontab -l 2>/dev/null | grep -qF "$script_path"; then
        log_warn "定时任务已存在，将覆盖"
    fi

    (crontab -l 2>/dev/null | grep -vF "$script_path"; echo "$cron_line") | crontab -
    log_info "定时任务已添加: $cron_line"
}

# ============================================
# 主流程
# ============================================

main() {
    parse_args "$@"

    if [[ -n "$SCHEDULE" ]]; then
        setup_cron "$SCHEDULE"
        exit 0
    fi

    log_info "开始分析: $LOG_FILE"

    read_log_file "$LOG_FILE"
    count_levels
    aggregate_by_time
    output_report

    log_info "分析完成"
}

main "$@"
```

## 使用示例

```bash
# 基本分析
./log-analyzer.sh app.log

# 只分析 ERROR 和 WARN
./log-analyzer.sh -l ERROR,WARN app.log

# 输出 JSON 报告
./log-analyzer.sh -f json -o report.json app.log

# 指定时间范围
./log-analyzer.sh -t "2025-01-01,2025-01-31" app.log

# 设置每 30 分钟执行一次
./log-analyzer.sh -s "*/30 * * * *" /var/log/app.log

# 加入 crontab 定时执行
# 每天凌晨 2 点执行
0 2 * * * /opt/scripts/log-analyzer.sh -f json -o /reports/$(date +\%Y\%m\%d).json /var/log/app.log
```

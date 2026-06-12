# Bash 进阶深入

## 正则表达式

### grep -E（扩展正则）

```bash
# 基本元字符
grep -E '^start' file.txt          # 以 start 开头
grep -E 'end$' file.txt            # 以 end 结尾
grep -E '[0-9]{3,5}' file.txt      # 3-5 位数字
grep -E '(error|warning)' log.txt  # 匹配多个关键字
grep -E 'col(o|ou)r' file.txt      # color 或 colour
grep -E '\bword\b' file.txt        # 单词边界
grep -E '\<word\>' file.txt        # 单词开头/结尾
grep -E 'http[s]?://' urls.txt     # http 或 https
grep -E '^[^#]' config.conf        # 非注释行
```

### sed 流编辑器

```bash
# 替换
sed 's/old/new/' file.txt           # 替换第一个
sed 's/old/new/g' file.txt          # 全部替换
sed 's/old/new/2' file.txt          # 替换第二个
sed -i 's/old/new/g' file.txt       # 原地修改
sed -i.bak 's/old/new/g' file.txt   # 备份后修改

# 行范围
sed '3,8s/old/new/g' file.txt       # 3-8 行替换
sed '/error/s/old/new/' file.txt    # 含 error 的行替换

# 删除
sed '/^#/d' config.conf             # 删除注释行
sed '/^$/d' file.txt                # 删除空行
sed '5,10d' file.txt                # 删除 5-10 行

# 打印与插入
sed -n '10,20p' file.txt            # 打印 10-20 行
sed '/error/p' file.txt             # 打印含 error 的行
sed '3i\inserted line' file.txt     # 在第 3 行前插入
sed '5a\appended line' file.txt     # 在第 5 行后追加

# 多命令
sed -e 's/a/A/g' -e 's/b/B/g' file.txt
```

### awk 高级用法

```bash
# 内置变量
awk '{print NR, $0}' file.txt       # 行号 + 整行
awk '{print NF, $NF}' file.txt      # 字段数 + 最后一个字段
awk -F: '{print $1, $3}' /etc/passwd

# 模式匹配
awk '/error/ {print}' log.txt       # 打印含 error 的行
awk '$3 > 100 {print $1, $3}' data.txt
awk 'NR > 1 && NR < 10' file.txt    # 2-9 行

# BEGIN/END 块
awk 'BEGIN {sum=0} {sum+=$1} END {print "总和:", sum}' numbers.txt

# 格式化输出
awk '{printf "%-10s %5d\n", $1, $2}' file.txt

awk 'NR==1; NR>1{print | "sort -k2"}' file.txt

awk '{
    split($0, arr, ",")
    print arr[1], arr[3]
}' data.csv

awk '{
    count[$1]++
} END {
    for (k in count) print k, count[k]
}' log.txt
```

## 数组与关联数组

```bash
# 索引数组
arr=("apple" "banana" "cherry")
echo ${arr[0]}                 # apple
echo ${arr[@]}                 # 所有元素
echo ${#arr[@]}                # 数组长度
arr+=("date")                  # 追加
unset arr[1]                   # 删除元素

# 关联数组（Bash 4+）
declare -A user
user[name]="Alice"
user[age]=30
user[city]="Beijing"
echo ${user[name]}
echo ${!user[@]}               # 所有键
echo ${user[@]}                # 所有值

# 遍历关联数组
for key in "${!user[@]}"; do
    echo "$key: ${user[$key]}"
done

# 复合操作
declare -A stats
for file in *.log; do
    ((stats[$(basename "$file" .log)]++))
done
```

## 进程替换

```bash
# <() — 将命令输出当作文件
diff <(ls dir1) <(ls dir2)
comm -12 <(sort file1) <(sort file2)   # 共同行
while read line; do ... done < <(command)

# >() — 将输入送给命令
tee >(gzip > output.gz) < input.txt
echo "data" > >(cat -n)
```

## 命名管道（mkfifo）

```bash
# 创建命名管道
mkfifo mypipe

# 终端 1：写入
echo "hello" > mypipe

# 终端 2：读取
cat mypipe

# 实用案例：实时数据传输
mkfifo logpipe
tail -f app.log > logpipe &
gzip -c < logpipe > archive.gz

# 清理
rm mypipe
```

## 信号处理（trap 深入）

```bash
# 常用信号
# SIGINT (2)  — Ctrl+C 中断
# SIGTERM (15) — 终止
# SIGKILL (9) — 强制终止（不可捕获）
# SIGHUP (1)  — 挂起/重载
# SIGUSR1 (10) / SIGUSR2 (12) — 用户自定义

# 捕获多个信号
cleanup() {
    echo "正在清理..."
    rm -rf /tmp/workdir
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 忽略信号
trap '' SIGINT                  # 忽略 Ctrl+C

# 重置信号处理
trap - SIGINT                   # 恢复默认行为

# 子进程退出时清理
trap 'kill 0' EXIT              # 退出时杀死所有子进程

# 窗口大小变化
trap 'echo "终端大小: $(tput cols)x$(tput lines)"' SIGWINCH

# 定时任务信号
trap 'echo "超时退出"; exit 1' SIGALRM
(sleep 5; kill -ALRM $$) &
```

## 并行执行

### xargs -P

```bash
# 并行下载
cat urls.txt | xargs -P 4 -I {} curl -O {}

# 并行压缩
find . -name "*.log" -print0 | xargs -0 -P "$(nproc)" gzip

# 限制参数个数
seq 1 100 | xargs -P 10 -n 10 echo
```

### GNU parallel

```bash
# 基本用法
parallel echo ::: 1 2 3 4

# 并行处理文件
parallel -j 4 gzip ::: *.log

# 远程执行
parallel -S server1,server2 --transfer --return {}.out 'analyze {}' ::: data_*.txt

# 进度条
parallel --bar wc -l ::: *.md
```

### background + wait

```bash
# 批量后台执行
for url in $(cat urls.txt); do
    (curl -s "$url" > "out/$(basename "$url")") &
done
wait
echo "全部下载完成"

# 限制并行数
max_jobs=4
count=0
for task in "${tasks[@]}"; do
    (process "$task") &
    ((count++))
    if [ $count -ge $max_jobs ]; then
        wait -n
        ((count--))
    fi
done
wait
```

## 调试技巧

### PS4 + DEBUG trap

```bash
# 设置调试提示符
export PS4='+ [${BASH_SOURCE}:${LINENO}] ${FUNCNAME[0]:+${FUNCNAME[0]}:} '

# 开启跟踪
set -x
# ... 代码 ...
set +x

# DEBUG trap — 每条命令执行前触发
trap 'echo "执行: $BASH_COMMAND" >&2' DEBUG

# 调试函数调用栈
dump_stack() {
    local i=0
    while caller $i; do
        ((i++))
    done
}
trap 'dump_stack' ERR

# 条件断点
debug_mode=false
trap 'if $debug_mode; then echo "断点: $LINENO: $BASH_COMMAND"; read -p "继续?"; fi' DEBUG
```

### bash -x 执行

```bash
# 整体调试
bash -x script.sh

# 部分调试（set -x / set +x）
set -x
# 要调试的代码
set +x

# 调试输出到文件
exec 5> debug.log
BASH_XTRACEFD=5
set -x
# ... 代码 ...
set +x
exec 5>&-
```

## Bash 安全编程

### set -euo pipefail 详解

```bash
# 严格模式
set -euo pipefail

# set -e  : 命令失败立即退出（exit code ≠ 0）
# set -u  : 使用未定义变量时报错
# set -o pipefail : 管道中任一命令失败，整体视为失败
# IFS=$'\n\t' : 仅以换行和 Tab 分隔

# 需要容忍失败的场景
set +e
command_that_might_fail
result=$?
set -e

# 或使用 || true
command_that_might_fail || true

# 可选参数检查
if [[ -z "${ENV_VAR:-}" ]]; then
    echo "ENV_VAR 未设置"
    exit 1
fi
```

### 防注入

```bash
# 危险：变量注入
# rm -rf "$USER_INPUT"   # 如果 USER_INPUT="~ /" 则灾难

# 安全做法
# 1. 使用 [[ ]] 而非 [ ]
# 2. 始终对变量用双引号
# 3. 验证输入格式
validate_input() {
    local input=$1
    if [[ ! "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        echo "非法输入: $input"
        exit 1
    fi
}

# 4. read -r 避免反斜杠转义
while IFS= read -r line; do
    echo "$line"
done < input.txt

# 5. eval 绝不使用
# eval "$command"   # 绝不！

# 6. 临时文件安全
tempfile=$(mktemp) || exit 1
trap 'rm -f "$tempfile"' EXIT
```

## 性能优化

### 避免 fork

```bash
# 慢：每次 fork 一个子进程
result=$(echo "$var" | sed 's/foo/bar/')

# 快：使用 Bash builtin
result="${var//foo/bar}"

# 慢：grep 判断
if echo "$str" | grep -q "pattern"; then

# 快：使用 [[ ]]
if [[ "$str" =~ pattern ]]; then

# 慢：外部 wc
count=$(wc -l < file.txt)

# 快：使用 read 循环
count=0
while IFS= read -r; do ((count++)); done < file.txt
```

### 使用 builtin

```bash
# 推荐 builtin 替代外部命令
# echo/printf   → 内置
# read          → 内置
# test/[        → 内置
# source/.      → 内置
# local/declare → 内置
# let/(( ))     → 内置
# type          → 内置（而非 which/command -v）

# 字符串操作全部用内置
# ${#str}       → 长度
# ${str:pos:len} → 切片
# ${str/pat/repl} → 替换
# ${str#pat}    → 删除前缀

# 算术运算用 (( ))
((sum = a + b))
((count++))

# 避免管道，使用进程替换
# 慢：echo "$data" | while read ...
# 快：while read ...; do done <<< "$data"
```

### 其他优化

```bash
# 使用局部变量（local/declare）
myfunc() {
    local var="value"   # 避免污染全局作用域
}

# 数组操作比字符串分割快
IFS=',' read -ra parts <<< "$csv_line"

# 提前 return 减少执行路径
myfunc() {
    [[ -z "$1" ]] && return 1
    # 主要逻辑
}

# 使用 mapfile 读取文件
mapfile -t lines < file.txt         # 比 while read 快
for line in "${lines[@]}"; do
    echo "$line"
done
```

# Bash 基础语法

## 基本命令

### 文件操作

```sh
pwd                      # 当前目录
ls -la                   # 列出文件（含隐藏文件）
ls -lh                   # 人类可读大小
cd /path/to/dir          # 切换目录
cd ~                     # 回家目录
cd -                     # 回到上一个目录

cp source.txt dest.txt   # 复制文件
cp -r src/ dest/         # 复制目录
cp -a src/ dest/         # 归档复制（保留权限、链接）
mv old.txt new.txt       # 重命名/移动
rm file.txt              # 删除文件
rm -rf dir/              # 递归强制删除目录
mkdir newdir             # 创建目录
mkdir -p a/b/c           # 创建多级目录
touch file.txt           # 创建空文件/更新时间戳
ln -s target link        # 创建软链接
ln target link           # 创建硬链接
stat file.txt            # 查看文件元信息
realpath file.txt        # 获取绝对路径
```

### 查看文件

```sh
cat file.txt             # 显示全部内容
cat -n file.txt          # 显示行号
less file.txt            # 分页查看（空格翻页，q 退出）
more file.txt            # 简单分页
head -n 10 file.txt      # 前 10 行
tail -n 10 file.txt      # 后 10 行
tail -f log.txt          # 实时跟踪文件追加
tail -F log.txt          # 跟踪文件（支持轮转）
nl file.txt              # 带行号输出
od -c file.txt           # 八进制/字符查看
xxd file.txt             # 十六进制查看
wc -l file.txt           # 行数统计
wc -w file.txt           # 单词数
wc -c file.txt           # 字节数
```

### 查找

```sh
find . -name "*.md"                    # 按文件名查找
find . -type f -size +1M               # 大于 1M 的文件
find . -mtime -7                       # 7 天内修改的文件
find . -type f -empty                  # 空文件
find . -perm 644                       # 按权限查找
find . -exec rm {} \;                  # 对结果执行命令

grep "pattern" file.txt                # 搜索文本
grep -r "pattern" ./                   # 递归搜索
grep -i "pattern" file.txt             # 忽略大小写
grep -rn "pattern" --include="*.ts"    # 指定文件类型
grep -c "pattern" file.txt             # 统计匹配行数
grep -v "pattern" file.txt             # 反向匹配
grep -A 3 -B 2 "error" log.txt         # 上下文行
```

### 权限

```sh
chmod +x script.sh         # 添加执行权限
chmod 755 script.sh        # rwxr-xr-x
chmod -R 644 dir/          # 递归设置文件权限
chown user:group file.txt  # 修改所有者
chgrp group file.txt       # 修改组

# 权限数字
# r=4, w=2, x=1
# 7=r+w+x, 6=r+w, 5=r+x, 4=r
```

::: tip 权限速记
- 权限位分 **用户(u) / 组(g) / 其他(o)** 三组，每组由 r(4)+w(2)+x(1) 相加。例如 `755` = 用户 rwx、组 r-x、其他 r-x。
- 对**脚本/可执行文件**需 `x` 位；对**目录**，`x` 表示可进入（cd），`r` 表示可列目录，`w` 表示可增删文件。
- 切勿对目录随意 `chmod -R 777`，这等于对所有用户开放读写执行，存在严重安全隐患。
:::

### 进程管理

```sh
ps aux                     # 查看所有进程
ps aux | grep nginx        # 查找特定进程
ps -ef --forest            # 树形显示进程
top                        # 实时进程监控
htop                       # 增强版 top
kill PID                   # 终止进程
kill -9 PID                # 强制终止
kill -15 PID               # 优雅终止
pkill process_name         # 按名称终止
pgrep process_name         # 按名称查找 PID

jobs                       # 查看后台任务
bg %1                      # 后台运行
fg %1                      # 前台运行
nohup command &            # 免挂起执行
```

### 网络

```sh
curl https://api.example.com           # HTTP 请求
curl -X POST -d '{"key":"value"}' -H "Content-Type: application/json" URL
curl -o file.zip https://example.com/file.zip  # 下载保存
curl -sS https://api.example.com       # 静默模式（带错误）
wget https://example.com/file.zip      # 下载文件
wget -c https://example.com/file.zip   # 断点续传
ping -c 4 google.com                   # 网络连通测试（4 次）
ss -tlnp                               # 查看监听端口
ss -tulnp                              # TCP + UDP 监听
netstat -an | grep LISTEN              # 查看端口
nc -zv host 80                         # 端口扫描
ifconfig                               # 网络接口信息
ip addr                                # 现代版 ifconfig
```

## Shell 脚本

### 脚本基础

```bash
#!/bin/bash
# 第一行：Shebang，指定解释器

# 注释以 # 开头

echo "Hello, World!"
```

::: tip 关键记忆点
- **Shebang（`#!`）** 告诉系统用哪个解释器运行脚本；`#!/bin/bash` 与 `#!/usr/bin/env bash` 的区别在于后者按 `PATH` 查找，可移植性更好。
- 脚本需有**执行权限**才能 `./script.sh` 直接运行（`chmod +x`）；否则只能用 `bash script.sh` 调用。
- Bash 与 `sh`（POSIX）不完全兼容，`#!/bin/sh` 下应使用 POSIX 写法，避免 Bash 专有语法。
- 完整的内建命令、参数展开与语法细节见 [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)。
:::

### 变量

```bash
# 赋值（等号两侧无空格）
NAME="World"
COUNT=42
ARRAY=("a" "b" "c")

# 使用变量
echo "Hello, $NAME!"
echo "Count: ${COUNT}"     # 花括号可选，用于明确边界

# 命令替换
FILES=$(ls)
DATE=`date +%Y-%m-%d`      # 旧语法

# 只读变量
readonly PI=3.14159

# 声明变量类型
declare -i number=10       # 整数
declare -r const="fixed"   # 只读
declare -l lower="HELLO"   # 自动转小写
declare -u upper="hello"   # 自动转大写

# 间接引用
var_name="NAME"
echo ${!var_name}          # 输出 "World"

# 特殊变量
echo $0    # 脚本名
echo $1    # 第一个参数
echo $#    # 参数个数
echo $@    # 所有参数
echo $?    # 上一个命令的退出码
echo $$    # 当前进程 PID
echo $!    # 最后一个后台进程 PID
```

::: warning 变量使用的常见坑
- **赋值等号两侧绝不能有空格**：`NAME = "x"` 会被当成「运行 NAME 命令」，这是新手最常犯的错误。
- **未加引号的变量会触发单词拆分与通配符展开**：`rm -rf $DIR/*` 在 `DIR` 为空时会变成 `rm -rf /*`。变量几乎总要用双引号包裹（`"$DIR"`）。
- 单引号 `'` 内不做任何展开（字面量）；双引号 `"` 内会展开变量与命令替换。
:::

### 字符串

```bash
str="Hello World"

# 长度
echo ${#str}               # 11

# 切片
echo ${str:0:5}            # Hello
echo ${str:6}              # World
echo ${str: -5}            # World（从末尾）

# 替换
echo ${str/World/Bash}     # Hello Bash
echo ${str//l/L}           # HeLLo WorLd（全部替换）
echo ${str/#Hello/Hi}      # 开头匹配替换
echo ${str/%World/Bash}    # 结尾匹配替换

# 删除匹配
echo ${str#Hello}          # " World"（从头删除最短匹配）
echo ${str##Hello}         # " World"（从头删除最长匹配）
echo ${str%World}          # "Hello "（从尾删除最短匹配）
echo ${str%%World}         # "Hello "（从尾删除最长匹配）

# 默认值
echo ${UNDEFINED:-"default"}  # 未定义时使用默认值
echo ${UNDEFINED:="default"}  # 未定义时赋值并返回
echo ${VAR:?"错误信息"}        # 未定义时报错退出
echo ${UNDEFINED:+"替代值"}   # 已定义时使用替代值

# 大小写转换
echo ${str,,}              # hello world（全小写）
echo ${str^^}              # HELLO WORLD（全大写）
```

### 控制流

#### 条件判断

```bash
# if 语句
if [ $COUNT -gt 10 ]; then
    echo "大于 10"
elif [ $COUNT -eq 10 ]; then
    echo "等于 10"
else
    echo "小于 10"
fi

# 文件判断
if [ -f "file.txt" ]; then echo "是文件"; fi
if [ -d "dir" ]; then echo "是目录"; fi
if [ -e "path" ]; then echo "存在"; fi
if [ -s "file" ]; then echo "非空"; fi
if [ -r "file" ]; then echo "可读"; fi
if [ -w "file" ]; then echo "可写"; fi
if [ -x "file" ]; then echo "可执行"; fi
if [ -L "link" ]; then echo "是符号链接"; fi
if [ -O "file" ]; then echo "当前用户所有"; fi
if [ -G "file" ]; then echo "当前用户组所有"; fi

# 字符串判断
if [ -z "$str" ]; then echo "空字符串"; fi
if [ -n "$str" ]; then echo "非空"; fi
if [ "$str1" = "$str2" ]; then echo "相等"; fi
if [ "$str1" != "$str2" ]; then echo "不等"; fi

# 数字比较
# -eq, -ne, -gt, -ge, -lt, -le

# 逻辑组合
if [ -f "file" ] && [ -r "file" ]; then echo "可读文件"; fi
if [ -d "dir" ] || [ -L "link" ]; then echo "目录或链接"; fi

# [[ ... ]] 增强测试（推荐）
if [[ "$str" == *.txt ]]; then echo "是 txt 文件"; fi
if [[ "$str" =~ ^Hello ]]; then echo "以 Hello 开头"; fi
if [[ -v VAR ]]; then echo "变量已定义"; fi

# case 语句
case "$OS" in
    linux)
        echo "Linux"
        ;;
    darwin|macos)
        echo "macOS"
        ;;
    *)
        echo "其他"
        ;;
esac
```

#### 循环

```bash
# for 循环（列表）
for item in a b c d; do
    echo $item
done

# for 循环（范围）
for i in {1..5}; do
    echo $i
done

# for 循环（步进）
for i in {1..10..2}; do
    echo $i
done

# for 循环（C 风格）
for ((i = 0; i < 5; i++)); do
    echo $i
done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo $count
    ((count++))
done

# until 循环
count=0
until [ $count -ge 5 ]; do
    echo $count
    ((count++))
done

# 读取文件
while IFS= read -r line; do
    echo $line
done < file.txt

# select 菜单
select opt in "Start" "Stop" "Exit"; do
    case $opt in
        Start) echo "启动" ;;
        Stop) echo "停止" ;;
        Exit) break ;;
    esac
done

# 循环控制
for i in {1..10}; do
    if [ $i -eq 5 ]; then continue; fi
    if [ $i -eq 8 ]; then break; fi
    echo $i
done
```

### 函数

```bash
# 定义函数
function greet() {
    local name=$1           # local 声明局部变量
    echo "Hello, $name!"
}

# 更简洁的写法
greet() {
    echo "Hello, $1!"
    return 0                # 返回值（0-255）
}

# 调用
greet "Alice"

# 函数返回值
sum() {
    local total=$(($1 + $2))
    echo $total             # 通过 stdout 返回
}
result=$(sum 3 4)
echo "Sum: $result"

# 传递数组
print_array() {
    local arr=("$@")
    for item in "${arr[@]}"; do
        echo "$item"
    done
}
my_arr=("a" "b" "c")
print_array "${my_arr[@]}"
```

### 输入与输出

```bash
# 读取输入
read -p "请输入名字: " name
read -s -p "请输入密码: " password  # -s 隐藏输入
read -t 5 -p "5 秒内输入: " input  # -t 超时
read -n 1 -p "按任意键继续" key    # -n 读取 N 个字符

# 重定向
command > file.txt          # 标准输出到文件（覆盖）
command >> file.txt         # 追加
command 2> error.log        # 错误输出
command 2>&1                # 合并到标准输出
command &> output.log       # 所有输出
command < input.txt         # 从文件读取输入
command1 | command2         # 管道

# 文件描述符
exec 3> file.txt            # 打开 fd 3 写入
echo "test" >&3
exec 3>&-                   # 关闭 fd 3

# Here Document
cat << EOF > config.txt
key=value
name=test
EOF

# Here String
grep "pattern" <<< "$variable"
```

### 常用技巧

```bash
# 循环中处理文件
for file in *.md; do
    echo "处理 $file"
    wc -l "$file"
done

# 并行执行
command1 &
command2 &
wait
echo "全部完成"

# 陷阱（清理）
cleanup() {
    rm -f /tmp/tempfile
    echo "已清理"
}
trap cleanup EXIT

# 调试
set -x    # 开启调试（打印每条命令）
set +x    # 关闭调试
set -e    # 出错时退出
set -u    # 使用未定义变量时报错

# 行数统计
find . -name "*.ts" -exec wc -l {} + | tail -1

# 计算执行时间
start=$(date +%s%N)
# ... commands ...
end=$(date +%s%N)
echo "耗时: $(( (end - start) / 1000000 )) ms"

## 官方文档与延伸阅读

- **官方手册**：[GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- **POSIX Shell 规范**：[POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- **编码规范**：[Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- **静态检查与格式化**：[ShellCheck](https://www.shellcheck.net/) · [shfmt](https://github.com/mvdan/sh)
- **测试框架**：[Bats-core](https://bats-core.readthedocs.io/en/stable/)
- **GNU 核心工具**：[Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html) · [sed](https://www.gnu.org/software/sed/manual/sed.html) · [awk](https://www.gnu.org/software/gawk/manual/gawk.html)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。
```

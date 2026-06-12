# Bash 教程

Bash（Bourne Again Shell）是 Linux 和 macOS 上使用最广泛的命令行 Shell，也是编写自动化脚本的首选语言。

## 基本命令

### 文件操作

```sh
pwd                      # 当前目录
ls -la                   # 列出文件（含隐藏文件）
cd /path/to/dir          # 切换目录
cd ~                     # 回家目录
cd -                     # 回到上一个目录

cp source.txt dest.txt   # 复制文件
cp -r src/ dest/         # 复制目录
mv old.txt new.txt       # 重命名/移动
rm file.txt              # 删除文件
rm -rf dir/              # 递归强制删除目录
mkdir newdir             # 创建目录
mkdir -p a/b/c           # 创建多级目录
touch file.txt           # 创建空文件/更新时间戳
```

### 查看文件

```sh
cat file.txt             # 显示全部内容
less file.txt            # 分页查看（空格翻页，q 退出）
head -n 10 file.txt      # 前 10 行
tail -n 10 file.txt      # 后 10 行
tail -f log.txt          # 实时跟踪文件追加
wc -l file.txt           # 行数统计
wc -w file.txt           # 单词数
```

### 查找

```sh
find . -name "*.md"                    # 按文件名查找
find . -type f -size +1M               # 大于 1M 的文件
find . -mtime -7                       # 7 天内修改的文件

grep "pattern" file.txt                # 搜索文本
grep -r "pattern" ./                   # 递归搜索
grep -i "pattern" file.txt             # 忽略大小写
grep -rn "pattern" --include="*.ts"    # 指定文件类型
```

### 权限

```sh
chmod +x script.sh         # 添加执行权限
chmod 755 script.sh        # rwxr-xr-x
chmod -R 644 dir/          # 递归设置文件权限
chown user:group file.txt  # 修改所有者

# 权限数字
# r=4, w=2, x=1
# 7=r+w+x, 6=r+w, 5=r+x, 4=r
```

### 进程管理

```sh
ps aux                     # 查看所有进程
ps aux | grep nginx        # 查找特定进程
top                        # 实时进程监控
htop                       # 增强版 top
kill PID                   # 终止进程
kill -9 PID                # 强制终止
pkill process_name         # 按名称终止
```

### 网络

```sh
curl https://api.example.com           # HTTP 请求
curl -X POST -d '{"key":"value"}' -H "Content-Type: application/json" URL
wget https://example.com/file.zip      # 下载文件
ping google.com                        # 网络连通测试
ss -tlnp                               # 查看监听端口
netstat -an | grep LISTEN              # 查看端口
ifconfig                               # 网络接口信息
```

## Shell 脚本

### 脚本基础

```bash
#!/bin/bash
# 第一行：Shebang，指定解释器

# 注释以 # 开头

echo "Hello, World!"
```

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

# 特殊变量
echo $0    # 脚本名
echo $1    # 第一个参数
echo $#    # 参数个数
echo $@    # 所有参数
echo $?    # 上一个命令的退出码
echo $$    # 当前进程 PID
```

### 字符串

```bash
str="Hello World"

# 长度
echo ${#str}               # 11

# 切片
echo ${str:0:5}            # Hello
echo ${str:6}              # World

# 替换
echo ${str/World/Bash}     # Hello Bash
echo ${str//l/L}           # HeLLo WorLd（全部替换）

# 默认值
echo ${UNDEFINED:-"default"}  # 未定义时使用默认值
echo ${UNDEFINED:="default"}  # 未定义时赋值并返回
```

## 控制流

### 条件判断

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
```

### 循环

```bash
# for 循环（列表）
for item in a b c d; do
    echo $item
done

# for 循环（范围）
for i in {1..5}; do
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

# 读取文件
while IFS= read -r line; do
    echo $line
done < file.txt
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
```

## 输入与输出

```bash
# 读取输入
read -p "请输入名字: " name
read -s -p "请输入密码: " password  # -s 隐藏输入
read -t 5 -p "5 秒内输入: " input  # -t 超时

# 重定向
command > file.txt          # 标准输出到文件（覆盖）
command >> file.txt         # 追加
command 2> error.log        # 错误输出
command &> output.log       # 所有输出
command < input.txt         # 从文件读取输入
command1 | command2         # 管道

# Here Document
cat << EOF > config.txt
key=value
name=test
EOF
```

## 常用技巧

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
```

# 实战项目：端口扫描器

用 Python 构建一个支持并发扫描和服务识别的端口扫描器。

## 参数解析

```python
import argparse
import socket
import concurrent.futures
import sys
from datetime import datetime

def parse_args():
    parser = argparse.ArgumentParser(
        description="简单端口扫描器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例：
  python scanner.py 192.168.1.1 -p 22,80,443
  python scanner.py scanme.nmap.org -p 1-1000 -t 50
  python scanner.py 10.0.0.1 -p 80,443,8080 --service
        """
    )
    parser.add_argument("target", help="目标 IP 地址或域名")
    parser.add_argument("-p", "--ports", default="1-1024",
                        help="端口范围，如 22,80,443 或 1-1000（默认 1-1024）")
    parser.add_argument("-t", "--threads", type=int, default=50,
                        help="并发线程数（默认 50）")
    parser.add_argument("--timeout", type=float, default=1.0,
                        help="连接超时秒数（默认 1.0）")
    parser.add_argument("--service", action="store_true",
                        help="启用服务识别")
    return parser.parse_args()
```

## 端口解析

```python
def parse_ports(port_str):
    """解析端口字符串为列表"""
    ports = set()
    for part in port_str.split(","):
        if "-" in part:
            start, end = part.split("-")
            ports.update(range(int(start), int(end) + 1))
        else:
            ports.add(int(part))
    return sorted(ports)
```

## TCP Connect 扫描

```python
def scan_port(target, port, timeout=1.0):
    """TCP connect 扫描单个端口"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    result = sock.connect_ex((target, port))
    sock.close()
    return port, result == 0

def get_service_name(port, protocol="tcp"):
    """获取常见服务名称"""
    try:
        return socket.getservbyport(port, protocol)
    except OSError:
        return "unknown"
```

## 并发扫描

```python
def scan_ports(target, ports, threads=50, timeout=1.0, service=False):
    """使用线程池并发扫描端口"""
    open_ports = []
    total = len(ports)
    start_time = datetime.now()

    print(f"目标: {target} ({socket.gethostbyname(target)})")
    print(f"端口范围: {ports[0]}-{ports[-1]} ({total} 个端口)")
    print(f"扫描开始: {start_time.strftime('%H:%M:%S')}")
    print("-" * 50)

    with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
        future_to_port = {
            executor.submit(scan_port, target, port, timeout): port
            for port in ports
        }
        completed = 0
        for future in concurrent.futures.as_completed(future_to_port):
            completed += 1
            port, is_open = future.result()
            if is_open:
                svc = get_service_name(port) if service else ""
                open_ports.append((port, svc))
                svc_info = f" ({svc})" if svc else ""
                print(f"  ✓ 端口 {port}/tcp 开放{svc_info}")

            # 进度显示（每 10% 或每 100 个打印一次）
            if completed % max(1, total // 10, 100) == 0:
                pct = completed * 100 // total
                print(f"  进度: {pct}% ({completed}/{total})", end="\r", flush=True)

    elapsed = (datetime.now() - start_time).total_seconds()
    print(f"\n扫描完成: {len(open_ports)} 个开放端口（耗时 {elapsed:.1f} 秒）")
    return open_ports
```

## 结果输出

```python
def output_results(target, open_ports, filename=None):
    """格式化输出扫描结果"""
    lines = [
        f"端口扫描结果 - {target}",
        f"扫描时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "-" * 50,
        f"{'端口':<10} {'状态':<8} {'服务':<20}",
        "-" * 50,
    ]
    for port, svc in open_ports:
        lines.append(f"{port}/tcp{'':<4} open{'':<5} {svc:<20}")

    output = "\n".join(lines)
    if filename:
        with open(filename, "w") as f:
            f.write(output)
        print(f"结果已保存到: {filename}")
    else:
        print("\n" + output)
```

## 主函数

```python
def main():
    args = parse_args()

    try:
        target_ip = socket.gethostbyname(args.target)
    except socket.gaierror:
        print(f"错误: 无法解析目标 {args.target}")
        sys.exit(1)

    ports = parse_ports(args.ports)
    if not ports:
        print("错误: 未指定有效端口")
        sys.exit(1)

    if args.ports and len(ports) > 65535:
        ports = [p for p in ports if 1 <= p <= 65535]

    try:
        open_ports = scan_ports(target_ip, ports, args.threads,
                                args.timeout, args.service)
        output_results(args.target, open_ports)
    except KeyboardInterrupt:
        print("\n扫描被用户中断")
        sys.exit(0)
    except Exception as e:
        print(f"扫描出错: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

## 安全使用说明

1. **合法授权**：仅在获得明确授权的系统上使用，未经授权扫描他人系统违法
2. **速率控制**：过快的并发扫描可能被 IDS/IPS 检测或触发 DoS 防护
3. **日志记录**：生产环境扫描应记录操作日志，便于审计
4. **VPN 环境**：跨网络扫描需注意网络边界安全策略
5. **替代方案**：生产环境推荐使用 nmap、masscan 等成熟工具

```sh
# 等效的 nmap 命令
nmap -sT -p 1-1024 --open -T4 scanme.nmap.org
masscan 192.168.1.0/24 -p80,443 --rate=1000
```

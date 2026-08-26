# 网络安全进阶

## Web 安全深入

### SSRF（服务端请求伪造）

攻击者利用服务端发起未预期的网络请求，访问内部系统。

```python
# ❌ 危险：直接使用用户输入的 URL
import requests
url = request.GET.get('url')
resp = requests.get(url)  # 可能指向内部网络

# ✅ 防护：白名单 + URL 解析验证
from urllib.parse import urlparse

ALLOWED_DOMAINS = {'api.example.com', 'cdn.example.com'}

def safe_fetch(user_url):
    parsed = urlparse(user_url)
    if parsed.hostname not in ALLOWED_DOMAINS:
        raise ValueError("URL 不在白名单中")
    # 额外检查：禁止私有 IP 段
    return requests.get(user_url, timeout=5)
```

### RCE（远程代码执行）

攻击者通过漏洞在目标服务器上执行任意命令。

```python
# ❌ 危险：直接拼接用户输入到系统命令
import os
user_input = request.GET.get('cmd')
os.system(f"ping {user_input}")  # ping ; rm -rf /

# ✅ 安全：使用专用库而非系统命令
import subprocess
subprocess.run(["ping", "-c", "1", sanitized_host], capture_output=True)

# 尽量避免 eval / exec / os.system
```

### XXE（XML 外部实体注入）

攻击者利用 XML 解析器加载外部实体，导致文件读取或 SSRF。

```python
# ❌ 危险：允许外部实体
import xml.etree.ElementTree as ET
tree = ET.parse(xml_input)  # 默认不解析外部实体，但 lxml 默认允许

# ✅ 安全：禁用外部实体
from lxml import etree
parser = etree.XMLParser(resolve_entities=False, no_network=True)
tree = etree.parse(xml_input, parser)
```

### 反序列化漏洞

攻击者通过恶意序列化数据触发任意代码执行。

```python
# ❌ 危险：不安全的反序列化
import pickle
data = base64.b64decode(user_input)
obj = pickle.loads(data)  # 可能执行任意代码

# ✅ 安全：使用 JSON 等安全格式
import json
obj = json.loads(user_input)

# Java 反序列化防护
// 使用白名单过滤
// ObjectInputFilter.Config.setSerialFilter(filter)
```

## Active Directory 安全

```
Kerberos 认证流程：
1. 客户端向 KDC 请求 TGT（票据授权票据）
2. KDC 返回用用户密码哈希加密的 TGT
3. 客户端用 TGT 请求服务票据（ST）
4. KDC 返回 ST
5. 客户端用 ST 访问目标服务

常见攻击：
- Pass-the-Hash（PtH）：使用 NTLM 哈希直接认证
- Kerberoasting：请求服务票据并离线破解
- AS-REP Roasting：无预认证账户的离线破解
- DCSync：模拟域控制器同步密码哈希
- Golden Ticket：伪造 KRBTGT 票据
```

```powershell
# 安全加固
# 1. 启用 Windows Defender Credential Guard
# 2. 禁用 NTLMv1
# 3. 启用 SMB 签名
# 4. 最小化 Domain Admin 组成员
# 5. 监控 Event ID 4768（Kerberos TGT 请求）
```

## 云安全基础

### AWS IAM 最佳实践

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*",
      "Condition": {
        "IpAddress": {"aws:SourceIp": "203.0.113.0/24"}
      }
    }
  ]
}
```

- 最小权限原则：不使用 `AdministratorAccess`
- 使用 IAM Role 而非长期 Access Key
- 启用 IAM Access Analyzer
- 定期轮换密钥

### Kubernetes RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

- 禁止特权容器：`securityContext.privileged: false`
- 启用 Pod Security Admission
- 使用 NetworkPolicy 隔离工作负载
- 定期扫描镜像漏洞（Trivy / Grype）

### 容器逃逸防护

```yaml
# 安全的容器配置
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  capabilities:
    drop: ["ALL"]
  readOnlyRootFilesystem: true
  seccompProfile:
    type: RuntimeDefault
```

## 零信任架构

核心原则：永不信任，始终验证。

```
BeyondCorp 模型：
用户/设备 → 信任评估 → 动态访问策略 → 资源

关键组件：
- mTLS（双向 TLS）：服务间通信加密与互认
- IAM：持续身份验证与授权
- 微隔离：东西向流量控制
- 持续监控：行为分析与异常检测
```

### mTLS 配置

```yaml
# Istio mTLS 配置
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT  # 强制 mTLS
```

## 社会工程学攻击与防范

```
常见手段：
- 钓鱼邮件：伪造发件人、紧急话术、恶意附件/链接
- 鱼叉式钓鱼：针对特定目标定制化攻击
-  pretexting（ pretexting）：虚构场景骗取信息
- 尾随（Tailgating）：跟随授权人员进入受限区域
- 诱饵（Baiting）：使用恶意 USB 等物理诱饵

防范：
- 安全意识培训
- 多因素认证（MFA）
- DMARC / SPF / DKIM 邮件验证
- 不插来历不明的 USB 设备
- 报告可疑行为
```

## 供应链安全

### SLSA（Supply-chain Levels for Software Artifacts）

```
SLSA Level 1：构建流程有文档记录
SLSA Level 2：构建过程有版本控制 + 签名
SLSA Level 3：隔离构建环境 + 无外部影响
SLSA Level 4：可复现构建 + 双人审查
```

### SBOM（Software Bill of Materials）

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "components": [
    {
      "name": "log4j-core",
      "version": "2.14.0",
      "type": "library",
      "purl": "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.0"
    }
  ]
}
```

```sh
# 生成 SBOM
cyclonedx-py requirements.txt -o bom.json
syft packages . -o cyclonedx-json > bom.json

# 审计依赖
grype bom.json
trivy sbom bom.json
```

## DevSecOps 实践

```
SAST（静态安全测试）— 源代码分析
  SonarQube, Semgrep, CodeQL
  在 IDE / PR 阶段运行

DAST（动态安全测试）— 运行时分析
  OWASP ZAP, Burp Suite
  在 staging 环境运行

IAST（交互式安全测试）— 结合 SAST + DAST
  Contrast Security, HCL AppScan
  代理插桩，实时分析

RASP（运行时自我保护）— 内嵌防护
  Contrast Protect, Sqreen
  嵌入应用运行时拦截攻击
```

### CI/CD 集成示例

```yaml
# GitHub Actions 安全扫描
name: Security Scan
on: [push, pull_request]
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: p/default
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
```

## 安全自动化（SOAR）

SOAR 平台将安全运营中的告警、分析和响应自动化。

```
Playbook 示例：SSH 暴力破解响应
1. 触发：SIEM 检测到 5 分钟内 10 次 SSH 认证失败
2. 调查：查询威胁情报，确认来源 IP
3. 响应：防火墙自动封禁来源 IP（iptables / AWS WAF）
4. 通知：通过 Slack / PagerDuty 通知安全团队
5. 记录：生成事件工单（Jira / ServiceNow）
```

```python
# 自动化封禁脚本示例
import subprocess
import requests

BAN_THRESHOLD = 10
SIEM_QUERY = "https://siem.internal/api/alerts?type=ssh_brute"

def auto_block():
    resp = requests.get(SIEM_QUERY, headers={"Authorization": "Bearer ..."})
    alerts = resp.json()
    ip_counts = {}
    for alert in alerts:
        ip = alert["source_ip"]
        ip_counts[ip] = ip_counts.get(ip, 0) + 1
    for ip, count in ip_counts.items():
        if count >= BAN_THRESHOLD:
            subprocess.run(["iptables", "-A", "INPUT", "-s", ip, "-j", "DROP"])
            requests.post("https://hooks.slack.com/services/xxx",
                          json={"text": f"封禁 {ip}（{count} 次失败）"})
```

## 官方文档与延伸阅读

- **标准与框架**：[OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) · [NIST SP 800-207（零信任架构）](https://csrc.nist.gov/pubs/sp/800/207/final)
- **Web 安全**：[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- **漏洞数据库**：[CVE](https://www.cve.org/) · [CWE](https://cwe.mitre.org/) · [NVD](https://nvd.nist.gov/) · [MITRE ATT&CK](https://attack.mitre.org/)
- **云安全**：[AWS IAM 文档](https://docs.aws.amazon.com/IAM/) · [K8s RBAC](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/)
- **零信任**：[BeyondCorp（Google）](https://cloud.google.com/beyondcorp)
- **供应链安全**：[SLSA](https://slsa.dev/spec/v1.0/) · [SBOM 指南](https://www.cisa.gov/sbom) · [Sigstore](https://docs.sigstore.dev/)
- **认证协议**：[OAuth 2.0 RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html) · [OAuth 2.0 安全最佳实践 RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) · [WebAuthn](https://www.w3.org/TR/webauthn-3/)
- **加密学**：[NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- **训练平台**：[Hack The Box](https://www.hackthebox.com/) · [TryHackMe](https://tryhackme.com/)
- **工具**：[OWASP ZAP](https://www.zaproxy.org/) · [Burp Suite](https://portswigger.net/burp) · [Metasploit](https://docs.metasploit.com/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

# 网络安全基础

网络安全涉及保护系统、网络、程序和数据免受攻击、损坏或未授权访问。

## 核心原则：CIA 三元组

| 原则 | 说明 | 措施 |
|------|------|------|
| **机密性** | 只有授权方可以访问信息 | 加密、访问控制 |
| **完整性** | 数据未被篡改 | 哈希、数字签名、校验 |
| **可用性** | 系统和数据可按需访问 | 冗余、备份、DDoS 防护 |

## Web 常见攻击与防护

常见攻击类型可对照 [OWASP Top 10](https://owasp.org/www-project-top-ten/) 了解风险趋势。

### XSS（跨站脚本攻击）

攻击者将恶意脚本注入到网页中，在用户浏览器中执行。

**类型**：
- 存储型 XSS：恶意脚本存储在服务器（如评论区）
- 反射型 XSS：恶意脚本在 URL 参数中
- DOM 型 XSS：通过客户端 JavaScript 动态修改 DOM

::: tip 关键记忆点
- XSS 的本质是「**把不可信输入当成代码执行**」。防护核心是两点：对输出做上下文相关的编码（HTML 编码、JS 编码、URL 编码各不相同），以及用 CSP 限制脚本来源。
- 类型区别在**恶意脚本的存放位置**：存储型在数据库、反射型在 URL、DOM 型在客户端 DOM 改写，危害依次递减。
- `innerHTML` / `eval` 是高危 API，应优先用 `textContent`、框架的插值语法（默认转义）替代。
:::

**防护**：

```js
// 1. 输出编码
function escapeHtml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// 2. Content Security Policy
// HTML 头或 meta 标签
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-随机值'

// 3. 避免使用危险的 API
// ❌ innerHTML, document.write, eval
// ✅ textContent, createElement, setAttribute
```

### SQL 注入

攻击者通过输入恶意的 SQL 语句操控数据库查询。

::: tip 关键点
- **根因**是「把用户输入直接拼接到 SQL 字符串中」，导致输入改变了原语句的语法结构（如 `' OR '1'='1` 闭合了引号并追加恒真条件）。
- **唯一可靠的修复**是使用 **参数化查询（预编译语句）**，让用户输入永远作为「数据」而非「代码」传递。ORM 框架的查询构造器通常默认安全。
- 不要依赖 `addslashes` 或简单的黑名单转义，它们存在绕过风险。
:::

```sql
-- ❌ 危险：字符串拼接
-- 输入 ' OR '1'='1
SELECT * FROM users WHERE email = '' OR '1'='1' AND password = 'x'

-- ✅ 安全：参数化查询
-- Node.js (mysql2)
const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])

-- ✅ Python
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

-- ✅ Java (JDBC)
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
stmt.setString(1, email);
```

### CSRF（跨站请求伪造）

攻击者诱导用户在已登录的情况下执行非预期的操作。

::: tip 关键点
- CSRF 利用的是**浏览器自动携带 Cookie** 的特性，攻击者无需知道会话内容，只需「借用户的身份发请求」。
- 防护以 **CSRF Token**（服务器校验请求来自本站表单）+ **SameSite Cookie**（限制跨站发送 Cookie）为主。
- 对敏感操作（转账、改密）应使用 POST + 二次确认，避免用 GET 完成写操作。
:::

**防护**：

```js
// 1. CSRF Token
// 服务器生成随机 token，嵌入表单，提交时验证
<form>
  <input type="hidden" name="_csrf" value="{{csrfToken}}">
  ...
</form>

// 2. SameSite Cookie
// Set-Cookie: session=xxx; SameSite=Strict

// 3. 验证 Referer / Origin 头
```

### 点击劫持

攻击者通过透明 iframe 覆盖诱使用户点击。

```html
<!-- 防护：设置 X-Frame-Options 头 -->
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```

## 加密

### 哈希（不可逆）

哈希将任意长度输入映射为固定长度摘要，且**不可逆、微小改动导致大幅不同**。注意：哈希 ≠ 加密。

::: tip 关键点
- **普通哈希（SHA-256）不适合存密码**：它太快，易遭彩虹表/暴力破解。密码存储必须用 **带盐的自适应哈希**（bcrypt / scrypt / Argon2），通过可调「工作因子」拖慢破解。
- 哈希常用于完整性校验（文件/签名），加密用于保密性（可逆）。不要混淆两者用途。
:::

```python
import hashlib
import bcrypt

# SHA-256（用于完整性校验，非密码存储）
hash = hashlib.sha256(b"data").hexdigest()

# bcrypt（密码存储，含盐）
password = b"my_secure_password"
salt = bcrypt.gensalt(rounds=12)      # 生成盐
hashed = bcrypt.hashpw(password, salt)
bcrypt.checkpw(password, hashed)      # True
```

### 对称加密（同一密钥）

```python
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)
encrypted = cipher.encrypt(b"敏感数据")
decrypted = cipher.decrypt(encrypted)
```

### 非对称加密（公钥/私钥）

用于 HTTPS/TLS 握手、数字签名、SSH 认证。

::: tip 关键点
- **对称加密** 用同一把密钥加解密，速度快，适合大量数据，但密钥分发困难。
- **非对称加密** 用公钥加密、私钥解密（或私钥签名、公钥验签），解决了密钥分发问题，但计算慢，常用于「协商出一把临时对称密钥」而非直接加密正文。
- 实际 HTTPS 是两者结合：非对称握手协商会话密钥，之后用对称加密传输数据。
:::

```sh
# 生成 RSA 密钥对
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

## HTTPS

```nginx
# Nginx HTTPS 配置
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

```sh
# 使用 Let's Encrypt 免费证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## 认证与授权

### JWT（JSON Web Token）

```js
import jwt from 'jsonwebtoken'

// 生成 token
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

// 验证 token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
} catch (err) {
  // token 过期或无效
}

// 安全注意事项：
// 1. 使用强密钥（至少 256 位）
// 2. 设置合理的过期时间
// 3. 不将敏感信息放入 payload
// 4. 使用 HTTPS
```

### OAuth 2.0

OAuth 2.0 是授权的行业标准协议，允许第三方应用获取有限的资源访问权限。

```
1. 用户点击"使用 Google 登录"
2. 应用跳转到 Google 授权页面
3. 用户同意授权
4. Google 回调应用，提供授权码
5. 应用用授权码换取 access_token
6. 使用 access_token 调用 Google API
```

## 基础设施安全

### SSH 安全

```sh
# 1. 禁止密码登录
# /etc/ssh/sshd_config
PasswordAuthentication no

# 2. 使用密钥认证
ssh-keygen -t ed25519 -a 100
ssh-copy-id user@server

# 3. 更改默认端口
Port 2222

# 4. 限制登录用户
AllowUsers alice bob
```

### 防火墙

```sh
# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP  # 拒绝其他所有

# ufw（Ubuntu）
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 安全开发实践

1. **最小权限原则**：只授予完成任务所需的最小权限
2. **深度防御**：多层安全防护，不依赖单点
3. **安全默认值**：安全的默认配置（如禁用调试模式）
4. **输入验证**：永远不要信任用户输入
5. **输出编码**：根据上下文对输出进行编码
6. **参数化查询**：防止 SQL 注入
7. **依赖管理**：定期更新和审计依赖
   ```sh
   npm audit
   pip-audit
   trivy fs .
   ```
8. **日志安全**：不记录密码、密钥、个人身份信息
9. **密钥管理**：使用环境变量或密钥管理服务，不硬编码
10. **安全头**：
    ```
    Strict-Transport-Security: max-age=31536000
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    X-XSS-Protection: 1; mode=block
    Content-Security-Policy: default-src 'self'
    ```

## 工具

| 工具 | 用途 |
|------|------|
| nmap | 端口扫描 |
| Wireshark | 网络流量分析 |
| Burp Suite | Web 安全测试 |
| Metasploit | 渗透测试框架 |
| OWASP ZAP | 自动化安全扫描 |
| Trivy | 容器镜像漏洞扫描 |
| HashiCorp Vault | 密钥管理 |
| Let's Encrypt | 免费 TLS 证书 |
| OpenSSL | 加密工具 |
| fail2ban | 暴力破解防护 |

## 官方文档与延伸阅读

- **标准与框架**：[OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- **Web 安全**：[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) · [PortSwigger Web Security](https://portswigger.net/web-security)
- **加密学**：[NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- **漏洞数据库**：[CVE](https://cve.mitre.org/) · [CWE](https://cwe.mitre.org/) · [NVD](https://nvd.nist.gov/)
- **训练平台**：[Hack The Box](https://www.hackthebox.com/) · [TryHackMe](https://tryhackme.com/)
- **工具**：[OWASP ZAP](https://www.zaproxy.org/) · [Burp Suite](https://portswigger.net/burp) · [Metasploit](https://docs.metasploit.com/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

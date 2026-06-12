# 网络安全教程

网络安全涉及保护系统、网络、程序和数据免受攻击、损坏或未授权访问。

## 核心原则：CIA 三元组

| 原则 | 说明 | 措施 |
|------|------|------|
| **机密性** | 只有授权方可以访问信息 | 加密、访问控制 |
| **完整性** | 数据未被篡改 | 哈希、数字签名、校验 |
| **可用性** | 系统和数据可按需访问 | 冗余、备份、DDoS 防护 |

## Web 常见攻击与防护

### XSS（跨站脚本攻击）

攻击者将恶意脚本注入到网页中，在用户浏览器中执行。

**类型**：
- 存储型 XSS：恶意脚本存储在服务器（如评论区）
- 反射型 XSS：恶意脚本在 URL 参数中
- DOM 型 XSS：通过客户端 JavaScript 动态修改 DOM

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

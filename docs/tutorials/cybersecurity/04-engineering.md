# 网络安全工程实践

## 安全开发生命周期（SSDLC）

```
需求 → 设计 → 开发 → 测试 → 部署 → 运维
  │      │      │      │      │      │
  ├ 威胁建模 ─┘      │      │      │
  ├ 安全需求  ───────┘      │      │
  ├ 代码审查 ───────────────┘      │
  ├ 安全测试 ──────────────────────┘
  ├ 渗透测试 ─────────────────────────┘
  └ 持续监控 ────────────────────────────→
```

## 威胁建模（STRIDE）

| 威胁 | 说明 | 防范 |
|------|------|------|
| **S**poofing | 冒充身份 | 认证、MFA |
| **T**ampering | 篡改数据 | 签名、完整性校验 |
| **R**epudiation | 抵赖行为 | 审计日志、数字签名 |
| **I**nformation Disclosure | 信息泄露 | 加密、访问控制 |
| **D**enial of Service | 拒绝服务 | 限流、WAF |
| **E**levation of Privilege | 权限提升 | 最小权限原则 |

## API 安全设计

```js
// API 认证方式
// 1. API Key —— 简单的服务间认证
Authorization: Apikey sk-proj-xxx

// 2. JWT —— 无状态认证
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// 3. OAuth 2.0 —— 第三方授权
// Authorization Code + PKCE

// 4. mTLS —— 零信任架构
// 双向 TLS 证书验证

// API 限流（Node.js 示例）
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 100,                    // 最多 100 次
  standardHeaders: true,
  message: {
    error: 'RATE_LIMITED',
    message: '请求过于频繁，请稍后重试',
    retryAfter: '15分钟',
  },
})

// 更精细的限流（按用户）
const userLimiter = rateLimit({
  keyGenerator: (req) => req.user.id,
  windowMs: 60 * 1000,
  max: 30,
})
```

## 密钥管理

```sh
# 1. 使用环境变量（不提交到 Git）
export DATABASE_URL="postgresql://user:pass@host/db"
export JWT_SECRET="your-256-bit-secret"

# 2. 使用密钥管理服务
# AWS Secrets Manager / HashiCorp Vault / Azure Key Vault

# 3. 加密 .env 文件
# 使用 sops (SOPS)
sops -e -pgp <KEY_FP> .env > .env.encrypted
sops -d .env.encrypted > .env

# 4. CI/CD 中注入密钥
# GitHub Secrets: ${{ secrets.PRODUCTION_DATABASE_URL }}
# GitLab CI: ${PRODUCTION_DATABASE_URL}
```

## 安全审计与合规

```python
# 审计日志系统
import structlog

logger = structlog.get_logger()

class AuditLogger:
    """审计日志：记录所有敏感操作的不可变日志"""

    @staticmethod
    def log(action: str, actor: str, resource: str, details: dict = None):
        logger.info("audit", action=action, actor=actor,
                    resource=resource, details=details)

    @staticmethod
    def user_login(user_id: str, ip: str, success: bool):
        AuditLogger.log("user.login", user_id, "session",
                        {"ip": ip, "success": success})

    @staticmethod
    def data_export(user_id: str, resource: str, record_count: int):
        AuditLogger.log("data.export", user_id, resource,
                        {"records": record_count})

    @staticmethod
    def permission_change(admin_id: str, target_user: str, changes: dict):
        AuditLogger.log("permission.change", admin_id, target_user, changes)
```

## 安全头配置

```nginx
# Nginx 安全相关头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Content Security Policy
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'nonce-${request_id}' https://cdn.example.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://cdn.example.com;
    font-src 'self' https://fonts.example.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

## 渗透测试清单

- [ ] SQL 注入测试（所有输入点）
- [ ] XSS 测试（存储型、反射型、DOM 型）
- [ ] CSRF 测试
- [ ] SSRF 测试
- [ ] 文件上传漏洞
- [ ] 路径遍历
- [ ] IDOR（水平/垂直越权）
- [ ] JWT 安全问题（alg=none、弱密钥）
- [ ] 敏感信息泄露（错误信息、调试接口）
- [ ] 依赖漏洞（npm audit、trivy）
- [ ] 认证绕过
- [ ] 会话固定
- [ ] 批量分配
- [ ] Race Condition

## 合规框架

| 标准 | 适用范围 | 关键要求 |
|------|---------|---------|
| **ISO 27001** | 信息安全管理体系 | 风险评估、安全策略、持续改进 |
| **SOC 2** | 云服务提供商 | 安全性、可用性、机密性 |
| **GDPR** | 欧盟公民数据 | 数据最小化、用户删除权、明确同意 |
| **PCI DSS** | 支付卡数据 | 加密存储、访问控制、定期扫描 |
| **等级保护** | 中国信息系统 | 分级保护、安全评估 |

# 网络安全教程

本教程从基础到企业级，系统化梳理网络安全的核心知识和实践技能。

## 目录

- [网络安全基础](/tutorials/cybersecurity/01-basics) — CIA 三元组、Web 常见攻击（XSS / SQLi / CSRF / 点击劫持）、加密（哈希 / 对称 / 非对称）、HTTPS 配置、认证与授权（JWT / OAuth 2.0）、基础设施安全（SSH / 防火墙）、安全开发实践、常用工具

- [网络安全进阶](/tutorials/cybersecurity/02-advanced) — Web 安全深入（SSRF / RCE / XXE / 反序列化）、Active Directory 安全、云安全基础（AWS IAM / K8s RBAC / 容器逃逸）、零信任架构、社会工程学、供应链安全（SLSA / SBOM）、DevSecOps 实践、安全自动化（SOAR）

- [实战项目：端口扫描器](/tutorials/cybersecurity/03-project) — 用 Python 从零构建一个支持并发和服务识别的端口扫描器

- [网络安全工程实践](/tutorials/cybersecurity/04-engineering) — SSDLC、威胁建模（STRIDE）、API 安全设计、密钥管理、安全审计与合规、安全头配置、渗透测试清单、合规框架

- [网络安全生态全景](/tutorials/cybersecurity/05-ecosystem) — 安全测试工具、认证协议、密钥管理、监控告警、合规标准、培训认证

## 环境要求

- **实验平台**：首选 Kali Linux / Parrot OS，或任意 Linux 发行版；部分工具支持 Windows/macOS。
- **必要的工具**：curl、nmap、Burp Suite（社区版）、OWASP ZAP、Python 3。
- **合法实验环境**：仅在本机或已授权的靶机（如 [DVWA](https://github.com/digininja/DVWA)、[OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)）上练习，切勿针未经授权的系统。

## 前置知识

- 基础的命令行操作（可参考 [Bash 教程](/tutorials/bash/)）
- 了解 HTTP 请求/响应（方法、状态码、请求头）
- 具备基本编程概念（实战项目使用 Python）

## 快速开始

```sh
# 检查工具是否就绪
curl --version
nmap --version
python3 --version

# 启动本地靶场（Docker 一键拉起 Juice Shop）
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

## 官方文档

漏洞定义、利用细节、防护标准以下列一手资料为准。

| 类型 | 链接 |
|------|------|
| Web 风险 | [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/) |
| 验证标准 | [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) |
| 弱点/漏洞库 | [CWE](https://cwe.mitre.org/) · [CVE](https://www.cve.org/) · [NVD](https://nvd.nist.gov/) · [MITRE ATT&CK](https://attack.mitre.org/) |
| 认证与授权 | [JWT RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) · [OAuth 2.0 RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html) · [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) |
| 合规与框架 | [ISO 27001](https://www.iso.org/standard/82.html) · [NIST CSF](https://www.nist.gov/cyberframework) · [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) · [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) |
| 动手练习 | [PortSwigger Web Security Academy](https://portswigger.net/web-security) · [TryHackMe](https://tryhackme.com/) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [规范与标准](/reference/standards)。

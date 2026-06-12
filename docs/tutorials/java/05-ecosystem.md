# Java 生态全景

## Web 框架

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| Spring Boot | 约定大于配置，生态最丰富 | 企业级应用、微服务 |
| Quarkus | 启动快、内存低，支持 GraalVM | 云原生、Serverless |
| Micronaut | 编译时依赖注入，零反射 | 微服务、IoT |
| Jakarta EE | 企业级标准规范 | 大型企业系统 |

## ORM

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| Hibernate (JPA) | 全自动 ORM，标准实现 | 复杂关联、标准 JPA |
| MyBatis / MyBatis-Plus | SQL 手写控制，灵活高效 | 复杂查询、遗留数据库 |
| jOOQ | 类型安全 SQL，DSL 风格 | 需要强类型 SQL 控制 |

## 构建工具

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| Maven | XML 配置，约定目录结构 | 传统企业项目 |
| Gradle | Groovy/Kotlin DSL，增量编译 | Android、高定制构建 |

## 测试

| 工具 | 用途 | 特点 |
|------|------|------|
| JUnit 5 | 单元测试 | 平台 + 引擎架构，参数化测试 |
| Mockito | Mock 框架 | 隔离外部依赖，验证交互 |
| Testcontainers | 集成测试 | Docker 容器化管理测试依赖 |
| REST Assured | REST API 测试 | 声明式 BDD 风格 |

## 监控

| 工具 | 用途 | 特点 |
|------|------|------|
| Micrometer | 度量门面 | 与 Prometheus、Datadog 等集成 |
| Prometheus | 指标采集与存储 | 拉模式时序数据库 |
| Grafana | 可视化仪表盘 | 多数据源，丰富图表 |
| Spring Boot Actuator | 应用监控端点 | /health、/metrics、/info |

## 常用工具

| 工具 | 用途 | 特点 |
|------|------|------|
| Lombok | 消除样板代码 | @Data、@Builder、@Slf4j |
| MapStruct | 对象映射 | 编译期生成，零运行时反射 |
| Flyway | 数据库版本管理 | SQL 脚本化迁移 |
| Jackson / Gson | JSON 序列化 | 对象 ⇄ JSON |
| OpenFeign | 声明式 HTTP 客户端 | 接口注解，REST 调用 |
| Resilience4j | 容错库 | 熔断、重试、限流 |

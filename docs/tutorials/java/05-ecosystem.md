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

## 官方文档入口

| 类别 | 入口 |
|------|------|
| JDK 与语言 | [Java SE 文档](https://docs.oracle.com/en/java/javase/21/) · [Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html) · [语言规范 JLS](https://docs.oracle.com/javase/specs/) |
| Web 框架 | [Spring Boot](https://docs.spring.io/spring-boot/index.html) · [Quarkus](https://quarkus.io/guides/) · [Micronaut](https://docs.micronaut.io/latest/guide/) · [Jakarta EE](https://jakarta.ee/specifications/) |
| ORM | [Hibernate](https://hibernate.org/) · [MyBatis](https://mybatis.org/mybatis-3/zh_CN/) · [MyBatis-Plus](https://baomidou.com/) · [jOOQ](https://www.jooq.org/) |
| 构建工具 | [Maven](https://maven.apache.org/guides/) · [Gradle](https://docs.gradle.org/current/userguide/userguide.html) |
| 测试 | [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) · [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/module-summary.html) · [Testcontainers](https://java.testcontainers.org/) · [REST Assured](https://rest-assured.io/) |
| 监控/工具 | [Micrometer](https://micrometer.io/) · [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html) · [Lombok](https://projectlombok.org/) · [MapStruct](https://mapstruct.org/) · [Flyway](https://documentation.red-gate.com/flyway) · [Jackson](https://github.com/FasterXML/jackson) · [OpenFeign](https://docs.spring.io/spring-cloud-openfeign/reference/) · [Resilience4j](https://resilience4j.readme.io/) |

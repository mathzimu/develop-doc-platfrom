# Java 教程

Java 是一种面向对象的、跨平台的编程语言，遵循「一次编写，到处运行」的理念。Java 广泛应用于企业级应用、Android 开发和大数据领域。

## 环境要求

- JDK 17+（LTS，示例基于 JDK 21）
- Maven 3.8+ 或 Gradle 8+
- IDE：IntelliJ IDEA（推荐）或 VS Code + Java 扩展包

## 前置知识

- 了解基本编程概念（变量、循环、函数）
- 熟悉命令行与环境变量配置

## 内容目录

- [基础语法](/tutorials/java/01-basics) — 变量、控制流、OOP、集合、异常
- [进阶深入](/tutorials/java/02-advanced) — 并发编程、Stream、Optional、新特性
- [实战项目](/tutorials/java/03-project) — Spring Boot CRUD REST API
- [工程实践](/tutorials/java/04-engineering) — 分层架构、安全、测试、CI/CD
- [生态全景](/tutorials/java/05-ecosystem) — 框架、工具、构建工具

## 快速开始

```sh
java -version
mvn -v
mvn archetype:generate -DgroupId=com.example -DartifactId=demo -DinteractiveMode=false
```

## 官方文档

API 签名、JVM 行为、框架配置项以下列一手文档为准。

| 类型 | 链接 |
|------|------|
| JDK 文档 | [Java SE 21 文档](https://docs.oracle.com/en/java/javase/21/) |
| API 参考 | [Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html) |
| 语言与 JVM 规范 | [Java SE Specifications](https://docs.oracle.com/javase/specs/) |
| 官方学习站 | [dev.java](https://dev.java/learn/) |
| JDK 发行版 | [OpenJDK](https://openjdk.org/) · [Eclipse Temurin](https://adoptium.net/temurin/releases/) |
| 并发 | [java.util.concurrent](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html) · [虚拟线程（JEP 444）](https://openjdk.org/jeps/444) |
| 构建工具 | [Maven](https://maven.apache.org/guides/) · [Gradle](https://docs.gradle.org/current/userguide/userguide.html) |
| 应用框架 | [Spring Boot](https://docs.spring.io/spring-boot/index.html) · [Spring Framework](https://docs.spring.io/spring-framework/reference/) · [Quarkus](https://quarkus.io/guides/) · [Micronaut](https://docs.micronaut.io/latest/guide/) |
| 持久层 | [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/) · [Hibernate](https://hibernate.org/orm/documentation/) · [MyBatis](https://mybatis.org/mybatis-3/zh_CN/index.html) |
| 安全 | [Spring Security](https://docs.spring.io/spring-security/reference/) |
| 测试 | [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) · [Mockito](https://site.mockito.org/) · [Testcontainers](https://java.testcontainers.org/) |
| 代码质量 | [Checkstyle](https://checkstyle.org/) · [SpotBugs](https://spotbugs.readthedocs.io/en/stable/) |

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

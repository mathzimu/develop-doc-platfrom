# 实战项目：Spring Boot CRUD REST API

基于 Spring Boot 3 + Spring Data JPA + H2 数据库，构建完整的 User 管理 REST API。

## 项目初始化

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>user-crud</artifactId>
    <version>1.0.0</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

server:
  port: 8080
```

### Application.java

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## 实体类

```java
package com.example.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "姓名不能为空")
    @Column(nullable = false)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Builder.Default
    private Boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## Repository

```java
package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByActiveTrue();

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
```

## Service

```java
package com.example.service;

import com.example.exception.ResourceNotFoundException;
import com.example.exception.BusinessException;
import com.example.model.User;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在: " + id));
    }

    public User create(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessException("用户名已存在: " + user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("邮箱已被注册: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public User update(Long id, User updates) {
        User user = findById(id);
        user.setFullName(updates.getFullName());
        user.setEmail(updates.getEmail());
        user.setPhone(updates.getPhone());
        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    public List<User> findActiveUsers() {
        return userRepository.findByActiveTrue();
    }
}
```

## Controller

```java
package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(@RequestBody @Valid User user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody @Valid User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/active")
    public List<User> getActive() {
        return userService.findActiveUsers();
    }
}
```

## 异常处理

```java
package com.example.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

```java
package com.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("BUSINESS_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", "参数验证失败", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "服务器内部错误"));
    }
}

public record ErrorResponse(String code, String message, Object details) {
    public ErrorResponse(String code, String message) {
        this(code, message, null);
    }
}
```

## 测试

```java
package com.example.controller;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        userRepository.save(User.builder()
            .username("alice")
            .email("alice@example.com")
            .fullName("Alice")
            .build());
    }

    @Test
    void shouldReturnAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void shouldCreateUser() throws Exception {
        String json = """
            {
                "username": "bob",
                "email": "bob@example.com",
                "fullName": "Bob"
            }
            """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.username").value("bob"));
    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        mockMvc.perform(get("/api/users/999"))
            .andExpect(status().isNotFound());
    }
}
```

## 运行

```sh
# 启动
mvn spring-boot:run

# 测试 API
curl http://localhost:8080/api/users
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@test.com","fullName":"Alice"}'
curl http://localhost:8080/api/users/1
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alice Updated","email":"alice@test.com"}'
curl -X DELETE http://localhost:8080/api/users/1

# H2 控制台
open http://localhost:8080/h2-console
```

### 切换到 PostgreSQL

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/userdb
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 官方文档与延伸阅读

- **JDK 文档**：[Java SE 21 文档（Oracle）](https://docs.oracle.com/en/java/javase/21/) · [API 参考](https://docs.oracle.com/en/java/javase/21/docs/api/index.html)
- **语言规范**：[Java Language Specification](https://docs.oracle.com/javase/specs/)
- **官方学习站**：[dev.java](https://dev.java/learn/)
- **JDK 发行版**：[OpenJDK](https://openjdk.org/) · [Eclipse Temurin](https://adoptium.net/temurin/releases/)
- **构建工具**：[Maven](https://maven.apache.org/guides/) · [Gradle](https://docs.gradle.org/current/userguide/userguide.html)
- **应用框架**：[Spring Boot 官方文档](https://docs.spring.io/spring-boot/index.html) · [Spring Boot 中文指南](https://springdoc.cn/spring-boot/) · [Spring Data JPA 参考](https://docs.spring.io/spring-data/jpa/reference/)
- **持久层**：[Hibernate](https://hibernate.org/orm/documentation/) · [MyBatis](https://mybatis.org/mybatis-3/zh_CN/index.html)
- **测试**：[JUnit 5](https://junit.org/junit5/docs/current/user-guide/) · [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/module-summary.html) · [Testcontainers](https://java.testcontainers.org/)
- **数据库**：[H2 Database](https://www.h2database.com/html/main.html)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。 |

# Java 工程实践

## 分层架构

```
com.example.app/
├── Application.java          # 入口
├── config/                   # 配置类
├── controller/               # REST 控制器
├── service/                  # 业务逻辑
├── repository/               # 数据访问
├── model/                    # 实体
├── dto/                      # 传输对象
├── exception/                # 异常
├── mapper/                   # 对象映射
├── util/                     # 工具
└── aop/                      # 切面
```

## 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        List<FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> new FieldError(e.getField(), e.getDefaultMessage()))
            .toList();
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", "参数验证失败", errors));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "服务器内部错误", null));
    }
}

public record ErrorResponse(
    String code,
    String message,
    Object details
) {}
```

## Spring Boot 安全配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
            );
        return http.build();
    }
}
```

## 统一日志

```xml
<!-- logback-spring.xml -->
<configuration>
    <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeContext>false</includeContext>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="JSON"/>
    </root>

    <!-- 敏感信息脱敏 -->
    <logger name="org.hibernate.SQL" level="DEBUG"/>
    <logger name="org.springframework.security" level="WARN"/>
</configuration>
```

```java
// 使用 Slf4j
@Slf4j
@Service
public class UserService {

    public User create(User user) {
        log.info("Creating user: {}", user.getUsername());
        log.debug("User details: {}", user);
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Failed to create user: {}", user.getUsername(), e);
            throw e;
        }
    }
}
```

## MyBatis-Plus + 分页

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT * FROM users WHERE status = #{status}")
    Page<User> findByStatus(Page<User> page, @Param("status") String status);
}

@Service
public class UserService {
    public PageVO<UserDTO> listUsers(int page, int size, String search) {
        Page<User> pageResult = userMapper.selectPage(
            new Page<>(page, size),
            Wrappers.<User>lambdaQuery()
                .like(StringUtils.isNotBlank(search), User::getName, search)
                .orderByDesc(User::getCreatedAt)
        );
        return PageVO.of(pageResult, user -> modelMapper.map(user, UserDTO.class));
    }
}
```

## JUnit 5 测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUserSuccessfully() {
        User input = User.builder()
            .username("test")
            .email("test@example.com")
            .fullName("Test User")
            .build();

        when(userRepository.existsByUsername("test")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.save(any())).thenReturn(input);

        User result = userService.create(input);
        assertThat(result.getUsername()).isEqualTo("test");
    }

    @Test
    void shouldThrowWhenUsernameExists() {
        User input = User.builder().username("existing").build();
        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(BusinessException.class, () -> userService.create(input));
    }

    @ParameterizedTest
    @CsvSource({
        "a, true",
        "ab, true",
        "abc, false"
    })
    void shouldValidateUsernameLength(String username, boolean expected) {
        // ...
    }
}
```

## CI/CD 与 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: Java CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build & Test
        run: mvn clean verify

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: target/surefire-reports/
```

### Maven 发布流水线

```yaml
name: Publish to Maven Central

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          server-id: ossrh
          server-username: MAVEN_USERNAME
          server-password: MAVEN_PASSWORD
          gpg-private-key: ${{ secrets.GPG_PRIVATE_KEY }}
          gpg-passphrase: GPG_PASSPHRASE

      - name: Publish
        run: mvn clean deploy -P release
        env:
          MAVEN_USERNAME: ${{ secrets.OSSRH_USERNAME }}
          MAVEN_PASSWORD: ${{ secrets.OSSRH_TOKEN }}
          GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
```

## 官方文档

| 主题 | 链接 |
|------|------|
| 构建 | [Maven](https://maven.apache.org/guides/) · [Gradle](https://docs.gradle.org/current/userguide/userguide.html) |
| 测试 | [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) · [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/module-summary.html) · [Testcontainers](https://java.testcontainers.org/) |
| 代码质量 | [Checkstyle](https://checkstyle.org/) · [SpotBugs](https://spotbugs.readthedocs.io/en/stable/) |
| 监控 | [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html) · [Micrometer](https://micrometer.io/) · [Prometheus](https://prometheus.io/docs/) |
| CI/CD | [GitHub Actions](https://docs.github.com/zh/actions) · [Maven Central 发布](https://central.sonatype.org/) |
| 安全 | [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/) · [Snyk](https://snyk.io/) |

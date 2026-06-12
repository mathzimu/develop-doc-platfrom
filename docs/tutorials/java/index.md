# Java 教程

Java 是一种面向对象的、跨平台的编程语言，遵循「一次编写，到处运行」的理念。Java 广泛应用于企业级应用、Android 开发和大数据领域。

## 环境准备

```sh
java -version
javac -version

# 编译与运行
javac HelloWorld.java   # 编译为字节码 .class
java HelloWorld         # 运行
```

## 基础语法

```java
public class HelloWorld {
    public static void main(String[] args) {
        // 变量
        String name = "Java";
        int version = 21;
        double pi = 3.14159;
        boolean isFun = true;

        // 条件
        if (version >= 17) {
            System.out.println("LTS 版本");
        }

        // 循环
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }

        // 数组
        int[] numbers = {1, 2, 3, 4, 5};
        String[] names = new String[3];

        // for-each
        for (int n : numbers) {
            System.out.println(n);
        }
    }
}
```

## 数据类型

| 类型 | 大小 | 范围 |
|------|------|------|
| `byte` | 8位 | -128 ~ 127 |
| `short` | 16位 | -32,768 ~ 32,767 |
| `int` | 32位 | -2^31 ~ 2^31-1 |
| `long` | 64位 | -2^63 ~ 2^63-1 |
| `float` | 32位 | ±3.4e-38 ~ ±3.4e38 |
| `double` | 64位 | ±1.7e-308 ~ ±1.7e308 |
| `boolean` | - | true / false |
| `char` | 16位 | Unicode 字符 |

```java
// 引用类型
String text = "Hello";
int[] arr = new int[10];
Object obj = new Object();
```

## 面向对象

```java
// 类定义
public class Animal {
    private String name;    // 封装：私有字段
    protected int age;

    // 构造方法
    public Animal(String name) {
        this.name = name;
    }

    // Getter / Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // 方法
    public void speak() {
        System.out.println(name + " makes a sound");
    }

    // 静态方法
    public static void info() {
        System.out.println("这是一个动物类");
    }
}

// 继承
public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);  // 调用父类构造器
        this.breed = breed;
    }

    @Override  // 注解：重写父类方法
    public void speak() {
        System.out.println("Woof!");
    }
}
```

## 接口与抽象类

```java
// 接口（约定行为）
public interface Flyable {
    void fly();  // 抽象方法

    default void glide() {  // 默认方法（Java 8+）
        System.out.println("滑翔中");
    }
}

// 抽象类（部分实现）
public abstract class Bird implements Flyable {
    protected String name;

    public abstract void eat();

    public void sleep() {
        System.out.println("睡觉");
    }
}

// 实现
public class Sparrow extends Bird {
    @Override
    public void fly() { System.out.println("麻雀飞"); }

    @Override
    public void eat() { System.out.println("吃虫子"); }
}
```

## 泛型

```java
// 泛型类
public class Box<T> {
    private T content;

    public void set(T content) { this.content = content; }
    public T get() { return content; }
}

// 泛型方法
public static <T> T getFirst(List<T> list) {
    return list.get(0);
}

// 通配符
public void process(List<? extends Animal> animals) { }  // 上界
public void add(List<? super Dog> dogs) { }              // 下界
```

## 集合框架

```java
import java.util.*;

// List
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
list.get(0);
list.remove("Python");
list.size();

// Set
Set<Integer> set = new HashSet<>();
set.add(1);
set.contains(1);

// Map
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 30);
map.get("Alice");
map.forEach((k, v) -> System.out.println(k + ": " + v));

// Stream API（Java 8+）
List<String> result = list.stream()
    .filter(s -> s.startsWith("J"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

## 异常处理

```java
// 受检异常（必须处理）
try {
    FileReader reader = new FileReader("file.txt");
} catch (FileNotFoundException e) {
    System.err.println("文件未找到: " + e.getMessage());
} finally {
    System.out.println("始终执行");
}

// 非受检异常（运行时）
if (age < 0) {
    throw new IllegalArgumentException("年龄不能为负数");
}

// try-with-resources（自动关闭资源）
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // 使用 fis
} catch (IOException e) {
    e.printStackTrace();
}
```

## 常用工具

```java
// 字符串
String s = "Hello Java";
s.length();
s.substring(0, 5);
s.split(" ");
s.replace("Java", "World");
String.join(", ", "a", "b", "c");

// 日期时间（Java 8+）
LocalDate.now();
LocalTime.now();
LocalDateTime.now();
DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

// Optional（避免 NPE）
Optional<String> optional = Optional.ofNullable(getName());
optional.ifPresent(System.out::println);
String result = optional.orElse("默认值");
```

## Spring Boot 快速开始

```java
// 项目结构
// ├── src/main/java/com/example/
// │   ├── Application.java
// │   ├── controller/UserController.java
// │   └── model/User.java
// ├── src/main/resources/application.properties
// └── pom.xml

// Application.java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll() { return userService.findAll(); }

    @PostMapping
    public User create(@RequestBody @Valid User user) {
        return userService.save(user);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

## Maven / Gradle

```xml
<!-- pom.xml (Maven) -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.2.0</version>
    </dependency>
</dependencies>
```

```groovy
// build.gradle (Gradle)
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web:3.2.0'
}
```

---

# 企业级实践

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


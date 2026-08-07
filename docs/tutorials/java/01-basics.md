# Java 基础语法

## 环境准备

```sh
java -version
javac -version

# 编译与运行
javac HelloWorld.java   # 编译为字节码 .class
java HelloWorld         # 运行
```

::: tip 关键记忆点
- Java 是**编译型 + 解释型结合**：`javac` 把源码编译成与平台无关的**字节码（.class）**，再由 **JVM（Java 虚拟机）** 解释/即时编译（JIT）执行。这也是「一次编写，到处运行」的原因。
- `public class` 的类名**必须与文件名一致**，且一个文件只能有一个 `public` 类。
:::

## Hello World

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
        } else if (version == 21) {
            System.out.println("最新版本");
        } else {
            System.out.println("旧版本");
        }

        // switch 表达式（Java 14+）
        String label = switch (version) {
            case 17 -> "LTS";
            case 21 -> "最新";
            default -> "其他";
        };

        // for 循环
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }

        // while 循环
        int count = 0;
        while (count < 3) {
            System.out.println(count++);
        }

        // do-while 循环
        int n = 0;
        do {
            System.out.println(n);
        } while (n > 0);

        // 数组
        int[] numbers = {1, 2, 3, 4, 5};
        String[] names = new String[3];

        // for-each
        for (int num : numbers) {
            System.out.println(num);
        }

        // 多维数组
        int[][] matrix = {{1, 2}, {3, 4}};
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
// 包装类型与自动装箱
Integer a = 100;          // 自动装箱 int → Integer
int b = a;                // 自动拆箱 Integer → int
Long big = 100L;
Double d = 3.14;

::: tip 自动装箱的坑
- `Integer` 等包装类是对象，`==` 比较的是**引用**而非值；值比较要用 `.equals()` 或拆箱后比较。
- 自动装箱会创建对象，在循环里频繁装箱（如 `Integer sum += i`）有额外开销；高频数值运算优先用基本类型。
- `Integer` 缓存 -128~127 的对象，超出范围后 `==` 会返回 `false`，这点最易踩坑。
:::

// 引用类型
String text = "Hello";
int[] arr = new int[10];
Object obj = new Object();

// 类型转换
int i = (int) 3.14;       // 强制转换，结果为 3
long l = 100;             // 隐式转换
String num = String.valueOf(42);
int parsed = Integer.parseInt("42");

// StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("Java");
String result = sb.toString();
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

    // 静态字段
    public static int count = 0;
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

// 多态
public class Cat extends Animal {
    public Cat(String name) { super(name); }

    @Override
    public void speak() {
        System.out.println("Meow!");
    }
}

// 使用多态
Animal myDog = new Dog("Buddy", "Labrador");
Animal myCat = new Cat("Kitty");
myDog.speak();  // Woof!
myCat.speak();  // Meow!

// 枚举
public enum Color {
    RED("#FF0000"), GREEN("#00FF00"), BLUE("#0000FF");

    private final String hex;

    Color(String hex) { this.hex = hex; }

    public String getHex() { return hex; }
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

    static boolean hasWings() {  // 静态方法（Java 8+）
        return true;
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

// 函数式接口（SAM — Single Abstract Method）
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);
}

// 使用 Lambda 表达式
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;
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

// 泛型接口
public interface Pair<K, V> {
    K getKey();
    V getValue();
}

// 通配符
public void process(List<? extends Animal> animals) { }  // 上界
public void add(List<? super Dog> dogs) { }              // 下界
public void printAll(List<?> list) { }                   // 无界通配符
```

## 集合框架

```java
import java.util.*;

// List
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
list.add(0, "C++");          // 指定位置插入
list.get(0);
list.remove("Python");
list.size();

List<String> linked = new LinkedList<>();  // 链表实现

// Set
Set<Integer> set = new HashSet<>();
set.add(1);
set.contains(1);

Set<Integer> treeSet = new TreeSet<>();       // 有序
Set<Integer> linkedHashSet = new LinkedHashSet<>();  // 插入顺序

// Map
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 30);
map.get("Alice");
map.forEach((k, v) -> System.out.println(k + ": " + v));

Map<String, Integer> treeMap = new TreeMap<>();  // 按键排序

// Collections 工具类
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
List<String> unmodifiable = Collections.unmodifiableList(list);

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
try (FileInputStream fis = new FileInputStream("file.txt");
     BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {
    String line = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
}

// 自定义异常
public class BusinessException extends RuntimeException {
    private final int errorCode;

    public BusinessException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public int getErrorCode() { return errorCode; }
}

::: tip 受检异常 vs 非受检异常
- **受检异常（Checked）**：`Exception` 的子类（除 `RuntimeException`），编译器强制 `try/catch` 或 `throws` 声明，用于可预期、调用方应处理的异常（如 IO）。
- **非受检异常（Unchecked）**：`RuntimeException` 与 `Error` 的子类，编译器不强制处理，多用于编程错误（空指针、越界、非法参数）。
- 业务异常通常继承 `RuntimeException`，避免强制调用方层层声明；`try-with-resources` 自动关闭实现 `AutoCloseable` 的资源，杜绝泄漏。
:::
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
"  hello  ".strip();              // 去除两端空白（Java 11+）
"hello".repeat(3);                // 重复（Java 11+）

// 日期时间（Java 8+）
LocalDate today = LocalDate.now();
LocalTime now = LocalTime.now();
LocalDateTime current = LocalDateTime.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String formatted = current.format(formatter);

// 日期运算
LocalDate nextWeek = today.plusWeeks(1);
LocalDate lastMonth = today.minusMonths(1);
boolean leapYear = today.isLeapYear();

// Optional（避免 NPE）
Optional<String> optional = Optional.ofNullable(getName());
optional.ifPresent(System.out::println);
String result = optional.orElse("默认值");
String result2 = optional.orElseThrow(() -> new RuntimeException("值不存在"));
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

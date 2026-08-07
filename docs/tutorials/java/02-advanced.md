# Java 进阶深入

## 并发编程

### 创建线程

```java
// 继承 Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}
new MyThread().start();

// 实现 Runnable
Runnable task = () -> System.out.println("Runnable running");
new Thread(task).start();

// Callable + Future（带返回值）
ExecutorService executor = Executors.newFixedThreadPool(4);
Callable<Integer> callable = () -> {
    Thread.sleep(1000);
    return 42;
};
Future<Integer> future = executor.submit(callable);
Integer result = future.get(2, TimeUnit.SECONDS);  // 阻塞等待
```

### ExecutorService

```java
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor(); // Java 21+

ExecutorService pool = Executors.newFixedThreadPool(10);
List<Future<String>> futures = new ArrayList<>();
for (int i = 0; i < 20; i++) {
    int taskId = i;
    futures.add(pool.submit(() -> "Task " + taskId + " done"));
}
for (Future<String> f : futures) {
    System.out.println(f.get());
}
pool.shutdown();
```

### CompletableFuture

```java
// 异步执行
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    return "Hello";
}).thenApply(s -> s + " World")
  .thenApply(String::toUpperCase);

System.out.println(future.get());  // HELLO WORLD

// 组合多个异步任务
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "A");
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "B");
CompletableFuture<String> combined = future1.thenCombine(future2, (a, b) -> a + b);
System.out.println(combined.get());  // AB

// 异常处理
CompletableFuture.supplyAsync(() -> {
    if (Math.random() > 0.5) throw new RuntimeException("失败");
    return "成功";
}).exceptionally(ex -> "默认值:" + ex.getMessage())
  .thenAccept(System.out::println);
```

### 线程安全

```java
// synchronized
public synchronized void increment() { count++; }

// Lock
private final Lock lock = new ReentrantLock();
public void safeIncrement() {
    lock.lock();
    try { count++; } finally { lock.unlock(); }
}

// 原子类
AtomicInteger atomicCount = new AtomicInteger(0);
atomicCount.incrementAndGet();

// ConcurrentHashMap
ConcurrentHashMap<String, Integer> safeMap = new ConcurrentHashMap<>();
safeMap.put("key", 1);
```

## Stream API 详解

### 创建 Stream

```java
Stream.of("a", "b", "c");
Arrays.stream(new int[]{1, 2, 3});
list.stream();
Stream.iterate(0, n -> n + 1).limit(10);
Stream.generate(Math::random).limit(5);
```

### 中间操作

```java
List<String> words = List.of("apple", "banana", "cherry", "date");

// filter
words.stream().filter(w -> w.length() > 5).toList();

// map
words.stream().map(String::toUpperCase).toList();

// flatMap
List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4));
nested.stream().flatMap(Collection::stream).toList();  // [1,2,3,4]

// sorted
words.stream().sorted().toList();
words.stream().sorted(Comparator.comparingInt(String::length)).toList();

// distinct / limit / skip
Stream.of(1,1,2,3,2).distinct().skip(1).limit(2).toList();
```

### 终端操作

```java
// collect
List<String> collected = words.stream().collect(Collectors.toList());
Set<String> set = words.stream().collect(Collectors.toSet());
String joined = words.stream().collect(Collectors.joining(", "));
Map<Integer, List<String>> grouped = words.stream()
    .collect(Collectors.groupingBy(String::length));

// reduce
int sum = Stream.of(1, 2, 3, 4).reduce(0, Integer::sum);      // 10
OptionalInt max = IntStream.of(1, 2, 3).max();                  // OptionalInt[3]

// matching & finding
boolean anyMatch = words.stream().anyMatch(w -> w.startsWith("a"));
Optional<String> first = words.stream().filter(w -> w.length() > 4).findFirst();
```

### 并行流

```java
long count = list.parallelStream()
    .filter(w -> w.length() > 3)
    .count();

// 自定义 ForkJoinPool
ForkJoinPool customPool = new ForkJoinPool(8);
try {
    customPool.submit(() ->
        list.parallelStream().filter(w -> w.length() > 3).count()
    ).get();
} finally {
    customPool.shutdown();
}
```

### 自定义 Collector

```java
Collector<String, StringBuilder, String> joinCollector =
    Collector.of(
        StringBuilder::new,
        (sb, s) -> sb.append(s).append(", "),
        (sb1, sb2) -> sb1.append(sb2),
        StringBuilder::toString
    );

String result = words.stream().collect(joinCollector);
```

## Optional 最佳实践

```java
// 创建
Optional<String> empty = Optional.empty();
Optional<String> value = Optional.of("hello");        // 非 null
Optional<String> nullable = Optional.ofNullable(getName());

// 安全使用
String result = nullable.orElse("默认值");
String result2 = nullable.orElseGet(() -> computeDefault());
String result3 = nullable.orElseThrow(() -> new NoSuchElementException());

// 转换与过滤
nullable.map(String::toUpperCase)
        .filter(s -> s.length() > 3)
        .ifPresent(System.out::println);

// 避免 isPresent()+get() 模式
// ❌ 不推荐
if (opt.isPresent()) {
    System.out.println(opt.get());
}
// ✅ 推荐
opt.ifPresent(System.out::println);

// flatMap 链式调用
Optional<String> city = person.flatMap(Person::getAddress)
    .flatMap(Address::getCity);
```

## 记录类 (Record)

```java
// 紧凑语法 — 自动生成构造器、getter、equals、hashCode、toString
public record Point(int x, int y) {}

// 使用
Point p = new Point(3, 4);
System.out.println(p.x());  // 注意：不是 getX()
System.out.println(p.toString());  // Point[x=3, y=4]

// 自定义构造器
public record Range(int min, int max) {
    public Range {
        if (min > max) throw new IllegalArgumentException("min > max");
    }
}

// 局部记录（Java 16+）
public void process() {
    record Item(String name, int quantity) {}
    List<Item> items = new ArrayList<>();
    items.add(new Item("book", 2));
}
```

## 密封类 (Sealed Class)

```java
// 限制哪些子类可以继承
public sealed class Shape permits Circle, Rectangle, Triangle { }

public final class Circle extends Shape { }
public final class Rectangle extends Shape { }
public non-sealed class Triangle extends Shape { }  // 开放继承

// 密封接口
public sealed interface Expression permits Add, Subtract, Number { }
public record Add(Expression left, Expression right) implements Expression { }
public record Number(int value) implements Expression { }
```

## 模式匹配 (Pattern Matching)

```java
// instanceof 模式匹配（Java 16+）
if (obj instanceof String s) {
    System.out.println(s.length());
}

// switch 模式匹配（Java 21+）
String result = switch (obj) {
    case Integer i -> "整数: " + i;
    case String s when s.length() > 5 -> "长字符串: " + s;
    case String s -> "字符串: " + s;
    case null -> "null";
    default -> "未知类型";
};

// 结合 Record 的模式匹配
if (obj instanceof Point(int x, int y)) {
    System.out.println("x=" + x + ", y=" + y);
}

// 结合 Sealed Class 的模式匹配
String describe(Expression expr) {
    return switch (expr) {
        case Add(var l, var r) -> l + " + " + r;
        case Number(var v) -> String.valueOf(v);
    };
}
```

## 反射与注解

```java
// 获取 Class 对象
Class<?> cls1 = String.class;
Class<?> cls2 = "hello".getClass();
Class<?> cls3 = Class.forName("java.lang.String");

// 反射操作
Method[] methods = cls1.getMethods();
Field[] fields = cls1.getDeclaredFields();
Constructor<?>[] constructors = cls1.getConstructors();

// 调用方法
Method method = cls1.getMethod("substring", int.class, int.class);
String result = (String) method.invoke("hello", 1, 3);  // "el"

// 定义注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Loggable {
    String value() default "";
}

// 读取注解
for (Method m : cls1.getMethods()) {
    if (m.isAnnotationPresent(Loggable.class)) {
        Loggable log = m.getAnnotation(Loggable.class);
        System.out.println("Loggable: " + log.value());
    }
}
```

## 模块化系统 (JPMS)

```java
// module-info.java
module com.example.myapp {
    requires java.sql;
    requires spring.core;
    requires transitive java.logging;

    exports com.example.myapp.api;
    exports com.example.myapp.dto;

    opens com.example.myapp.internal to spring.core;

provides com.example.myapp.spi.Plugin
        with com.example.myapp.impl.MyPlugin;
}
```

## 官方文档

JVM 内存模型、并发、反射、模块系统等细节以 Oracle 官方规范与 API 为准。

| 主题 | 链接 |
|------|------|
| 语言与 JVM 规范 | [Java Language Specification](https://docs.oracle.com/javase/specs/) · [JVMS](https://docs.oracle.com/javase/specs/jvms/se21/html/) |
| API 参考 | [Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html) |
| 内存模型 | [Java Memory Model（JLS §17）](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html) · [虚拟线程（JEP 444）](https://openjdk.org/jeps/444) |
| 并发 | [java.util.concurrent](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html) · [内存模型指南](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html) |
| 反射与模块 | [java.lang.reflect](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/reflect/package-summary.html) · [JPMS（JEP 261）](https://openjdk.org/jeps/261) |
| 运行时 | [jfr/JFR](https://docs.oracle.com/en/java/javase/21/specialized-debugging-instructions.html) · [Diagnostic Commands](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html) |

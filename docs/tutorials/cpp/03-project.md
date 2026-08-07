# 实战项目：文本文件词频统计

实现一个完整的命令行工具，读取文本文件并输出词频统计结果。

## 项目需求

- 读取指定文本文件
- 统计每个单词出现的次数（不区分大小写）
- 按频率降序排列输出
- 支持排除停用词（stop words）
- CMake 构建系统
- 完整的单元测试

## 项目结构

```
word-counter/
├── CMakeLists.txt
├── src/
│   ├── main.cpp
│   ├── counter.h
│   └── counter.cpp
└── tests/
    ├── CMakeLists.txt
    └── test_counter.cpp
```

## CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.20)
project(WordCounter VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 查找依赖
find_package(fmt REQUIRED)
find_package(GTest REQUIRED)

# 库
add_library(counter
    src/counter.cpp
)

target_include_directories(counter PUBLIC src)
target_link_libraries(counter PRIVATE fmt::fmt)

# 可执行文件
add_executable(word_counter src/main.cpp)
target_link_libraries(word_counter PRIVATE counter)

# 测试
enable_testing()
add_subdirectory(tests)
```

## 核心实现

### counter.h

```cpp
#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>

struct WordCount {
    std::string word;
    int count;
};

class WordCounter {
public:
    explicit WordCounter(const std::vector<std::string>& stop_words = {});

    // 读取并统计文件
    void process_file(const std::string& filename);

    // 添加文本行
    void process_line(const std::string& line);

    // 获取结果（按频率降序）
    std::vector<WordCount> get_results(int top_n = -1) const;

    // 总单词数
    int total_words() const { return total_; }

    // 重置
    void clear();

private:
    static std::string normalize(const std::string& word);
    bool is_stop_word(const std::string& word) const;

    std::unordered_map<std::string, int> freq_;
    std::vector<std::string> stop_words_;
    int total_ = 0;
};
```

### counter.cpp

```cpp
#include "counter.h"
#include <fstream>
#include <sstream>
#include <cctype>

WordCounter::WordCounter(const std::vector<std::string>& stop_words)
    : stop_words_(stop_words) {
    // 停用词转为小写
    for (auto& w : stop_words_) {
        std::transform(w.begin(), w.end(), w.begin(), ::tolower);
    }
}

void WordCounter::process_file(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Cannot open file: " + filename);
    }
    std::string line;
    while (std::getline(file, line)) {
        process_line(line);
    }
}

void WordCounter::process_line(const std::string& line) {
    std::istringstream stream(line);
    std::string word;
    while (stream >> word) {
        word = normalize(word);
        if (!word.empty() && !is_stop_word(word)) {
            freq_[word]++;
            total_++;
        }
    }
}

std::vector<WordCount> WordCounter::get_results(int top_n) const {
    std::vector<WordCount> result;
    for (const auto& [word, count] : freq_) {
        result.push_back({word, count});
    }

    std::sort(result.begin(), result.end(),
        [](const WordCount& a, const WordCount& b) {
            if (a.count != b.count) return a.count > b.count;
            return a.word < b.word;
        });

    if (top_n > 0 && top_n < static_cast<int>(result.size())) {
        result.resize(top_n);
    }
    return result;
}

void WordCounter::clear() {
    freq_.clear();
    total_ = 0;
}

std::string WordCounter::normalize(const std::string& word) {
    std::string result;
    result.reserve(word.size());
    for (char ch : word) {
        if (std::isalnum(static_cast<unsigned char>(ch))) {
            result.push_back(std::tolower(static_cast<unsigned char>(ch)));
        }
    }
    return result;
}

bool WordCounter::is_stop_word(const std::string& word) const {
    return std::find(stop_words_.begin(), stop_words_.end(), word) != stop_words_.end();
}
```

### main.cpp

```cpp
#include "counter.h"
#include <fmt/core.h>
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fmt::print(stderr, "Usage: word_counter <file> [top_n] [stop_words...]\n");
        return 1;
    }

    std::string filename = argv[1];
    int top_n = (argc >= 3) ? std::stoi(argv[2]) : -1;

    std::vector<std::string> stop_words = {"the", "a", "an", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had",
        "do", "does", "did", "will", "would", "could", "should",
        "may", "might", "shall", "can", "need", "dare", "ought",
        "used", "to", "of", "in", "for", "on", "with", "at",
        "by", "from", "as", "into", "through", "during", "before",
        "after", "above", "below", "between", "and", "but", "or",
        "nor", "not", "so", "yet", "both", "either", "neither",
        "each", "every", "all", "any", "few", "more", "most",
        "other", "some", "such", "no", "only", "own", "same",
        "than", "too", "very", "just", "because", "as", "until",
        "while", "if", "although", "though", "when",
        "it", "its", "this", "that", "these", "those",
        "i", "me", "my", "we", "our", "you", "your",
        "he", "him", "his", "she", "her", "they", "them", "their",
        "what", "which", "who", "whom", "whose", "why", "how"};

    try {
        WordCounter counter(stop_words);
        counter.process_file(filename);

        auto results = counter.get_results(top_n);
        fmt::print("Total words: {}\n", counter.total_words());
        fmt::print("Unique words: {}\n\n", results.size());

        int rank = 1;
        for (const auto& wc : results) {
            fmt::print("{:>4}. {:<20} {}\n", rank++, wc.word, wc.count);
        }
    } catch (const std::exception& e) {
        fmt::print(stderr, "Error: {}\n", e.what());
        return 1;
    }

    return 0;
}
```

### 格式化输出示例

```
Total words: 1234
Unique words: 456

   1. hello               42
   2. world               35
   3. cpp                 28
   4. programming         21
   5. tutorial            19
```

## 单元测试

### tests/CMakeLists.txt

```cmake
add_executable(test_counter test_counter.cpp)
target_link_libraries(test_counter PRIVATE counter GTest::GTest GTest::Main)
add_test(NAME WordCounterTest COMMAND test_counter)
```

### tests/test_counter.cpp

```cpp
#include <gtest/gtest.h>
#include "counter.h"

TEST(WordCounterTest, SingleWord) {
    WordCounter counter;
    counter.process_line("hello");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0].word, "hello");
    EXPECT_EQ(results[0].count, 1);
    EXPECT_EQ(counter.total_words(), 1);
}

TEST(WordCounterTest, MultipleWords) {
    WordCounter counter;
    counter.process_line("hello world hello");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0].word, "hello");
    EXPECT_EQ(results[0].count, 2);
    EXPECT_EQ(results[1].word, "world");
    EXPECT_EQ(results[1].count, 1);
    EXPECT_EQ(counter.total_words(), 3);
}

TEST(WordCounterTest, CaseInsensitive) {
    WordCounter counter;
    counter.process_line("Hello HELLO hello");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0].count, 3);
}

TEST(WordCounterTest, Punctuation) {
    WordCounter counter;
    counter.process_line("hello, world! hello...");
    auto results = counter.get_results();
    EXPECT_EQ(results.size(), 2);
    EXPECT_EQ(results[0].count, 2);
}

TEST(WordCounterTest, StopWords) {
    WordCounter counter({"the", "and"});
    counter.process_line("the cat and the dog");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0].word, "cat");
    EXPECT_EQ(results[1].word, "dog");
    EXPECT_EQ(counter.total_words(), 2);
}

TEST(WordCounterTest, TopN) {
    WordCounter counter;
    counter.process_line("a b b c c c d d d d");
    auto results = counter.get_results(2);
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0].word, "d");
    EXPECT_EQ(results[1].word, "c");
}

TEST(WordCounterTest, EmptyLine) {
    WordCounter counter;
    counter.process_line("");
    EXPECT_EQ(counter.total_words(), 0);
    EXPECT_TRUE(counter.get_results().empty());
}

TEST(WordCounterTest, Clear) {
    WordCounter counter;
    counter.process_line("hello world");
    counter.clear();
    EXPECT_EQ(counter.total_words(), 0);
    EXPECT_TRUE(counter.get_results().empty());
}

TEST(WordCounterTest, FileNotFound) {
    WordCounter counter;
    EXPECT_THROW(counter.process_file("nonexistent.txt"), std::runtime_error);
}

TEST(WordCounterTest, OrderByFrequencyThenAlphabet) {
    WordCounter counter;
    counter.process_line("z a z b a z");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 3);
    EXPECT_EQ(results[0].word, "z");  // count 3, first
    EXPECT_EQ(results[1].word, "a");  // count 2, alphabetically before b
    EXPECT_EQ(results[2].word, "b");  // count 1
}

TEST(WordCounterTest, MultipleLines) {
    WordCounter counter;
    counter.process_line("hello world");
    counter.process_line("hello cpp");
    auto results = counter.get_results();
    ASSERT_EQ(results.size(), 3);
    EXPECT_EQ(results[0].word, "hello");
    EXPECT_EQ(results[0].count, 2);
}

int main(int argc, char** argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

## 构建与运行

```sh
# 构建
mkdir build && cd build
cmake ..
make

# 运行
./word_counter input.txt 10

# 测试
ctest --output-on-failure

# 测试单个
./tests/test_counter
```

## 扩展思路

- 支持多线程并行处理大文件
- 通过 `mmap` 提升大文件读取性能
- 支持读取多个文件合并统计
- 输出 JSON/CSV 格式
- 可视化词云（配合 Python 脚本）
- 支持正则分词以处理更复杂的情况

## 官方文档

| 主题 | 链接 |
|------|------|
| 标准库 | [cppreference（中文）](https://zh.cppreference.com/w/cpp) · [STL 容器](https://zh.cppreference.com/w/cpp/container) |
| 正则 | [std::regex](https://en.cppreference.com/w/cpp/regex) |
| 文件流 | [std::fstream](https://en.cppreference.com/w/cpp/io/basic_fstream) |
| 构建 | [CMake](https://cmake.org/documentation/) |
| 测试 | [GoogleTest](https://google.github.io/googletest/) |

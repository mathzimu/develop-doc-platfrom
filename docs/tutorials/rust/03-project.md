# 实战项目：命令行 JSON 解析器

本章从零实现一个命令行 JSON 解析器，涵盖完整的 Rust 项目流程：结构设计、命令行参数、词法分析、语法解析、格式化输出、错误处理和测试。

## 项目结构

```
json-parser/
├── Cargo.toml
└── src/
    ├── main.rs        # 入口 + CLI
    ├── tokenizer.rs   # 词法分析
    ├── parser.rs      # 语法分析
    ├── ast.rs         # 抽象语法树
    ├── formatter.rs   # 格式化输出
    └── error.rs       # 错误类型
```

```toml
[package]
name = "json-parser"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = { version = "4", features = ["derive"] }
serde_json = "1.0"  # 对比验证
thiserror = "1.0"
```

## 命令行参数解析

```rust
// src/main.rs
use clap::Parser;

#[derive(Parser)]
#[command(name = "json-parser")]
#[command(about = "JSON 解析与格式化工具")]
struct Cli {
    /// 输入文件路径（默认从 stdin 读取）
    file: Option<String>,

    /// 缩进空格数
    #[arg(short, long, default_value_t = 2)]
    indent: u8,

    /// 输出到文件
    #[arg(short, long)]
    output: Option<String>,

    /// 压缩输出（单行）
    #[arg(short, long)]
    compact: bool,

    /// 验证 JSON 但不输出
    #[arg(short, long)]
    validate: bool,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    let input = if let Some(path) = &cli.file {
        std::fs::read_to_string(path)?
    } else {
        let mut buf = String::new();
        std::io::stdin().read_line(&mut buf)?;
        buf
    };

    let tokens = tokenizer::tokenize(&input)?;
    let value = parser::parse(&tokens)?;

    if cli.validate {
        println!("✅ 有效的 JSON");
        return Ok(());
    }

    let output = if cli.compact {
        formatter::format_compact(&value)
    } else {
        formatter::format_pretty(&value, cli.indent)
    };

    if let Some(path) = &cli.output {
        std::fs::write(path, output)?;
    } else {
        println!("{}", output);
    }

    Ok(())
}
```

## 抽象语法树

```rust
// src/ast.rs
#[derive(Debug, Clone, PartialEq)]
pub enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<JsonValue>),
    Object(Vec<(String, JsonValue)>),
}
```

## 错误类型

```rust
// src/error.rs
use std::fmt;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum JsonError {
    #[error("词法错误：第 {line} 行第 {column} 列 — {message}")]
    TokenizeError {
        line: usize,
        column: usize,
        message: String,
    },

    #[error("语法错误：第 {line} 行第 {column} 列 — 期望 {expected}，实际 {found}")]
    ParseError {
        line: usize,
        column: usize,
        expected: String,
        found: String,
    },

    #[error("IO 错误：{0}")]
    Io(#[from] std::io::Error),
}
```

## JSON Tokenizer

```rust
// src/tokenizer.rs
use crate::error::JsonError;

#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    LeftBrace,       // {
    RightBrace,      // }
    LeftBracket,     // [
    RightBracket,    // ]
    Colon,           // :
    Comma,           // ,
    String(String),
    Number(f64),
    Bool(bool),
    Null,
}

pub struct Cursor {
    chars: Vec<char>,
    pos: usize,
    line: usize,
    column: usize,
}

impl Cursor {
    pub fn new(input: &str) -> Self {
        Self {
            chars: input.chars().collect(),
            pos: 0,
            line: 1,
            column: 1,
        }
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let c = self.chars.get(self.pos).copied();
        if let Some(ch) = c {
            self.pos += 1;
            if ch == '\n' {
                self.line += 1;
                self.column = 1;
            } else {
                self.column += 1;
            }
        }
        c
    }

    fn skip_whitespace(&mut self) {
        while let Some(c) = self.peek() {
            if c.is_ascii_whitespace() {
                self.advance();
            } else {
                break;
            }
        }
    }

    fn read_string(&mut self) -> Result<String, JsonError> {
        let start_line = self.line;
        let start_col = self.column;
        self.advance(); // skip opening quote
        let mut s = String::new();

        loop {
            match self.advance() {
                None => {
                    return Err(JsonError::TokenizeError {
                        line: start_line,
                        column: start_col,
                        message: "未闭合的字符串".into(),
                    });
                }
                Some('"') => return Ok(s),
                Some('\\') => {
                    match self.advance() {
                        Some('n') => s.push('\n'),
                        Some('t') => s.push('\t'),
                        Some('\\') => s.push('\\'),
                        Some('"') => s.push('"'),
                        Some('r') => s.push('\r'),
                        Some('u') => {
                            let hex: String = (0..4).filter_map(|_| self.advance()).collect();
                            let code = u32::from_str_radix(&hex, 16).map_err(|_| {
                                JsonError::TokenizeError {
                                    line: self.line,
                                    column: self.column,
                                    message: "无效的 unicode 转义".into(),
                                }
                            })?;
                            if let Some(ch) = char::from_u32(code) {
                                s.push(ch);
                            }
                        }
                        Some(c) => s.push(c),
                        None => {}
                    }
                }
                Some(c) => s.push(c),
            }
        }
    }

    fn read_number(&mut self, first: char) -> Token {
        let mut s = String::new();
        s.push(first);
        while let Some(c) = self.peek() {
            if c.is_ascii_digit() || c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-' {
                s.push(c);
                self.advance();
            } else {
                break;
            }
        }
        let n: f64 = s.parse().unwrap_or(0.0);
        Token::Number(n)
    }

    fn read_keyword(&mut self, first: char) -> Result<Token, JsonError> {
        let mut s = String::new();
        s.push(first);
        while let Some(c) = self.peek() {
            if c.is_ascii_alphabetic() {
                s.push(c);
                self.advance();
            } else {
                break;
            }
        }
        match s.as_str() {
            "true" => Ok(Token::Bool(true)),
            "false" => Ok(Token::Bool(false)),
            "null" => Ok(Token::Null),
            _ => Err(JsonError::TokenizeError {
                line: self.line,
                column: self.column,
                message: format!("未知的关键字: {}", s),
            }),
        }
    }
}

pub fn tokenize(input: &str) -> Result<Vec<(Token, usize, usize)>, JsonError> {
    let mut cursor = Cursor::new(input);
    let mut tokens = Vec::new();

    loop {
        cursor.skip_whitespace();
        let line = cursor.line;
        let col = cursor.column;

        match cursor.advance() {
            None => return Ok(tokens),
            Some('{') => tokens.push((Token::LeftBrace, line, col)),
            Some('}') => tokens.push((Token::RightBrace, line, col)),
            Some('[') => tokens.push((Token::LeftBracket, line, col)),
            Some(']') => tokens.push((Token::RightBracket, line, col)),
            Some(':') => tokens.push((Token::Colon, line, col)),
            Some(',') => tokens.push((Token::Comma, line, col)),
            Some('"') => {
                let s = cursor.read_string()?;
                tokens.push((Token::String(s), line, col));
            }
            Some(c) if c.is_ascii_digit() || c == '-' => {
                tokens.push((cursor.read_number(c), line, col));
            }
            Some(c) if c.is_ascii_alphabetic() => {
                tokens.push(cursor.read_keyword(c)?);
            }
            Some(c) => {
                return Err(JsonError::TokenizeError {
                    line,
                    column: col,
                    message: format!("意外的字符: '{}'", c),
                });
            }
        }
    }
}
```

## JSON Parser

```rust
// src/parser.rs
use crate::ast::JsonValue;
use crate::error::JsonError;
use crate::tokenizer::Token;

pub struct Parser {
    tokens: Vec<(Token, usize, usize)>,
    pos: usize,
}

impl Parser {
    pub fn new(tokens: Vec<(Token, usize, usize)>) -> Self {
        Self { tokens, pos: 0 }
    }

    fn peek(&self) -> Option<&Token> {
        self.tokens.get(self.pos).map(|(t, _, _)| t)
    }

    fn advance(&mut self) -> Option<&(Token, usize, usize)> {
        let result = self.tokens.get(self.pos);
        self.pos += 1;
        result
    }

    fn expect(&mut self, expected: &Token) -> Result<(), JsonError> {
        match self.advance() {
            Some((token, line, col)) if token == expected => Ok(()),
            Some((_, line, col)) => Err(JsonError::ParseError {
                line: *line,
                column: *col,
                expected: format!("{:?}", expected),
                found: format!("{:?}", self.peek()),
            }),
            None => Err(JsonError::ParseError {
                line: 0,
                column: 0,
                expected: format!("{:?}", expected),
                found: "文件结束".into(),
            }),
        }
    }

    fn parse_value(&mut self) -> Result<JsonValue, JsonError> {
        match self.peek() {
            Some(Token::LeftBrace) => self.parse_object(),
            Some(Token::LeftBracket) => self.parse_array(),
            Some(Token::String(_)) => {
                if let Some((Token::String(s), _, _)) = self.advance() {
                    Ok(JsonValue::String(s.clone()))
                } else {
                    unreachable!()
                }
            }
            Some(Token::Number(n)) => {
                if let Some((Token::Number(n), _, _)) = self.advance() {
                    Ok(JsonValue::Number(*n))
                } else {
                    unreachable!()
                }
            }
            Some(Token::Bool(b)) => {
                if let Some((Token::Bool(b), _, _)) = self.advance() {
                    Ok(JsonValue::Bool(*b))
                } else {
                    unreachable!()
                }
            }
            Some(Token::Null) => {
                self.advance();
                Ok(JsonValue::Null)
            }
            Some((_, line, col)) => Err(JsonError::ParseError {
                line: *line,
                column: *col,
                expected: "JSON 值（对象、数组、字符串、数字、布尔、null）".into(),
                found: "当前 token".into(),
            }),
            None => Err(JsonError::ParseError {
                line: 0,
                column: 0,
                expected: "JSON 值".into(),
                found: "文件结束".into(),
            }),
        }
    }

    fn parse_object(&mut self) -> Result<JsonValue, JsonError> {
        self.advance(); // skip {
        let mut pairs = Vec::new();

        if matches!(self.peek(), Some(Token::RightBrace)) {
            self.advance();
            return Ok(JsonValue::Object(pairs));
        }

        loop {
            let key = match self.advance() {
                Some((Token::String(s), _, _)) => s.clone(),
                Some((_, line, col)) => {
                    return Err(JsonError::ParseError {
                        line: *line,
                        column: *col,
                        expected: "字符串 key".into(),
                        found: "其他".into(),
                    });
                }
                None => break,
            };

            self.expect(&Token::Colon)?;
            let value = self.parse_value()?;
            pairs.push((key, value));

            match self.peek() {
                Some(Token::Comma) => {
                    self.advance();
                }
                Some(Token::RightBrace) => {
                    self.advance();
                    return Ok(JsonValue::Object(pairs));
                }
                Some((_, line, col)) => {
                    return Err(JsonError::ParseError {
                        line: *line,
                        column: *col,
                        expected: "逗号或右花括号".into(),
                        found: "其他".into(),
                    });
                }
                None => break,
            }
        }

        Err(JsonError::ParseError {
            line: 0,
            column: 0,
            expected: "右花括号".into(),
            found: "文件结束".into(),
        })
    }

    fn parse_array(&mut self) -> Result<JsonValue, JsonError> {
        self.advance(); // skip [
        let mut values = Vec::new();

        if matches!(self.peek(), Some(Token::RightBracket)) {
            self.advance();
            return Ok(JsonValue::Array(values));
        }

        loop {
            values.push(self.parse_value()?);

            match self.peek() {
                Some(Token::Comma) => {
                    self.advance();
                }
                Some(Token::RightBracket) => {
                    self.advance();
                    return Ok(JsonValue::Array(values));
                }
                Some((_, line, col)) => {
                    return Err(JsonError::ParseError {
                        line: *line,
                        column: *col,
                        expected: "逗号或右方括号".into(),
                        found: "其他".into(),
                    });
                }
                None => break,
            }
        }

        Err(JsonError::ParseError {
            line: 0,
            column: 0,
            expected: "右方括号".into(),
            found: "文件结束".into(),
        })
    }
}

pub fn parse(tokens: &[(Token, usize, usize)]) -> Result<JsonValue, JsonError> {
    let mut parser = Parser::new(tokens.to_vec());
    let value = parser.parse_value()?;

    if parser.peek().is_some() {
        let (_, line, col) = parser.tokens[parser.pos];
        return Err(JsonError::ParseError {
            line,
            column: col,
            expected: "文件结束".into(),
            found: "多余的 token".into(),
        });
    }

    Ok(value)
}
```

## 格式化输出

```rust
// src/formatter.rs
use crate::ast::JsonValue;

pub fn format_pretty(value: &JsonValue, indent: u8) -> String {
    format_value(value, 0, indent as usize)
}

pub fn format_compact(value: &JsonValue) -> String {
    match value {
        JsonValue::Null => "null".into(),
        JsonValue::Bool(b) => b.to_string(),
        JsonValue::Number(n) => n.to_string(),
        JsonValue::String(s) => format!("\"{}\"", s),
        JsonValue::Array(arr) => {
            let items: Vec<String> = arr.iter().map(format_compact).collect();
            format!("[{}]", items.join(","))
        }
        JsonValue::Object(pairs) => {
            let items: Vec<String> = pairs
                .iter()
                .map(|(k, v)| format!("\"{}\":{}", k, format_compact(v)))
                .collect();
            format!("{{{}}}", items.join(","))
        }
    }
}

fn format_value(value: &JsonValue, depth: usize, indent: usize) -> String {
    let pad = " ".repeat(depth * indent);
    let child_pad = " ".repeat((depth + 1) * indent);

    match value {
        JsonValue::Null => "null".into(),
        JsonValue::Bool(b) => b.to_string(),
        JsonValue::Number(n) => n.to_string(),
        JsonValue::String(s) => {
            let escaped = s
                .replace('\\', "\\\\")
                .replace('"', "\\\"")
                .replace('\n', "\\n")
                .replace('\t', "\\t");
            format!("\"{}\"", escaped)
        }
        JsonValue::Array(arr) => {
            if arr.is_empty() {
                "[]".into()
            } else {
                let items: Vec<String> = arr
                    .iter()
                    .map(|v| format!("{}{}", child_pad, format_value(v, depth + 1, indent)))
                    .collect();
                format!("[\n{}\n{}]", items.join(",\n"), pad)
            }
        }
        JsonValue::Object(pairs) => {
            if pairs.is_empty() {
                "{}".into()
            } else {
                let items: Vec<String> = pairs
                    .iter()
                    .map(|(k, v)| {
                        format!(
                            "{}\"{}\": {}",
                            child_pad,
                            k,
                            format_value(v, depth + 1, indent)
                        )
                    })
                    .collect();
                format!("{{\n{}\n{}}}", items.join(",\n"), pad)
            }
        }
    }
}
```

## 测试

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_null() {
        let tokens = tokenizer::tokenize("null").unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::Null);
    }

    #[test]
    fn test_number() {
        let tokens = tokenizer::tokenize("42.5").unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::Number(42.5));
    }

    #[test]
    fn test_string() {
        let tokens = tokenizer::tokenize(r#""hello""#).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::String("hello".into()));
    }

    #[test]
    fn test_bool() {
        let tokens = tokenizer::tokenize("true").unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::Bool(true));
    }

    #[test]
    fn test_empty_array() {
        let input = "[]";
        let tokens = tokenizer::tokenize(input).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::Array(vec![]));
    }

    #[test]
    fn test_empty_object() {
        let input = "{}";
        let tokens = tokenizer::tokenize(input).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(parsed, JsonValue::Object(vec![]));
    }

    #[test]
    fn test_simple_object() {
        let input = r#"{"name": "Rust", "year": 2015}"#;
        let tokens = tokenizer::tokenize(input).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(
            parsed,
            JsonValue::Object(vec![
                ("name".into(), JsonValue::String("Rust".into())),
                ("year".into(), JsonValue::Number(2015.0)),
            ])
        );
    }

    #[test]
    fn test_nested() {
        let input = r#"{"data": [1, {"key": null}]}"#;
        let tokens = tokenizer::tokenize(input).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        assert_eq!(
            parsed,
            JsonValue::Object(vec![(
                "data".into(),
                JsonValue::Array(vec![
                    JsonValue::Number(1.0),
                    JsonValue::Object(vec![("key".into(), JsonValue::Null)]),
                ])
            )])
        );
    }

    #[test]
    fn test_trailing_comma_error() {
        let input = r#"{"a": 1,}"#;
        let tokens = tokenizer::tokenize(input).unwrap();
        assert!(parser::parse(&tokens).is_err());
    }

    #[test]
    fn test_roundtrip() {
        let original = r#"{"name":"Rust","version":1.5,"features":["safe","fast"],"stable":true}"#;
        let tokens = tokenizer::tokenize(original).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        let compact = formatter::format_compact(&parsed);
        let tokens2 = tokenizer::tokenize(&compact).unwrap();
        let parsed2 = parser::parse(&tokens2).unwrap();
        assert_eq!(parsed, parsed2);
    }

    #[test]
    fn test_pretty_format_roundtrip() {
        let input = r#"{"a":[1,2,3],"b":{"c":"d"}}"#;
        let tokens = tokenizer::tokenize(input).unwrap();
        let parsed = parser::parse(&tokens).unwrap();
        let pretty = formatter::format_pretty(&parsed, 2);
        let tokens2 = tokenizer::tokenize(&pretty).unwrap();
        let parsed2 = parser::parse(&tokens2).unwrap();
        assert_eq!(parsed, parsed2);
    }
}
```

继续学习请前往 [04-工程实践](/tutorials/rust/04-engineering)。

## 官方文档与延伸阅读

- **官方书籍**：[The Rust Book](https://doc.rust-lang.org/book/) · [中文版](https://kaisery.github.io/trpl-zh-cn/)
- **标准库**：[std 文档](https://doc.rust-lang.org/std/)
- **语言参考**：[The Rust Reference](https://doc.rust-lang.org/reference/)
- **包管理**：[Cargo Book](https://doc.rust-lang.org/cargo/) · [crates.io](https://crates.io/)
- **命令行解析**：[clap](https://docs.rs/clap/latest/clap/)
- **序列化**：[serde](https://serde.rs/) · [serde_json](https://docs.rs/serde_json)
- **错误处理**：[anyhow](https://docs.rs/anyhow) · [thiserror](https://docs.rs/thiserror)
- **测试**：[Rust Book 测试章节](https://doc.rust-lang.org/book/ch11-00-testing.html)
- **版本与规范**：[Edition Guide](https://doc.rust-lang.org/edition-guide/) · [RFCs](https://rust-lang.github.io/rfcs/)

更多入口见 [官方文档索引](/reference/official-docs) 与 [工具链与包管理](/reference/tooling)。

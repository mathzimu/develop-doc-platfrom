# 实战项目：Todo App

## 项目需求

开发一个完整的 Todo App，支持以下功能：

1. 添加待办事项
2. 标记完成 / 未完成
3. 删除待办事项
4. 过滤（全部 / 未完成 / 已完成）
5. 本地存储持久化

## HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Todo App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>待办事项</h1>
    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="输入新任务..." required />
      <button type="submit">添加</button>
    </form>
    <div class="filters">
      <button data-filter="all" class="active">全部</button>
      <button data-filter="active">未完成</button>
      <button data-filter="completed">已完成</button>
    </div>
    <ul id="todo-list"></ul>
    <p class="stats">
      总计: <span id="total-count">0</span> |
      已完成: <span id="completed-count">0</span>
    </p>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

## CSS 样式

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}
.container {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h1 { text-align: center; margin-bottom: 20px; color: #333; }
#todo-form { display: flex; gap: 8px; margin-bottom: 16px; }
#todo-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
#todo-input:focus { border-color: #4a90d9; }
#todo-form button {
  padding: 10px 20px;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
#todo-form button:hover { background: #357abd; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filters button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}
.filters button.active {
  background: #4a90d9;
  color: #fff;
  border-color: #4a90d9;
}
#todo-list { list-style: none; margin-bottom: 16px; }
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 6px;
  transition: background 0.2s;
}
.todo-item:hover { background: #fafafa; }
.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #aaa;
}
.todo-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.todo-text { flex: 1; font-size: 14px; color: #333; }
.delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0.6;
}
.delete-btn:hover { opacity: 1; background: #fdecea; }
.stats { text-align: center; font-size: 13px; color: #999; }
```

## JavaScript 实现

```js
const STORAGE_KEY = 'todos'

let todos = loadTodos()
let currentFilter = 'all'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const totalCount = document.getElementById('total-count')
const completedCount = document.getElementById('completed-count')

// 本地存储读写
function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

// 添加待办事项
function addTodo(text) {
  const todo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }
  todos.push(todo)
  saveTodos()
  render()
}

// 切换完成状态
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    render()
  }
}

// 删除待办事项
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id)
  saveTodos()
  render()
}

// 过滤
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active': return todos.filter(t => !t.completed)
    case 'completed': return todos.filter(t => t.completed)
    default: return todos
  }
}

// 渲染
function render() {
  const filtered = getFilteredTodos()
  list.innerHTML = filtered.map(todo => `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <input type="checkbox" ${todo.completed ? 'checked' : ''} />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" title="删除">✕</button>
    </li>
  `).join('')

  totalCount.textContent = todos.length
  completedCount.textContent = todos.filter(t => t.completed).length
}

// 简单的 HTML 转义（防 XSS）
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 事件绑定
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (text) {
    addTodo(text)
    input.value = ''
    input.focus()
  }
})

list.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const li = e.target.closest('.todo-item')
    toggleTodo(li.dataset.id)
  }
})

list.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const li = e.target.closest('.todo-item')
    deleteTodo(li.dataset.id)
  }
})

document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters .active')?.classList.remove('active')
    btn.classList.add('active')
    currentFilter = btn.dataset.filter
    render()
  })
})

// 初始渲染
render()
```

## 扩展思路

1. **拖拽排序**：使用 `SortableJS` 或原生 Drag & Drop API 支持排序
2. **编辑功能**：双击文本进入编辑模式，保存后更新
3. **分组/标签**：为任务添加标签或分组
4. **搜索**：添加搜索框实时过滤
5. **快捷键**：支持 `Enter` 添加、`Ctrl+Z` 撤销
6. **进度统计**：使用图表展示每日完成情况
7. **多用户**：接入后端 API，支持多设备同步
8. **PWA**：添加 Service Worker，支持离线使用

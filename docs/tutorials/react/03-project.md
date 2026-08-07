# 实战项目：GitHub 用户搜索

完整项目：React + Vite + TypeScript + TanStack Query + Tailwind CSS

## 项目初始化

```sh
npm create vite@latest github-user-search -- --template react-ts
cd github-user-search
npm install @tanstack/react-query
npm install -D tailwindcss @tailwindcss/vite
```

配置 Tailwind：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## API 层

```ts
// src/api/github.ts
const GITHUB_API = 'https://api.github.com'

export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
  type: string
  score: number
}

export interface UserDetail extends GitHubUser {
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  location: string | null
  blog: string | null
  company: string | null
  created_at: string
}

export interface SearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubUser[]
}

export async function searchUsers(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<SearchResponse> {
  const res = await fetch(
    `${GITHUB_API}/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
  )
  if (!res.ok) {
    if (res.status === 403) throw new Error('API 限流，请稍后再试')
    throw new Error('搜索失败')
  }
  return res.json()
}

export async function getUserDetail(username: string): Promise<UserDetail> {
  const res = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('用户不存在')
    throw new Error('获取用户详情失败')
  }
  return res.json()
}
```

## Hooks

```ts
// src/hooks/useUserSearch.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { searchUsers } from '../api/github'

export function useUserSearch(query: string, page: number) {
  return useQuery({
    queryKey: ['users', query, page],
    queryFn: () => searchUsers(query, page),
    enabled: query.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: 1,
  })
}

// src/hooks/useUserDetail.ts
import { useQuery } from '@tanstack/react-query'
import { getUserDetail } from '../api/github'

export function useUserDetail(username: string | null) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUserDetail(username!),
    enabled: !!username,
    staleTime: 5 * 60_000,
  })
}
```

## Provider 设置

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
```

## 搜索组件

```tsx
// src/components/SearchBar.tsx
import { useState, useCallback } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(value.trim())
    },
    [value, onSearch]
  )

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="搜索 GitHub 用户..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>
  )
}
```

## 用户列表组件

```tsx
// src/components/UserList.tsx
import type { GitHubUser } from '../api/github'

interface UserListProps {
  users: GitHubUser[]
  onSelect: (username: string) => void
}

export function UserList({ users, onSelect }: UserListProps) {
  if (users.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        没有找到匹配的用户
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onSelect(user.login)}
          className="flex items-center gap-3 p-4 bg-white rounded-lg border
                     border-gray-200 hover:shadow-md hover:border-blue-300
                     transition-all text-left"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-12 h-12 rounded-full"
          />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.login}</p>
            <p className="text-sm text-gray-500 truncate">{user.type}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
```

## 用户详情

```tsx
// src/components/UserDetail.tsx
import { useUserDetail } from '../hooks/useUserDetail'

interface UserDetailProps {
  username: string | null
  onClose: () => void
}

export function UserDetail({ username, onClose }: UserDetailProps) {
  const { data: user, isLoading, isError, error } = useUserDetail(username)

  if (!username) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
         onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
           onClick={e => e.stopPropagation()}>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500
                            border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-500">{error?.message}</p>
          </div>
        )}

        {user && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img src={user.avatar_url} alt={user.login}
                   className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-xl font-bold">{user.name || user.login}</h2>
                <p className="text-gray-500">@{user.login}</p>
              </div>
            </div>

            {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold">{user.public_repos}</p>
                <p className="text-xs text-gray-500">仓库</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{user.followers}</p>
                <p className="text-xs text-gray-500">粉丝</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{user.following}</p>
                <p className="text-xs text-gray-500">关注</p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              {user.location && <p>📍 {user.location}</p>}
              {user.company && <p>🏢 {user.company}</p>}
              {user.blog && <p>🔗 {user.blog}</p>}
              <p>📅 {new Date(user.created_at).toLocaleDateString('zh-CN')} 加入</p>
            </div>

            <a href={user.html_url} target="_blank" rel="noopener noreferrer"
               className="mt-6 block text-center py-2 bg-gray-900 text-white
                          rounded-lg hover:bg-gray-800 transition-colors">
              GitHub 主页 →
            </a>
          </>
        )}

        <button onClick={onClose}
                className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700">
          关闭
        </button>
      </div>
    </div>
  )
}
```

## 分页组件

```tsx
// src/components/Pagination.tsx
interface PaginationProps {
  page: number
  totalCount: number
  perPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalCount, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.min(Math.ceil(totalCount / perPage), 100) // GitHub 限制最大 100 页

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition-colors"
      >
        上一页
      </button>

      <span className="px-4 py-2 text-sm text-gray-600">
        第 {page} / {totalPages} 页
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition-colors"
      >
        下一页
      </button>
    </div>
  )
}
```

## 主应用组装

```tsx
// src/App.tsx
import { useState, useCallback } from 'react'
import { SearchBar } from './components/SearchBar'
import { UserList } from './components/UserList'
import { UserDetail } from './components/UserDetail'
import { Pagination } from './components/Pagination'
import { useUserSearch } from './hooks/useUserSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useUserSearch(query, page)

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    setPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          GitHub 用户搜索
        </h1>
        <p className="text-center text-gray-500 mb-8">
          输入用户名搜索 GitHub 用户
        </p>

        <SearchBar onSearch={handleSearch} />

        {!query && (
          <p className="text-center text-gray-400 mt-16">
            输入关键词开始搜索
          </p>
        )}

        {isLoading && (
          <div className="text-center mt-16">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500
                            border-t-transparent rounded-full mx-auto" />
            <p className="mt-3 text-gray-500">搜索中...</p>
          </div>
        )}

        {isError && (
          <div className="text-center mt-16">
            <p className="text-red-500 font-medium">{error?.message}</p>
          </div>
        )}

        {data && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              找到 {data.total_count} 个结果
            </p>
            <UserList users={data.items} onSelect={setSelectedUser} />
            <Pagination
              page={page}
              totalCount={data.total_count}
              perPage={20}
              onPageChange={setPage}
            />
          </>
        )}

        <UserDetail
          username={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  )
}
```

## 官方文档

| 主题 | 链接 |
|------|------|
| React 核心 | [react.dev](https://react.dev/learn) · [React 中文](https://zh-hans.react.dev/learn) |
| 数据获取 | [TanStack Query](https://tanstack.com/query/latest/docs) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/docs) |
| 脚手架 | [Vite](https://vite.dev/guide/) |
| 测试 | [Vitest](https://vitest.dev/) · [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |

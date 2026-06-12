import fs from 'node:fs'
import path from 'node:path'

const docsDir = path.resolve(__dirname, '..')

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

function parseTitle(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/^#\s+(.+)/m)
  return match ? match[1].trim() : path.basename(filePath, '.md')
}

function getSortedFiles(dir: string): string[] {
  const files = fs.readdirSync(dir)
  return files
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort((a, b) => {
      const aIsNumbered = /^\d+/.test(a)
      const bIsNumbered = /^\d+/.test(b)
      if (aIsNumbered && bIsNumbered) {
        const aNum = parseInt(a.match(/^(\d+)/)![1])
        const bNum = parseInt(b.match(/^(\d+)/)![1])
        return aNum - bNum
      }
      if (aIsNumbered) return -1
      if (bIsNumbered) return 1
      return a.localeCompare(b)
    })
}

function generateSidebarForDir(dir: string): SidebarItem[] {
  const items: SidebarItem[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const indexFile = path.join(dir, 'index.md')
  const hasIndex = fs.existsSync(indexFile)

  const dirs = entries.filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))
  const files = getSortedFiles(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const name = file.replace(/\.md$/, '')
    const title = parseTitle(filePath)
    const relativePath = path.relative(docsDir, filePath).replace(/\.md$/, '')
    items.push({
      text: title,
      link: `/${relativePath}`,
    })
  }

  for (const subdir of dirs) {
    if (subdir.name.startsWith('.')) continue
    if (subdir.name === 'versions') continue
    const subdirPath = path.join(dir, subdir.name)
    const subIndexFile = path.join(subdirPath, 'index.md')
    const hasSubIndex = fs.existsSync(subIndexFile)
    const children = generateSidebarForDir(subdirPath)

    if (children.length > 0) {
      items.push({
        text: hasSubIndex ? parseTitle(subIndexFile) : subdir.name,
        collapsed: true,
        items: children,
      })
    }
  }

  if (hasIndex && items.length > 0) {
    const indexTitle = parseTitle(indexFile)
    return [{ text: indexTitle, items }]
  }

  return items
}

export function generateSidebar() {
  const excludeDirs = ['versions', '.vitepress', 'public', 'assets']
  const sidebar: Record<string, SidebarItem[]> = {}

  const entries = fs.readdirSync(docsDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (excludeDirs.includes(entry.name)) continue
    const dirPath = path.join(docsDir, entry.name)
    const items = generateSidebarForDir(dirPath)
    if (items.length > 0) {
      sidebar[`/${entry.name}/`] = items
    }
  }

  return sidebar
}

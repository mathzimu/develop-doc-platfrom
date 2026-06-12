import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar'

const sidebar = generateSidebar()

export default defineConfig({
  title: 'Developer Doc Platform',
  description: 'A modern developer documentation platform built with VitePress',

  lang: 'zh-CN',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API 参考', link: '/api/', activeMatch: '/api/' },
      { text: '高级', link: '/advanced/', activeMatch: '/advanced/' },
      {
        text: '版本',
        items: [
          { text: 'v1.0 (最新)', link: '/' },
          { text: 'v0.9', link: '/versions/v0.9/' },
        ],
      },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mathzimu/develop_doc_platfrom' },
    ],

    editLink: {
      pattern: 'https://github.com/mathzimu/develop_doc_platfrom/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      message: '基于 MIT 协议发布',
      copyright: `Copyright © ${new Date().getFullYear()} mathzimu`,
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除搜索条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',

    langMenuLabel: '语言',
  },

  vite: {
    ssr: {
      noExternal: [],
    },
  },
})

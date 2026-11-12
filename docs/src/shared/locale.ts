import type { DocsLocale } from 'virtual:am-docs'
import { docs } from 'virtual:am-docs'
import { computed, reactive } from 'vue'

export type { DocsLocale }

export const LOCALE_STORAGE_KEY = 'am-docs-locale'

function isLocale(value: unknown): value is DocsLocale {
  return value === 'zh-CN' || value === 'en-US'
}

/** The locale the visitor picked (or was last served), `undefined` on a first visit. */
export function storedLocale(): DocsLocale | undefined {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    return isLocale(saved) ? saved : undefined
  }
  catch {
    return undefined
  }
}

export function browserLocale(): DocsLocale {
  return typeof navigator !== 'undefined' && /^zh\b/i.test(navigator.language) ? 'zh-CN' : 'en-US'
}

let state: { locale: DocsLocale } | undefined

/**
 * Locale shared by the documentation site and the simulator iframe.
 * Both documents are same-origin, so the `storage` event keeps them in sync.
 */
export function useDocsLocale() {
  if (state)
    return state
  const current = reactive({ locale: storedLocale() ?? browserLocale() })
  state = current
  window.addEventListener('storage', (event) => {
    if (event.key === LOCALE_STORAGE_KEY && isLocale(event.newValue))
      current.locale = event.newValue
  })
  return current
}

/** Written synchronously so an iframe created right after already reads the new value. */
export function setDocsLocale(locale: DocsLocale) {
  useDocsLocale().locale = locale
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
  catch {}
}

/** Component / guide registry of the current locale. */
export function useDocs() {
  const current = useDocsLocale()
  return computed(() => docs[current.locale])
}

/**
 * Site paths follow antdv-next: English has no suffix, Chinese ends with `-cn`
 * (`/components/button` <-> `/components/button-cn`, `/` <-> `/index-cn`).
 */
export function localizePath(path: string, locale: DocsLocale) {
  const base = path.replace(/\/+$/, '').replace(/-cn$/, '').replace(/^\/index$/, '')
  if (locale === 'zh-CN')
    return base ? `${base}-cn` : '/index-cn'
  return base || '/'
}

const messages = {
  'zh-CN': {
    slogan: 'Vue 3 移动端组件库',
    nav: { guide: '指南', components: '组件', pc: 'PC 组件库' },
    switchLocale: 'English',
    switchLocaleShort: 'EN',
    theme: {
      customize: '主题定制',
      primary: '主色',
      custom: '自定义',
      customPrimary: '自定义主色',
      radius: '圆角',
      algorithm: '算法',
      light: '亮色',
      dark: '暗色',
      compact: '紧凑',
      reset: '恢复默认',
      toLight: '切换到亮色',
      toDark: '切换到暗色',
      toggle: '切换明暗',
      primaryNames: { blue: '拂晓蓝', green: '极光绿', purple: '酱紫', orange: '火山橙', magenta: '法式洋红', cyan: '明青' } as Record<string, string>,
      radiusNames: { sharp: '直角', default: '默认', round: '圆润' } as Record<string, string>,
    },
    sidebar: { search: '搜索组件', empty: '没有匹配的组件' },
    demo: {
      focus: '在模拟器中查看',
      copy: '复制代码',
      copied: '已复制',
      collapse: '收起代码',
      expand: (lines: number) => `展开全部 ${lines} 行`,
    },
    simulator: { reload: '刷新', reloadLabel: '刷新模拟器', open: '在新窗口打开', frame: '移动端预览' },
    toc: '本页目录',
    home: {
      badge: 'Vue 3 · 移动端组件库',
      desc: '与 antdv-next 同源的移动端 UI 组件库。API 对齐 PC 端，体验专为触屏打造，基于 CSS 变量的主题系统让全局换肤只需一行配置。',
      start: '开始使用',
      browse: (count: number) => `浏览 ${count} 个组件`,
      features: [
        { title: '与 PC 端 API 对齐', desc: '属性、事件、插槽、静态方法与 antdv-next 保持一致，一套心智同时覆盖桌面端与移动端。' },
        { title: '为触屏而生', desc: '手势、惯性滚动、安全区、按压反馈，弹层统一从底部滑出，每个组件都按移动端体验重新设计。' },
        { title: '纯 CSS 变量主题', desc: '零运行时样式。覆盖一个变量即可换肤，亮色 / 暗色 / 紧凑算法可自由组合、可嵌套。' },
        { title: 'Vue 3 script setup', desc: '全部组件采用 <script setup> + TypeScript 编写，类型完备，支持按需引入与 Tree Shaking。' },
        { title: '国际化', desc: '内置中英文语言包，通过 ConfigProvider 一处配置全局生效，静态方法同样适用。' },
        { title: '表单开箱即用', desc: 'Form、校验规则与所有录入组件深度集成，选择器、日期、级联等都是标准表单字段。' },
      ],
    },
    mobile: {
      desc: (count: number) => `与 antdv-next API 对齐的 Vue 3 移动端组件库，共 ${count} 个组件。`,
      back: '返回',
      notFound: (name: string) => `未找到组件 ${name}`,
      loading: '加载中...',
    },
  },
  'en-US': {
    slogan: 'Mobile UI components for Vue 3',
    nav: { guide: 'Guide', components: 'Components', pc: 'PC library' },
    switchLocale: '中文',
    switchLocaleShort: '中',
    theme: {
      customize: 'Customize theme',
      primary: 'Primary color',
      custom: 'Custom',
      customPrimary: 'Custom primary color',
      radius: 'Radius',
      algorithm: 'Algorithm',
      light: 'Light',
      dark: 'Dark',
      compact: 'Compact',
      reset: 'Reset',
      toLight: 'Switch to light',
      toDark: 'Switch to dark',
      toggle: 'Toggle color scheme',
      primaryNames: { blue: 'Daybreak Blue', green: 'Polar Green', purple: 'Golden Purple', orange: 'Volcano', magenta: 'Magenta', cyan: 'Cyan' } as Record<string, string>,
      radiusNames: { sharp: 'Sharp', default: 'Default', round: 'Round' } as Record<string, string>,
    },
    sidebar: { search: 'Search components', empty: 'No matching component' },
    demo: {
      focus: 'Show in simulator',
      copy: 'Copy code',
      copied: 'Copied',
      collapse: 'Collapse code',
      expand: (lines: number) => `Show all ${lines} lines`,
    },
    simulator: { reload: 'Reload', reloadLabel: 'Reload simulator', open: 'Open in new window', frame: 'Mobile preview' },
    toc: 'On this page',
    home: {
      badge: 'Vue 3 · Mobile component library',
      desc: 'The mobile UI library of the antdv-next family. Its API mirrors the PC library, every interaction is designed for touch, and a theme system built on CSS variables restyles the whole app with one line.',
      start: 'Get started',
      browse: (count: number) => `Browse ${count} components`,
      features: [
        { title: 'Same API as PC', desc: 'Props, events, slots and static methods match antdv-next, so one mental model covers desktop and mobile.' },
        { title: 'Made for touch', desc: 'Gestures, momentum scrolling, safe areas and press feedback. Popups slide up from the bottom, and every component is redesigned for mobile.' },
        { title: 'Pure CSS variable theme', desc: 'Zero runtime styles. Override one variable to restyle; light, dark and compact algorithms combine and nest freely.' },
        { title: 'Vue 3 script setup', desc: 'Every component is written with <script setup> and TypeScript: fully typed, tree-shakable, imported on demand.' },
        { title: 'Internationalization', desc: 'Chinese and English language packs are built in. Configure once on ConfigProvider; static methods follow it too.' },
        { title: 'Forms out of the box', desc: 'Form and its validation rules work with every data-entry component: pickers, dates and cascaders are standard form fields.' },
      ],
    },
    mobile: {
      desc: (count: number) => `Mobile UI components for Vue 3, API-aligned with antdv-next. ${count} components.`,
      back: 'Back',
      notFound: (name: string) => `Component ${name} not found`,
      loading: 'Loading...',
    },
  },
}

/** UI texts of the site and the simulator app in the current locale. */
export function useMessages() {
  const current = useDocsLocale()
  return computed(() => messages[current.locale])
}

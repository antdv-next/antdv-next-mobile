/// <reference types="vite/client" />

declare module '*.md' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare module 'virtual:am-docs' {
  import type { Component } from 'vue'

  export interface DemoEntry {
    id: string
    title: string
    full: boolean
    load: () => Promise<{ default: Component }>
  }
  export interface ComponentEntry {
    name: string
    title: string
    subtitle: string
    description: string
    group: string
    groupOrder: number
    order: number
    page: () => Promise<{ default: Component }>
    demos: DemoEntry[]
  }
  export interface GuideEntry {
    name: string
    title: string
    group: string
    groupOrder: number
    order: number
    page: () => Promise<{ default: Component }>
  }
  export type DocsLocale = 'zh-CN' | 'en-US'
  export interface DocsRegistry {
    components: ComponentEntry[]
    guides: GuideEntry[]
  }
  /** One registry per locale; a page without a translation falls back to `zh-CN`. */
  export const docs: Record<DocsLocale, DocsRegistry>
}

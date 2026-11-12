import type { DocsLocale } from 'virtual:am-docs'
import type { RouteRecordRaw } from 'vue-router'
import { docs } from 'virtual:am-docs'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { browserLocale, localizePath, setDocsLocale, storedLocale } from '../shared/locale'

const locales = Object.keys(docs) as DocsLocale[]

const defaultTitle: Record<DocsLocale, string> = {
  'zh-CN': 'Antdv Mobile - Vue 3 移动端组件库',
  'en-US': 'Antdv Mobile - Mobile UI components for Vue 3',
}

/** First guide / component page of a locale, used by the nav links and the section redirects. */
export function entryLinks(locale: DocsLocale) {
  const { components, guides } = docs[locale]
  const firstComponent = components.find(c => c.name === 'button') ?? components[0]
  return {
    guide: localizePath(guides[0] ? `/docs/${guides[0].name}` : '/', locale),
    component: localizePath(firstComponent ? `/components/${firstComponent.name}` : '/', locale),
  }
}

// English lives at `/components/button`, Chinese at `/components/button-cn` (same scheme as antdv-next).
const docRoutes: RouteRecordRaw[] = locales.flatMap((locale) => {
  const { components, guides } = docs[locale]
  return [
    ...guides.map(guide => ({
      path: localizePath(`/docs/${guide.name}`, locale).slice(1),
      component: guide.page,
      meta: { type: 'guide', name: guide.name, title: guide.title, locale },
    })),
    ...components.map(component => ({
      path: localizePath(`/components/${component.name}`, locale).slice(1),
      component: component.page,
      meta: { type: 'component', name: component.name, title: [component.title, component.subtitle].filter(Boolean).join(' '), locale },
    })),
  ]
})

const Home = () => import('./pages/Home.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...locales.map(locale => ({ path: localizePath('/', locale), component: Home, meta: { type: 'home', locale } })),
    { path: '/', component: () => import('./layouts/DocLayout.vue'), children: docRoutes },
    ...locales.flatMap(locale => [
      { path: localizePath('/docs', locale), redirect: entryLinks(locale).guide },
      { path: localizePath('/components', locale), redirect: entryLinks(locale).component },
    ]),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved)
      return saved
    if (to.hash)
      return { el: decodeURIComponent(to.hash), top: 88, behavior: 'smooth' }
    if (to.path !== from.path)
      return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  const locale = to.meta.locale as DocsLocale | undefined
  if (!locale)
    return
  // First visit without a saved choice: a Chinese browser gets the Chinese page of the same url.
  if (from === START_LOCATION && locale === 'en-US' && !storedLocale() && browserLocale() === 'zh-CN')
    return { path: localizePath(to.path, 'zh-CN'), query: to.query, hash: to.hash, replace: true }
  setDocsLocale(locale)
})

router.afterEach((to) => {
  const locale = (to.meta.locale as DocsLocale | undefined) ?? 'en-US'
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - Antdv Mobile` : defaultTitle[locale]
  document.documentElement.lang = locale
})

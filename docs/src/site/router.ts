import type { RouteRecordRaw } from 'vue-router'
import { components, guides } from 'virtual:am-docs'
import { createRouter, createWebHistory } from 'vue-router'

const docRoutes: RouteRecordRaw[] = [
  ...guides.map(guide => ({
    path: `docs/${guide.name}`,
    component: guide.page,
    meta: { type: 'guide', name: guide.name, title: guide.title },
  })),
  ...components.map(component => ({
    path: `components/${component.name}`,
    component: component.page,
    meta: { type: 'component', name: component.name, title: `${component.title} ${component.subtitle}` },
  })),
]

const firstGuide = guides[0] ? `/docs/${guides[0].name}` : '/'
const firstComponent = components.find(c => c.name === 'button') ?? components[0]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue'), meta: { type: 'home' } },
    { path: '/', component: () => import('./layouts/DocLayout.vue'), children: docRoutes },
    { path: '/docs', redirect: firstGuide },
    { path: '/components', redirect: firstComponent ? `/components/${firstComponent.name}` : '/' },
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

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - Antdv Next Mobile` : 'Antdv Next Mobile - Vue 3 移动端组件库'
})

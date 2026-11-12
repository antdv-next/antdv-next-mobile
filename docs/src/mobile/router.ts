import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/:name', component: () => import('./pages/Demo.vue'), props: true },
  ],
  scrollBehavior(to, from, saved) {
    if (saved)
      return saved
    if (to.path !== from.path)
      return { top: 0 }
  },
})

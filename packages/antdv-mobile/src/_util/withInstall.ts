import type { App, Plugin } from 'vue'

export type WithInstall<T, E = object> = T & E & Plugin

/** Adds `install` to a component (and optional sub components / static methods). */
export function withInstall<T extends { name?: string, __name?: string }, E extends Record<string, any> = object>(
  component: T,
  name: string,
  extra?: E,
): WithInstall<T, E> {
  const comp = component as any
  comp.name = name
  if (extra)
    Object.assign(comp, extra)
  comp.install = (app: App) => {
    app.component(name, comp)
    if (extra) {
      Object.values(extra).forEach((sub: any) => {
        if (sub && typeof sub === 'object' && typeof sub.name === 'string' && sub.name.startsWith('Am') && (sub.setup || sub.render || sub.__name))
          app.component(sub.name, sub)
      })
    }
  }
  return comp
}

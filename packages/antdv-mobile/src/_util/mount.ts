import type { App, Component } from 'vue'
import { createApp, h } from 'vue'
import ConfigProvider from '../config-provider/ConfigProvider.vue'
import { globalConfig } from '../config-provider/context'
import { inBrowser } from './index'

export interface MountResult {
  app: App
  /** Unmounts the app and removes its holder element. */
  unmount: () => void
}

/**
 * Mounts a root component into a detached holder under `document.body`.
 * Used by static APIs (`Modal.confirm`, `message`, `toast`, `ImagePreview` ...).
 * The tree is wrapped by a ConfigProvider fed with `ConfigProvider.config()` values,
 * so static calls follow the global theme and locale.
 */
export function mountComponent(render: () => any, appContext?: App['_context'] | null): MountResult {
  if (!inBrowser) {
    return { app: null as any, unmount() {} }
  }
  const holder = document.createElement('div')
  holder.className = 'am-static-holder'
  document.body.appendChild(holder)

  const Root: Component = {
    name: 'AmStaticRoot',
    render() {
      return h(
        ConfigProvider as any,
        { theme: globalConfig.theme, locale: globalConfig.locale, direction: globalConfig.direction },
        { default: render },
      )
    },
  }
  const app = createApp(Root)
  if (appContext) {
    // share globally registered components / provides of the host app
    Object.assign(app._context, { ...appContext, app: app._context.app })
  }
  app.mount(holder)

  let unmounted = false
  return {
    app,
    unmount() {
      if (unmounted)
        return
      unmounted = true
      app.unmount()
      holder.parentNode?.removeChild(holder)
    },
  }
}

import type { App } from 'vue'
import * as components from './components'
import version from './version'

export type { GetContainer, RenderNodeFn, SizeType, ValidateStatus, VueNode } from './_util/type'
export * from './components'
export { useConfig, useDisabled, useSize } from './config-provider'
export type { FormItemInputContext, Variant } from './form/context'
export { useFormItemInputContext, useMergedStatus, useVariant } from './form/context'
export * from './hooks'
export type { Locale } from './locale'
export { useLocale } from './locale'
export { applyTheme, compactAlgorithm, cssVar, darkAlgorithm, defaultAlgorithm, default as theme, useToken } from './theme'
export type * from './theme'
export { version }

export function install(app: App) {
  Object.values(components).forEach((component: any) => {
    if (component && typeof component.install === 'function')
      app.use(component)
  })
  return app
}

export default {
  version,
  install,
}

import type { ComputedRef, InjectionKey } from 'vue'
import type { DirectionType, SizeType } from '../_util/type'
import type { Locale } from '../locale/interface'
import type { ResolvedTheme, ThemeConfig } from '../theme/interface'
import { computed, inject, shallowReactive } from 'vue'
import zhCN from '../locale/zh_CN'
import { resolveTheme } from '../theme/util'

export interface ConfigProviderProps {
  /** Theme config, aligned with antdv-next: `{ algorithm, token, components }`. */
  theme?: ThemeConfig
  /** Language package, e.g. `import enUS from '@antdv-next/mobile/locale/en_US'`. */
  locale?: Locale
  /** Default size of all components. */
  componentSize?: SizeType
  /** Disable all components. */
  componentDisabled?: boolean
  direction?: DirectionType
  /** Default mount node of popups (Popup / Modal / Picker ...). */
  getPopupContainer?: () => HTMLElement
}

export interface ConfigProviderSlots {
  default?: () => any
}

export interface ConfigContext {
  locale: ComputedRef<Locale>
  direction: ComputedRef<DirectionType>
  componentSize: ComputedRef<SizeType>
  componentDisabled: ComputedRef<boolean | undefined>
  getPopupContainer: ComputedRef<(() => HTMLElement) | undefined>
  /** Merged (inherited) theme config. */
  themeConfig: ComputedRef<ThemeConfig | undefined>
  /** Class names + css variables to put on a theme scope element (e.g. teleported popup root). */
  theme: ComputedRef<ResolvedTheme>
}

export const configContextKey: InjectionKey<ConfigContext> = Symbol('AmConfigContext')

export interface GlobalConfig {
  theme?: ThemeConfig
  locale?: Locale
  direction?: DirectionType
}

/** Global config used by components rendered outside any ConfigProvider (incl. static APIs such as `Modal.confirm`). */
export const globalConfig = shallowReactive<GlobalConfig>({})

/** `ConfigProvider.config({ theme, locale })`: config for static methods (message / Modal.confirm / toast ...). */
export function setGlobalConfig(config: GlobalConfig) {
  Object.assign(globalConfig, config)
}

const defaultContext: ConfigContext = {
  locale: computed(() => globalConfig.locale ?? zhCN),
  direction: computed(() => globalConfig.direction),
  componentSize: computed(() => undefined),
  componentDisabled: computed(() => undefined),
  getPopupContainer: computed(() => undefined),
  themeConfig: computed(() => globalConfig.theme),
  theme: computed(() => {
    const resolved = resolveTheme(globalConfig.theme)
    // Without any provider the tokens of `:root` apply; only add a scope when a global theme exists.
    return globalConfig.theme ? resolved : { ...resolved, className: [] }
  }),
}

export function useConfig(): ConfigContext {
  return inject(configContextKey, defaultContext)
}

/** `props.size` > ConfigProvider `componentSize`. */
export function useSize(size: () => SizeType): ComputedRef<SizeType> {
  const config = useConfig()
  return computed(() => size() ?? config.componentSize.value)
}

/** Provided by Form (`disabled` prop) so every field inside follows it. */
export const disabledContextKey: InjectionKey<ComputedRef<boolean | undefined>> = Symbol('AmDisabledContext')

/** `props.disabled` > Form `disabled` > ConfigProvider `componentDisabled`. */
export function useDisabled(disabled: () => boolean | undefined): ComputedRef<boolean> {
  const config = useConfig()
  const formDisabled = inject(disabledContextKey, undefined)
  return computed(() => disabled() ?? formDisabled?.value ?? config.componentDisabled.value ?? false)
}

/** Class + style that a teleported root must carry so it keeps the theme of its ConfigProvider. */
export function usePopupTheme() {
  const config = useConfig()
  return computed(() => ({
    class: config.theme.value.className,
    style: config.theme.value.style,
    dir: config.direction.value,
  }))
}

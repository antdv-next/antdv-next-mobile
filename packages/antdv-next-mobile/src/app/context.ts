import type { ComputedRef, InjectionKey } from 'vue'
import type { AppConfig, UseAppProps } from './interface'
import { inject, provide } from 'vue'

const appConfigContextKey: InjectionKey<ComputedRef<AppConfig>> = Symbol('AmAppConfigContext')

/** Merged `message` / `notification` / `toast` config of the surrounding App (nested Apps inherit it). */
export function useAppConfig(): ComputedRef<AppConfig> | undefined {
  return inject(appConfigContextKey, undefined)
}

export function provideAppConfig(config: ComputedRef<AppConfig>) {
  provide(appConfigContextKey, config)
}

const appContextKey: InjectionKey<UseAppProps> = Symbol('AmAppContext')

/** Same as antdv-next: outside an App the instances are empty objects. */
export function useAppContext(): UseAppProps {
  return inject(appContextKey, { message: {}, notification: {}, modal: {}, toast: {} } as UseAppProps)
}

export function provideAppContext(value: UseAppProps) {
  provide(appContextKey, value)
}

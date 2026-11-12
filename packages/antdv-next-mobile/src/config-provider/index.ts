import { withInstall } from '../_util/withInstall'
import ConfigProviderVue from './ConfigProvider.vue'
import { setGlobalConfig } from './context'

export type { ConfigContext, ConfigProviderProps, ConfigProviderSlots, GlobalConfig } from './context'
export { disabledContextKey, globalConfig, setGlobalConfig, useConfig, useDisabled, usePopupTheme, useSize } from './context'

const ConfigProvider = withInstall(ConfigProviderVue, 'AmConfigProvider', {
  /** Global config for static methods and components outside any provider. */
  config: setGlobalConfig,
})

export default ConfigProvider

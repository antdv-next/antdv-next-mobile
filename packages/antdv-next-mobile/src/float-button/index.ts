import { withInstall } from '../_util/withInstall'
import BackTopVue from './BackTop.vue'
import FloatButtonVue from './FloatButton.vue'
import FloatButtonGroupVue from './FloatButtonGroup.vue'

export type * from './interface'

export const FloatButtonGroup = withInstall(FloatButtonGroupVue, 'AmFloatButtonGroup')
export const BackTop = withInstall(BackTopVue, 'AmBackTop')

const FloatButton = withInstall(FloatButtonVue, 'AmFloatButton', {
  Group: FloatButtonGroup,
  BackTop,
})

export default FloatButton

import { withInstall } from '../_util/withInstall'
import SwitchVue from './Switch.vue'

export type * from './interface'

const Switch = withInstall(SwitchVue, 'AmSwitch')

export default Switch

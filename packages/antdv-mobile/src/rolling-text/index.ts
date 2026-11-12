import { withInstall } from '../_util/withInstall'
import RollingTextVue from './RollingText.vue'

export type * from './interface'

const RollingText = withInstall(RollingTextVue, 'AmRollingText')

export default RollingText

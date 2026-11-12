import { withInstall } from '../_util/withInstall'
import DividerVue from './Divider.vue'

export type * from './interface'

const Divider = withInstall(DividerVue, 'AmDivider')

export default Divider

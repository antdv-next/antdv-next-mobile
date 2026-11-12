import { withInstall } from '../_util/withInstall'
import MaskVue from './Mask.vue'

export type * from './interface'

const Mask = withInstall(MaskVue, 'AmMask')

export default Mask

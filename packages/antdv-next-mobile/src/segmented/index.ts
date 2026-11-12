import { withInstall } from '../_util/withInstall'
import SegmentedVue from './Segmented.vue'

export type * from './interface'

const Segmented = withInstall(SegmentedVue, 'AmSegmented')

export default Segmented

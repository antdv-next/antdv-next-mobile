import { withInstall } from '../_util/withInstall'
import VirtualListVue from './VirtualList.vue'

export type * from './interface'

const VirtualList = withInstall(VirtualListVue, 'AmVirtualList')

export default VirtualList

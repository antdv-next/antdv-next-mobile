import { withInstall } from '../_util/withInstall'
import InfiniteScrollVue from './InfiniteScroll.vue'

export type * from './interface'

const InfiniteScroll = withInstall(InfiniteScrollVue, 'AmInfiniteScroll')

export default InfiniteScroll

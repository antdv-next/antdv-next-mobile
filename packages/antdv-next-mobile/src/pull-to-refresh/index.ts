import { withInstall } from '../_util/withInstall'
import PullToRefreshVue from './PullToRefresh.vue'

export type * from './interface'

const PullToRefresh = withInstall(PullToRefreshVue, 'AmPullToRefresh')

export default PullToRefresh

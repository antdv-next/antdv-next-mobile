import { withInstall } from '../_util/withInstall'
import TabBarVue from './TabBar.vue'

export type * from './interface'

const TabBar = withInstall(TabBarVue, 'AmTabBar')

export default TabBar

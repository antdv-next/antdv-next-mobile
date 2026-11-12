import { withInstall } from '../_util/withInstall'
import TabsVue from './Tabs.vue'

export type * from './interface'

const Tabs = withInstall(TabsVue, 'AmTabs')

export default Tabs

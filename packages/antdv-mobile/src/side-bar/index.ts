import { withInstall } from '../_util/withInstall'
import SideBarVue from './SideBar.vue'

export type * from './interface'

const SideBar = withInstall(SideBarVue, 'AmSideBar')

export default SideBar

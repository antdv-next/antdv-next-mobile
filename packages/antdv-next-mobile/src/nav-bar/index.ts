import { withInstall } from '../_util/withInstall'
import NavBarVue from './NavBar.vue'

export type * from './interface'

const NavBar = withInstall(NavBarVue, 'AmNavBar')

export default NavBar

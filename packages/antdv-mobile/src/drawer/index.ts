import { withInstall } from '../_util/withInstall'
import DrawerVue from './Drawer.vue'

export type * from './interface'

const Drawer = withInstall(DrawerVue, 'AmDrawer')

export default Drawer

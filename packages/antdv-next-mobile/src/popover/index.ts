import { withInstall } from '../_util/withInstall'
import PopoverVue from './Popover.vue'

export type * from './interface'

const Popover = withInstall(PopoverVue, 'AmPopover')

export default Popover

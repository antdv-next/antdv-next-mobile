import { withInstall } from '../_util/withInstall'
import DropdownVue from './Dropdown.vue'
import DropdownItemVue from './DropdownItem.vue'

export type * from './interface'

export const DropdownItem = withInstall(DropdownItemVue, 'AmDropdownItem')

const Dropdown = withInstall(DropdownVue, 'AmDropdown', { Item: DropdownItem })

export default Dropdown

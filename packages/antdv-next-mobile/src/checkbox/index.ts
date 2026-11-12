import { withInstall } from '../_util/withInstall'
import CheckboxVue from './Checkbox.vue'
import CheckboxGroupVue from './CheckboxGroup.vue'

export type * from './interface'

export const CheckboxGroup = withInstall(CheckboxGroupVue, 'AmCheckboxGroup')

const Checkbox = withInstall(CheckboxVue, 'AmCheckbox', { Group: CheckboxGroup })

export default Checkbox

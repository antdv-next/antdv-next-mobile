import { withInstall } from '../_util/withInstall'
import SelectVue from './Select.vue'

export type * from './interface'

const Select = withInstall(SelectVue, 'AmSelect')

export default Select

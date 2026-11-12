import { withInstall } from '../_util/withInstall'
import PickerViewVue from './PickerView.vue'

export type * from './interface'

const PickerView = withInstall(PickerViewVue, 'AmPickerView')

export default PickerView

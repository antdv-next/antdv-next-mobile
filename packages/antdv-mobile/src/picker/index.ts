import { withInstall } from '../_util/withInstall'
import PickerVue from './Picker.vue'

export type * from './interface'

const Picker = withInstall(PickerVue, 'AmPicker')

export default Picker

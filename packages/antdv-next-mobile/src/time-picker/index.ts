import { withInstall } from '../_util/withInstall'
import TimePickerVue from './TimePicker.vue'

export type * from './interface'

const TimePicker = withInstall(TimePickerVue, 'AmTimePicker')

export default TimePicker

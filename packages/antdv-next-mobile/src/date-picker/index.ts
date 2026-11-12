import { withInstall } from '../_util/withInstall'
import DatePickerVue from './DatePicker.vue'
import DatePickerViewVue from './DatePickerView.vue'

export type * from './interface'

export const DatePickerView = withInstall(DatePickerViewVue, 'AmDatePickerView')

const DatePicker = withInstall(DatePickerVue, 'AmDatePicker', { View: DatePickerView })

export default DatePicker

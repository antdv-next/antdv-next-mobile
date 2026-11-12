import { withInstall } from '../_util/withInstall'
import DatePickerVue from './DatePicker.vue'
import DatePickerViewVue from './DatePickerView.vue'
import RangePickerVue from './RangePicker.vue'

export type * from './interface'

export const DatePickerView = withInstall(DatePickerViewVue, 'AmDatePickerView')

/** Same names as antdv-next: `DatePicker.RangePicker`, `<am-range-picker>`, named export `DateRangePicker`. */
export const DateRangePicker = withInstall(RangePickerVue, 'AmRangePicker')

const DatePicker = withInstall(DatePickerVue, 'AmDatePicker', { View: DatePickerView, RangePicker: DateRangePicker })

export default DatePicker

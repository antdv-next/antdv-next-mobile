import { withInstall } from '../_util/withInstall'
import CalendarVue from './Calendar.vue'

export type * from './interface'

const Calendar = withInstall(CalendarVue, 'AmCalendar')

export default Calendar

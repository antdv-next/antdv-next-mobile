import { withInstall } from '../_util/withInstall'
import StatisticVue from './Statistic.vue'
import StatisticTimerVue from './StatisticTimer.vue'

export type * from './interface'

export const StatisticTimer = withInstall(StatisticTimerVue, 'AmStatisticTimer')

const Statistic = withInstall(StatisticVue, 'AmStatistic', { Timer: StatisticTimer })

export default Statistic

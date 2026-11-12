import { withInstall } from '../_util/withInstall'
import RateVue from './Rate.vue'

export type * from './interface'

const Rate = withInstall(RateVue, 'AmRate')

export default Rate

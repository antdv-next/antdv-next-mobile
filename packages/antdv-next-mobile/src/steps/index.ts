import { withInstall } from '../_util/withInstall'
import StepsVue from './Steps.vue'

export type * from './interface'

const Steps = withInstall(StepsVue, 'AmSteps')

export default Steps

import { withInstall } from '../_util/withInstall'
import CollapseTransitionVue from './CollapseTransition.vue'

export type * from './interface'

const CollapseTransition = withInstall(CollapseTransitionVue, 'AmCollapseTransition')

export default CollapseTransition

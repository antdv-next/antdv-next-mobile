import { withInstall } from '../_util/withInstall'
import SwipeActionVue from './SwipeAction.vue'

export type * from './interface'

const SwipeAction = withInstall(SwipeActionVue, 'AmSwipeAction')

export default SwipeAction

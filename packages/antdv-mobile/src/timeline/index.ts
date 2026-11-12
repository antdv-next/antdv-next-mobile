import { withInstall } from '../_util/withInstall'
import TimelineVue from './Timeline.vue'

export type * from './interface'

const Timeline = withInstall(TimelineVue, 'AmTimeline')

export default Timeline

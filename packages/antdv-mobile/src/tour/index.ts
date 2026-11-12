import { withInstall } from '../_util/withInstall'
import TourVue from './Tour.vue'

export type * from './interface'

const Tour = withInstall(TourVue, 'AmTour')

export default Tour

import { withInstall } from '../_util/withInstall'
import SpaceVue from './Space.vue'

export type * from './interface'

const Space = withInstall(SpaceVue, 'AmSpace')

export default Space

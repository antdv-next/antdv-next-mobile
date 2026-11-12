import { withInstall } from '../_util/withInstall'
import BorderBeamVue from './BorderBeam.vue'

export type * from './interface'

const BorderBeam = withInstall(BorderBeamVue, 'AmBorderBeam')

export default BorderBeam

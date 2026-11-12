import { withInstall } from '../_util/withInstall'
import BarrageVue from './Barrage.vue'

export type * from './interface'

const Barrage = withInstall(BarrageVue, 'AmBarrage')

export default Barrage

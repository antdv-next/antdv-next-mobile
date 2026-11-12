import { withInstall } from '../_util/withInstall'
import SpinVue from './Spin.vue'

export type * from './interface'

const Spin = withInstall(SpinVue, 'AmSpin')

export default Spin

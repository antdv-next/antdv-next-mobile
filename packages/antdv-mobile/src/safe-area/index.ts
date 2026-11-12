import { withInstall } from '../_util/withInstall'
import SafeAreaVue from './SafeArea.vue'

export type * from './interface'

const SafeArea = withInstall(SafeAreaVue, 'AmSafeArea')

export default SafeArea

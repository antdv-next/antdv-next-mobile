import { withInstall } from '../_util/withInstall'
import ShimmerTextVue from './ShimmerText.vue'

export type * from './interface'

const ShimmerText = withInstall(ShimmerTextVue, 'AmShimmerText')

export default ShimmerText

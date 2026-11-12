import { withInstall } from '../_util/withInstall'
import MasonryVue from './Masonry.vue'

export type * from './interface'

const Masonry = withInstall(MasonryVue, 'AmMasonry')

export default Masonry

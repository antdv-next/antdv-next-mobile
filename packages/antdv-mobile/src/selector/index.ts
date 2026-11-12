import { withInstall } from '../_util/withInstall'
import SelectorVue from './Selector.vue'

export type * from './interface'

const Selector = withInstall(SelectorVue, 'AmSelector')

export default Selector

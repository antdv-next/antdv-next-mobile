import { withInstall } from '../_util/withInstall'
import ListyVue from './Listy.vue'

export type * from './interface'

const Listy = withInstall(ListyVue, 'AmListy')

export default Listy

import { withInstall } from '../_util/withInstall'
import TreeVue from './Tree.vue'

export type * from './interface'

const Tree = withInstall(TreeVue, 'AmTree')

export default Tree

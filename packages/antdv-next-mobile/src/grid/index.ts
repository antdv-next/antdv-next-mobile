import { withInstall } from '../_util/withInstall'
import ColVue from './Col.vue'
import RowVue from './Row.vue'

export type * from './interface'

export const Row = withInstall(RowVue, 'AmRow')
export const Col = withInstall(ColVue, 'AmCol')

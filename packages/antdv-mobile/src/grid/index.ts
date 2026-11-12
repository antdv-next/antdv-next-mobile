import { withInstall } from '../_util/withInstall'
import ColVue from './Col.vue'
import GridVue from './Grid.vue'
import GridItemVue from './GridItem.vue'
import RowVue from './Row.vue'

export type * from './interface'

export const Row = withInstall(RowVue, 'AmRow')
export const Col = withInstall(ColVue, 'AmCol')

export const GridItem = withInstall(GridItemVue, 'AmGridItem')
export const Grid = withInstall(GridVue, 'AmGrid', { Item: GridItem })

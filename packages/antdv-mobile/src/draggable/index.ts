import { withInstall } from '../_util/withInstall'
import DraggableVue from './Draggable.vue'

export type * from './interface'

const Draggable = withInstall(DraggableVue, 'AmDraggable')

export default Draggable

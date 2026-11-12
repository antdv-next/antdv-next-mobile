import { withInstall } from '../_util/withInstall'
import ListVue from './List.vue'
import ListItemVue from './ListItem.vue'

export type * from './interface'

const ListItem = withInstall(ListItemVue, 'AmListItem')
const List = withInstall(ListVue, 'AmList', { Item: ListItem })

export { ListItem }

export default List

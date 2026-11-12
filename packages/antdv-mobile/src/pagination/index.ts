import { withInstall } from '../_util/withInstall'
import PaginationVue from './Pagination.vue'

export type * from './interface'

const Pagination = withInstall(PaginationVue, 'AmPagination')

export default Pagination

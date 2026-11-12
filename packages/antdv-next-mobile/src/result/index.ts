import { withInstall } from '../_util/withInstall'
import ResultVue from './Result.vue'

export type * from './interface'

const Result = withInstall(ResultVue, 'AmResult')

export default Result

import { withInstall } from '../_util/withInstall'
import ProgressVue from './Progress.vue'

export type * from './interface'

const Progress = withInstall(ProgressVue, 'AmProgress')

export default Progress

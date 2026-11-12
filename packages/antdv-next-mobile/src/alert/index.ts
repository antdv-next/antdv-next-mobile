import { withInstall } from '../_util/withInstall'
import AlertVue from './Alert.vue'

export type * from './interface'

const Alert = withInstall(AlertVue, 'AmAlert')

export default Alert

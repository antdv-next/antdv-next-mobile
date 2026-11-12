import { withInstall } from '../_util/withInstall'
import ButtonVue from './Button.vue'

export type * from './interface'

const Button = withInstall(ButtonVue, 'AmButton')

export default Button

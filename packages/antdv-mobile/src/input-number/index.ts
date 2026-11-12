import { withInstall } from '../_util/withInstall'
import InputNumberVue from './InputNumber.vue'

export type * from './interface'

const InputNumber = withInstall(InputNumberVue, 'AmInputNumber')

export default InputNumber

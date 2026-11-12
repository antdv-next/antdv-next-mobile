import { withInstall } from '../_util/withInstall'
import NumberKeyboardVue from './NumberKeyboard.vue'

export type * from './interface'

const NumberKeyboard = withInstall(NumberKeyboardVue, 'AmNumberKeyboard')

export default NumberKeyboard

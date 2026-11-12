import { withInstall } from '../_util/withInstall'
import RadioVue from './Radio.vue'
import RadioButtonVue from './RadioButton.vue'
import RadioGroupVue from './RadioGroup.vue'

export type * from './interface'

export const RadioGroup = withInstall(RadioGroupVue, 'AmRadioGroup')
export const RadioButton = withInstall(RadioButtonVue, 'AmRadioButton')

const Radio = withInstall(RadioVue, 'AmRadio', { Group: RadioGroup, Button: RadioButton })

export default Radio

import { withInstall } from '../_util/withInstall'
import FormVue from './Form.vue'
import FormItemVue from './FormItem.vue'

export type * from './interface'

export const FormItem = withInstall(FormItemVue, 'AmFormItem')

const Form = withInstall(FormVue, 'AmForm', { Item: FormItem })

export default Form

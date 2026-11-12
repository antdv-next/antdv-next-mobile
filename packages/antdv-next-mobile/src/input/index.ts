import { withInstall } from '../_util/withInstall'
import InputVue from './Input.vue'
import InputOTPVue from './InputOTP.vue'
import InputPasswordVue from './InputPassword.vue'
import InputSearchVue from './InputSearch.vue'
import TextAreaVue from './TextArea.vue'

export type * from './interface'

export const TextArea = withInstall(TextAreaVue, 'AmTextarea')
export const InputSearch = withInstall(InputSearchVue, 'AmInputSearch')
export const InputPassword = withInstall(InputPasswordVue, 'AmInputPassword')
export const InputOTP = withInstall(InputOTPVue, 'AmInputOtp')

const Input = withInstall(InputVue, 'AmInput', {
  TextArea,
  Search: InputSearch,
  Password: InputPassword,
  OTP: InputOTP,
})

export default Input

import { withInstall } from '../_util/withInstall'
import PopupVue from './Popup.vue'

export type * from './interface'

const Popup = withInstall(PopupVue, 'AmPopup')

export default Popup

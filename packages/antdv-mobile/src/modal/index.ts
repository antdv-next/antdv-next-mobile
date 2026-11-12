import type { ModalStaticFunctions } from './interface'
import { withInstall } from '../_util/withInstall'
import { destroyAll, staticApi, useModal } from './confirm'
import ModalVue from './Modal.vue'

export type * from './interface'

const statics: ModalStaticFunctions = {
  ...staticApi,
  warn: staticApi.warning,
  destroyAll,
  useModal,
}

const Modal = withInstall(ModalVue, 'AmModal', statics)

export default Modal

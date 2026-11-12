import { withInstall } from '../_util/withInstall'
import SignatureVue from './Signature.vue'

export type * from './interface'

const Signature = withInstall(SignatureVue, 'AmSignature')

export default Signature

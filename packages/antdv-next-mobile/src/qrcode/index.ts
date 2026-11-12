import { withInstall } from '../_util/withInstall'
import QRCodeVue from './QRCode.vue'

export { encodeQRCode } from './encoder'
export type { QRCodeEncodeOptions, QRCodeErrorLevel, QRCodeMatrix } from './encoder'
export type * from './interface'

const QRCode = withInstall(QRCodeVue, 'AmQrcode')

export default QRCode

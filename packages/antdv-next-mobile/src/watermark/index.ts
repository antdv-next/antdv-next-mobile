import { withInstall } from '../_util/withInstall'
import WatermarkVue from './Watermark.vue'

export type * from './interface'

const Watermark = withInstall(WatermarkVue, 'AmWatermark')

export default Watermark

import { withInstall } from '../_util/withInstall'
import SliderVue from './Slider.vue'

export type * from './interface'

const Slider = withInstall(SliderVue, 'AmSlider')

export default Slider

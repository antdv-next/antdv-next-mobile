import { withInstall } from '../_util/withInstall'
import CarouselVue from './Carousel.vue'

export type * from './interface'

const Carousel = withInstall(CarouselVue, 'AmCarousel')

export default Carousel

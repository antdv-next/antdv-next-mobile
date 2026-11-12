import { withInstall } from '../_util/withInstall'
import ImageVue from './Image.vue'
import ImagePreviewGroupVue from './ImagePreviewGroup.vue'

export type * from './interface'

export const ImagePreviewGroup = withInstall(ImagePreviewGroupVue, 'AmImagePreviewGroup')

const Image = withInstall(ImageVue, 'AmImage', { PreviewGroup: ImagePreviewGroup })

export default Image

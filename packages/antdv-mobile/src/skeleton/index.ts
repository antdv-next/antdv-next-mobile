import { withInstall } from '../_util/withInstall'
import SkeletonVue from './Skeleton.vue'
import SkeletonAvatarVue from './SkeletonAvatar.vue'
import SkeletonButtonVue from './SkeletonButton.vue'
import SkeletonImageVue from './SkeletonImage.vue'
import SkeletonInputVue from './SkeletonInput.vue'

export type * from './interface'

export const SkeletonButton = withInstall(SkeletonButtonVue, 'AmSkeletonButton')
export const SkeletonAvatar = withInstall(SkeletonAvatarVue, 'AmSkeletonAvatar')
export const SkeletonInput = withInstall(SkeletonInputVue, 'AmSkeletonInput')
export const SkeletonImage = withInstall(SkeletonImageVue, 'AmSkeletonImage')

const Skeleton = withInstall(SkeletonVue, 'AmSkeleton', {
  Button: SkeletonButton,
  Avatar: SkeletonAvatar,
  Input: SkeletonInput,
  Image: SkeletonImage,
})

export default Skeleton

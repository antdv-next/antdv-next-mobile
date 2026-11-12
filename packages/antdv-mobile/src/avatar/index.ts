import { withInstall } from '../_util/withInstall'
import AvatarVue from './Avatar.vue'
import AvatarGroupVue from './AvatarGroup.vue'

export type * from './interface'

export const AvatarGroup = withInstall(AvatarGroupVue, 'AmAvatarGroup')

const Avatar = withInstall(AvatarVue, 'AmAvatar', { Group: AvatarGroup })

export default Avatar

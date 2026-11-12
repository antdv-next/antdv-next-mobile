import { withInstall } from '../_util/withInstall'
import SpaceVue from './Space.vue'
import SpaceAddonVue from './SpaceAddon.vue'
import SpaceCompactVue from './SpaceCompact.vue'

export { useCompactItemContext } from '../_base/compact'
export type { UseCompactItemContextReturn } from '../_base/compact'
export type * from './interface'

export const SpaceCompact = withInstall(SpaceCompactVue, 'AmSpaceCompact')
export const SpaceAddon = withInstall(SpaceAddonVue, 'AmSpaceAddon')

const Space = withInstall(SpaceVue, 'AmSpace', {
  Compact: SpaceCompact,
  Addon: SpaceAddon,
})

export default Space

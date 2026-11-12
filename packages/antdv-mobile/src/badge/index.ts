import { withInstall } from '../_util/withInstall'
import BadgeVue from './Badge.vue'
import RibbonVue from './Ribbon.vue'

export type * from './interface'

export const BadgeRibbon = withInstall(RibbonVue, 'AmBadgeRibbon')

const Badge = withInstall(BadgeVue, 'AmBadge', { Ribbon: BadgeRibbon })

export default Badge

import { withInstall } from '../_util/withInstall'
import IndexBarVue from './IndexBar.vue'
import IndexBarAnchorVue from './IndexBarAnchor.vue'

export type * from './interface'

const IndexBarAnchor = withInstall(IndexBarAnchorVue, 'AmIndexBarAnchor')
const IndexBar = withInstall(IndexBarVue, 'AmIndexBar', { Anchor: IndexBarAnchor })

export { IndexBarAnchor }

export default IndexBar

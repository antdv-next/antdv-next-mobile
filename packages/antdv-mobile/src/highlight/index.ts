import { withInstall } from '../_util/withInstall'
import HighlightVue from './Highlight.vue'

export type * from './interface'
export { getHighlightChunks } from './utils'

const Highlight = withInstall(HighlightVue, 'AmHighlight')

export default Highlight

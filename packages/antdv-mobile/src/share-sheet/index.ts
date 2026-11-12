import { withInstall } from '../_util/withInstall'
import ShareSheetVue from './ShareSheet.vue'

export type * from './interface'

const ShareSheet = withInstall(ShareSheetVue, 'AmShareSheet')

export default ShareSheet

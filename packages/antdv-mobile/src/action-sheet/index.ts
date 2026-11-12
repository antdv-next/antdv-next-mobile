import { withInstall } from '../_util/withInstall'
import ActionSheetVue from './ActionSheet.vue'
import { show } from './show'

export type * from './interface'

const ActionSheet = withInstall(ActionSheetVue, 'AmActionSheet', { show })

export default ActionSheet

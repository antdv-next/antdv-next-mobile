import { withInstall } from '../_util/withInstall'
import ActionBarVue from './ActionBar.vue'
import ActionBarButtonVue from './ActionBarButton.vue'
import ActionBarIconVue from './ActionBarIcon.vue'

export type * from './interface'

export const ActionBarIcon = withInstall(ActionBarIconVue, 'AmActionBarIcon')
export const ActionBarButton = withInstall(ActionBarButtonVue, 'AmActionBarButton')

const ActionBar = withInstall(ActionBarVue, 'AmActionBar', { Icon: ActionBarIcon, Button: ActionBarButton })

export default ActionBar

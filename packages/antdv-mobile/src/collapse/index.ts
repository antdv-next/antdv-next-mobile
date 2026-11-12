import { withInstall } from '../_util/withInstall'
import CollapseVue from './Collapse.vue'
import CollapsePanelVue from './CollapsePanel.vue'

export type * from './interface'

const CollapsePanel = withInstall(CollapsePanelVue, 'AmCollapsePanel')
const Collapse = withInstall(CollapseVue, 'AmCollapse', { Panel: CollapsePanel })

export { CollapsePanel }

export default Collapse

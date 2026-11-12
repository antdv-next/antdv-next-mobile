import { withInstall } from '../_util/withInstall'
import FloatingPanelVue from './FloatingPanel.vue'

export type * from './interface'

const FloatingPanel = withInstall(FloatingPanelVue, 'AmFloatingPanel')

export default FloatingPanel

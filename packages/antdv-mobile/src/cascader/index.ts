import { withInstall } from '../_util/withInstall'
import CascaderVue from './Cascader.vue'
import CascaderViewVue from './CascaderView.vue'

export type * from './interface'

export const CascaderView = withInstall(CascaderViewVue, 'AmCascaderView')

const Cascader = withInstall(CascaderVue, 'AmCascader', { View: CascaderView })

export default Cascader

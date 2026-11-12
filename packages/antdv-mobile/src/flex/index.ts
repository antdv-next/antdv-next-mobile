import { withInstall } from '../_util/withInstall'
import FlexVue from './Flex.vue'

export type * from './interface'

const Flex = withInstall(FlexVue, 'AmFlex')

export default Flex

import { withInstall } from '../_util/withInstall'
import DescriptionsVue from './Descriptions.vue'

export type * from './interface'

const Descriptions = withInstall(DescriptionsVue, 'AmDescriptions')

export default Descriptions

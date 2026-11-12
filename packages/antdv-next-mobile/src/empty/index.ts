import { withInstall } from '../_util/withInstall'
import EmptyVue from './Empty.vue'
import { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE } from './images'

export type * from './interface'

const Empty = withInstall(EmptyVue, 'AmEmpty', { PRESENTED_IMAGE_DEFAULT, PRESENTED_IMAGE_SIMPLE })

export default Empty

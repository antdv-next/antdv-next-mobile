import { withInstall } from '../_util/withInstall'
import CheckableTagVue from './CheckableTag.vue'
import TagVue from './Tag.vue'

export type * from './interface'

export const CheckableTag = withInstall(CheckableTagVue, 'AmCheckableTag')

const Tag = withInstall(TagVue, 'AmTag', { CheckableTag })

export default Tag

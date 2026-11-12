import { withInstall } from '../_util/withInstall'
import AffixVue from './Affix.vue'

export type * from './interface'

const Affix = withInstall(AffixVue, 'AmAffix')

export default Affix

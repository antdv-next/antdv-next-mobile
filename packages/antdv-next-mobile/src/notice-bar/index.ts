import { withInstall } from '../_util/withInstall'
import NoticeBarVue from './NoticeBar.vue'

export type * from './interface'

const NoticeBar = withInstall(NoticeBarVue, 'AmNoticeBar')

export default NoticeBar

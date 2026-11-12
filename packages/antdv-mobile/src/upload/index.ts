import { withInstall } from '../_util/withInstall'
import UploadVue from './Upload.vue'
import { LIST_IGNORE } from './utils'

export type * from './interface'

const Upload = withInstall(UploadVue, 'AmUpload', { LIST_IGNORE })

export default Upload

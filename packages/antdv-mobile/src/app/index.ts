import { withInstall } from '../_util/withInstall'
import AppVue from './App.vue'
import useApp from './useApp'

export type * from './interface'

const App = withInstall(AppVue, 'AmApp', { useApp })

export default App

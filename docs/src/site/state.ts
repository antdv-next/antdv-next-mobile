import { reactive } from 'vue'

/** What the phone simulator should show. */
export const simulator = reactive({
  /** component name (route of the demo app), empty = demo home */
  page: '',
  /** demo id to scroll to */
  demo: '',
  /** bump to force a reload */
  version: 0,
})

export function focusDemo(id: string) {
  simulator.demo = id
}

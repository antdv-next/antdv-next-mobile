import type { DocsLocale } from '../shared/locale'
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

export function simulatorUrl(page: string, demo: string, docsLocale?: DocsLocale) {
  const params = new URLSearchParams()
  if (demo)
    params.set('demo', demo)
  if (docsLocale)
    params.set('from', 'docs')
  const query = params.toString()
  const language = docsLocale ? `?lang=${docsLocale}` : ''
  return `${import.meta.env.BASE_URL}mobile.html${language}#/${encodeURIComponent(page)}${query ? `?${query}` : ''}`
}

export function focusDemo(id: string, docsLocale: DocsLocale) {
  if (window.matchMedia('(max-width: 1180px)').matches) {
    window.location.assign(simulatorUrl(simulator.page, id, docsLocale))
    return
  }
  simulator.demo = id
}

import { reactive, watch } from 'vue'

export interface DocsTheme {
  dark: boolean
  compact: boolean
  primary: string
  radius: number
}

export const STORAGE_KEY = 'am-docs-theme'

/** Display names live in `shared/locale.ts` (`theme.primaryNames` / `theme.radiusNames`). */
export const primaryPresets = [
  { key: 'blue', color: '#1677ff' },
  { key: 'green', color: '#00b96b' },
  { key: 'purple', color: '#722ed1' },
  { key: 'orange', color: '#fa541c' },
  { key: 'magenta', color: '#eb2f96' },
  { key: 'cyan', color: '#13a8a8' },
]

export const radiusPresets = [
  { key: 'sharp', value: 2 },
  { key: 'default', value: 8 },
  { key: 'round', value: 14 },
]

const defaults: DocsTheme = { dark: false, compact: false, primary: primaryPresets[0].color, radius: 8 }

function read(): DocsTheme {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const dark = saved.dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches
    return { ...defaults, ...saved, dark }
  }
  catch {
    return { ...defaults }
  }
}

let state: DocsTheme | undefined

/**
 * Theme settings shared by the documentation site and the simulator iframe.
 * Both documents are same-origin, so the `storage` event keeps them in sync.
 */
export function useDocsTheme() {
  if (state)
    return state
  const current = reactive(read())
  state = current
  watch(current, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    }
    catch {}
  }, { deep: true })
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY)
      Object.assign(current, read())
  })
  return current
}

export function resetDocsTheme() {
  Object.assign(useDocsTheme(), { compact: false, primary: defaults.primary, radius: defaults.radius })
}

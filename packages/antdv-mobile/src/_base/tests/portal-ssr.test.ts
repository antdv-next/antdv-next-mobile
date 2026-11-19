// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../../config-provider'
import Popup from '../../popup'

describe('Portal on the server', () => {
  it.each([true, false])('does not resolve browser container callbacks when open=%s', async (open) => {
    const getContainer = vi.fn(() => document.body)
    for (const container of ['default', 'provider', 'popup']) {
      const app = createSSRApp(() => h(ConfigProvider, { getPopupContainer: container === 'provider' ? getContainer : undefined }, {
        default: () => h(Popup, { open, getContainer: container === 'popup' ? getContainer : undefined }, () => 'dialog content'),
      }))
      const html = await renderToString(app)
      expect(html.includes('dialog content')).toBe(open)
    }
    expect(getContainer).not.toHaveBeenCalled()
  })
})

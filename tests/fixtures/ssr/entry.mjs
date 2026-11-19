import assert from 'node:assert/strict'
import { Button } from '@antdv-next/mobile'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({ render: () => h(Button, null, () => 'SSR smoke') })
renderToString(app).then((html) => {
  assert.match(html, /^<button /)
  assert.match(html, /class="am-button\b/)
  assert.match(html, /SSR smoke/)
})

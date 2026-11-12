import type { FunctionalComponent, VNodeChild } from 'vue'
import { h } from 'vue'

/**
 * Internal render helper: wraps the default slot with semantic tags,
 * `['strong', 'u']` -> `<strong><u>...</u></strong>`.
 */
const Decorate: FunctionalComponent<{ tags: string[] }> = (props, { slots }) => {
  let content: VNodeChild = slots.default?.()
  for (let i = props.tags.length - 1; i >= 0; i--)
    content = h(props.tags[i]!, null, content as any)
  return content as any
}

Decorate.props = ['tags']
Decorate.displayName = 'AmTypographyDecorate'

export default Decorate

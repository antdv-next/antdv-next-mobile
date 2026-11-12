import type { PropType } from 'vue'
import { cloneVNode, defineComponent, isVNode } from 'vue'
import { flattenChildren } from '../_util/vnode'

/**
 * Render helper of BorderBeam: renders the slot untouched and, when it is a single node,
 * hands its DOM element to `setHost` through a (merged) ref. A template cannot attach a ref
 * to slot content, hence this tiny render function.
 */
export default defineComponent({
  name: 'AmBorderBeamHost',
  inheritAttrs: false,
  props: {
    setHost: { type: Function as PropType<(el: unknown) => void>, required: true },
  },
  setup(props, { slots }) {
    return () => {
      const raw = slots.default?.()
      const children = flattenChildren(raw)
      const child = children[0]
      if (children.length !== 1 || !isVNode(child))
        return raw
      return cloneVNode(child, { ref: props.setHost }, true)
    }
  },
})

import type { PropType } from 'vue'
import type { RenderNodeFn } from './type'
import { defineComponent } from 'vue'

/**
 * Renders a `VueNode` / `RenderNodeFn` prop inside an SFC template.
 *
 * ```vue
 * <slot name="icon"><RenderNode :node="icon" /></slot>
 * ```
 */
export default defineComponent({
  name: 'AmRenderNode',
  inheritAttrs: false,
  props: {
    node: { type: [String, Number, Boolean, Object, Function, Array] as PropType<RenderNodeFn>, default: undefined },
    params: { type: null as unknown as PropType<any>, default: undefined },
  },
  setup(props) {
    return () => {
      const { node } = props
      if (typeof node === 'function')
        return (node as any)(props.params)
      if (typeof node === 'boolean')
        return null
      return node as any
    }
  },
})

<script setup lang="ts">
import type { FloatButtonGroupEmits, FloatButtonGroupProps, FloatButtonGroupSlots } from './interface'
import { CloseOutlined, FileTextOutlined } from '@antdv-next/icons'
import { computed, provide } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { floatButtonGroupContextKey } from './context'
import FloatButton from './FloatButton.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFloatButtonGroup', inheritAttrs: false })

const props = withDefaults(defineProps<FloatButtonGroupProps>(), {
  shape: 'circle',
  open: undefined,
  defaultOpen: false,
  placement: 'top',
  closeIcon: undefined,
  icon: undefined,
  content: undefined,
  type: 'default',
})
const emit = defineEmits<FloatButtonGroupEmits>()
defineSlots<FloatButtonGroupSlots>()

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const [open, setOpen] = useControlled(props, 'open', {
  defaultValue: () => props.defaultOpen,
  onChange: (value, prev) => {
    if (value === prev)
      return
    emit('update:open', value)
    emit('openChange', value)
  },
})

const isMenu = computed(() => props.trigger === 'click')

provide(floatButtonGroupContextKey, {
  shape: computed(() => props.shape),
})

function onTriggerClick(event: MouseEvent) {
  setOpen(!open.value)
  emit('click', event)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-float-button-group"
    :class="[
      `am-float-button-group-${shape}`,
      `am-float-button-group-${placement}`,
      {
        'am-float-button-group-menu': isMenu,
        'am-float-button-group-open': isMenu && open,
      },
      rootClass,
      classes?.root,
    ]"
    :style="styles?.root"
  >
    <template v-if="isMenu">
      <Transition name="am-float-button-group-motion">
        <div v-show="open" class="am-float-button-group-list" :class="classes?.list" :style="styles?.list">
          <slot />
        </div>
      </Transition>
      <FloatButton
        class="am-float-button-group-trigger"
        :class="classes?.trigger"
        :style="styles?.trigger"
        :type="type"
        :badge="badge"
        :content="open ? undefined : content"
        :aria-expanded="open"
        @click="onTriggerClick"
      >
        <template #icon>
          <slot v-if="open" name="closeIcon">
            <RenderNode v-if="isNode(closeIcon)" :node="closeIcon" />
            <CloseOutlined v-else />
          </slot>
          <slot v-else name="icon">
            <RenderNode v-if="isNode(icon)" :node="icon" />
            <FileTextOutlined v-else />
          </slot>
        </template>
      </FloatButton>
    </template>
    <div v-else class="am-float-button-group-list" :class="classes?.list" :style="styles?.list">
      <slot />
    </div>
  </div>
</template>

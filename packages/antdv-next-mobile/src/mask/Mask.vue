<script setup lang="ts">
import type { MaskEmits, MaskProps, MaskSlots } from './interface'
import { computed, ref, watch } from 'vue'
import { resolveContainer } from '../_util'
import { useLockScroll } from '../_util/hooks'
import { usePopupTheme } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmMask', inheritAttrs: false })

const props = withDefaults(defineProps<MaskProps>(), {
  open: false,
  lockScroll: true,
  color: 'default',
  closable: false,
  getContainer: false,
  destroyOnHidden: false,
})
const emit = defineEmits<MaskEmits>()
defineSlots<MaskSlots>()

const rootRef = ref<HTMLElement>()
const popupTheme = usePopupTheme()
const rendered = ref(props.open)

watch(() => props.open, (open) => {
  if (open)
    rendered.value = true
})

useLockScroll(rootRef, () => props.open && props.lockScroll)

const container = computed(() => resolveContainer(props.getContainer))
const background = computed(() => {
  if (props.color === 'default')
    return undefined
  if (props.color === 'white')
    return 'rgb(255 255 255 / 60%)'
  return props.color
})

function onClick(event: MouseEvent) {
  if (event.target !== event.currentTarget)
    return
  emit('click', event)
  if (props.closable)
    emit('update:open', false)
}

function onAfterLeave() {
  if (props.destroyOnHidden)
    rendered.value = false
  emit('afterOpenChange', false)
}
</script>

<template>
  <Teleport :to="container ?? 'body'" :disabled="!container">
    <Transition name="am-fade" appear @after-enter="emit('afterOpenChange', true)" @after-leave="onAfterLeave">
      <div
        v-if="rendered"
        v-show="open"
        ref="rootRef"
        v-bind="$attrs"
        class="am-mask"
        :class="[container ? popupTheme.class : undefined, rootClass]"
        :style="[container ? popupTheme.style : undefined, { zIndex, background }]"
        @click="onClick"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

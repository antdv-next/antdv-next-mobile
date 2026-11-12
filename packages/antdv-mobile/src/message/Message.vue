<script setup lang="ts">
import type { MessageHolderProps } from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { computed, onMounted, ref } from 'vue'
import { Portal, Spinner } from '../_base'
import { addUnit, isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmMessage', inheritAttrs: false })

const props = withDefaults(defineProps<MessageHolderProps>(), {
  notices: () => [],
})

const rootRef = ref<HTMLElement>()
/** the holder is client-only: nothing is rendered on the server */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const icons = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: Spinner,
}

const rootStyle = computed(() => {
  const top = addUnit(props.top)
  return [
    { zIndex: props.zIndex },
    top ? { '--am-message-top': top } : undefined,
  ]
})

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <Portal v-if="mounted" v-slot="{ theme }" :get-container="getContainer">
    <div
      ref="rootRef"
      v-bind="$attrs"
      class="am-message"
      :class="theme.class"
      :style="[theme.style, rootStyle]"
      :dir="theme.dir"
    >
      <!-- `appear`: the static holder is mounted by the first call, with its notice already in the list -->
      <TransitionGroup name="am-message-motion" appear>
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="am-message-notice"
          :class="[notice.type ? `am-message-notice-${notice.type}` : undefined, notice.class]"
          :style="notice.style"
        >
          <div
            class="am-message-notice-content"
            :role="notice.type === 'error' ? 'alert' : 'status'"
            @click="notice.onClick?.($event)"
          >
            <span v-if="isRenderable(notice.icon) || notice.type" class="am-message-icon">
              <RenderNode v-if="isRenderable(notice.icon)" :node="notice.icon" />
              <component :is="icons[notice.type]" v-else-if="notice.type" />
            </span>
            <span class="am-message-text"><RenderNode :node="notice.content" /></span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Portal>
</template>

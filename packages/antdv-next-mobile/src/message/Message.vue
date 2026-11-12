<script setup lang="ts">
import type { MessageHolderProps } from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled, LoadingOutlined } from '@antdv-next/icons'
import { computed, onMounted, ref } from 'vue'
import { addUnit, resolveContainer } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useConfig, usePopupTheme } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmMessage', inheritAttrs: false })

const props = withDefaults(defineProps<MessageHolderProps>(), {
  notices: () => [],
})

const config = useConfig()
const popupTheme = usePopupTheme()
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
  loading: LoadingOutlined,
}

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const container = computed(() => props.getContainer?.() ?? config.getPopupContainer.value?.() ?? resolveContainer())
const rootStyle = computed(() => {
  const top = addUnit(props.top)
  return [
    popupTheme.value.style,
    { zIndex: props.zIndex },
    top ? { '--am-message-top': top } : undefined,
  ]
})

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <Teleport v-if="mounted" :to="container ?? 'body'" :disabled="!container">
    <div
      ref="rootRef"
      v-bind="$attrs"
      class="am-message"
      :class="popupTheme.class"
      :style="rootStyle"
      :dir="popupTheme.dir"
    >
      <TransitionGroup name="am-message-motion">
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
            <span v-if="isNode(notice.icon) || notice.type" class="am-message-icon">
              <RenderNode v-if="isNode(notice.icon)" :node="notice.icon" />
              <component
                :is="icons[notice.type]"
                v-else-if="notice.type"
                :class="{ 'am-spin-icon': notice.type === 'loading' }"
              />
            </span>
            <span class="am-message-text"><RenderNode :node="notice.content" /></span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

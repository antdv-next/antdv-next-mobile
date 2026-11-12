<script setup lang="ts">
import type { NotificationEdge, NotificationHolderEmits, NotificationHolderProps, NotificationNotice } from './interface'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Portal } from '../_base'
import { addUnit } from '../_util'
import { useClickAway } from '../_util/hooks'
import NotificationVue from './Notification.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmNotificationHolder', inheritAttrs: false })

const props = withDefaults(defineProps<NotificationHolderProps>(), {
  notices: () => [],
  stack: undefined,
})
const emit = defineEmits<NotificationHolderEmits>()

const DEFAULT_THRESHOLD = 3
const edges: NotificationEdge[] = ['top', 'bottom']

const rootRef = ref<HTMLElement>()
/** the holder is client-only: nothing is rendered on the server */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

/** per edge, the newest notification first (it sits next to the screen edge) */
const lists = computed(() => {
  const result: Record<NotificationEdge, NotificationNotice[]> = { top: [], bottom: [] }
  props.notices.forEach(notice => result[notice.placement].unshift(notice))
  return result
})

const threshold = computed(() => {
  const { stack } = props
  if (stack === false)
    return 0
  return (typeof stack === 'object' ? stack.threshold : undefined) ?? DEFAULT_THRESHOLD
})

/** a stack opened by a tap; it folds again on an outside tap or once it is short enough */
const expanded = reactive<Record<NotificationEdge, boolean>>({ top: false, bottom: false })

function isStacked(edge: NotificationEdge) {
  return threshold.value > 0 && lists.value[edge].length > threshold.value
}

function isCollapsed(edge: NotificationEdge) {
  return isStacked(edge) && !expanded[edge]
}

watch(() => edges.map(isStacked), (stacked) => {
  edges.forEach((edge, index) => {
    if (!stacked[index])
      expanded[edge] = false
  })
})

/** a tap on a folded stack opens it instead of reaching the notification */
function onListClick(edge: NotificationEdge, event: MouseEvent) {
  if (!isCollapsed(edge))
    return
  event.stopPropagation()
  expanded[edge] = true
}

useClickAway(rootRef, () => {
  expanded.top = false
  expanded.bottom = false
}, { enabled: () => expanded.top || expanded.bottom })

const rootStyle = computed(() => {
  const top = addUnit(props.top)
  const bottom = addUnit(props.bottom)
  return [
    { zIndex: props.zIndex },
    top ? { '--am-notification-top': top } : undefined,
    bottom ? { '--am-notification-bottom': bottom } : undefined,
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
      class="am-notification"
      :class="theme.class"
      :style="[theme.style, rootStyle]"
      :dir="theme.dir"
    >
      <!-- `appear`: the static holder is mounted by the first call, with its notice already in the list -->
      <TransitionGroup
        v-for="edge in edges"
        :key="edge"
        tag="div"
        name="am-notification-motion"
        appear
        class="am-notification-list"
        :class="[
          `am-notification-list-${edge}`,
          {
            'am-notification-list-stack': isStacked(edge),
            'am-notification-list-collapsed': isCollapsed(edge),
          },
        ]"
        @click.capture="onListClick(edge, $event)"
      >
        <div
          v-for="(notice, index) in lists[edge]"
          :key="notice.id"
          class="am-notification-wrapper"
          :style="{ '--am-notification-index': index }"
        >
          <NotificationVue
            v-bind="notice.props"
            :class="notice.class"
            :style="notice.style"
            :title="notice.title"
            :description="notice.description"
            :actions="notice.actions"
            :icon="notice.icon"
            :type="notice.type"
            :duration="notice.duration"
            :times="notice.times"
            :show-progress="notice.showProgress"
            :pause-on-hover="notice.pauseOnHover"
            :closable="notice.closable"
            :close-icon="notice.closeIcon"
            :close-disabled="notice.closeDisabled"
            :placement="edge"
            :role="notice.role"
            :classes="notice.classes"
            :styles="notice.styles"
            @click="notice.onClick?.($event)"
            @close="emit('close', notice.key)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Portal>
</template>

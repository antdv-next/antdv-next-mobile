<script setup lang="ts">
import type { TypographyBaseEmits, TypographyBaseProps, TypographyBaseSlots, TypographyCopyConfig, TypographyEllipsisConfig, TypographyTitleLevel } from './interface'
import { CheckOutlined, CopyOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import { copyText } from './copy'
import Decorate from './Decorate'
import '../style'
import './style/index.css'

/** Internal: shared implementation of Text / Title / Paragraph. */
defineOptions({ name: 'AmTypographyBase', inheritAttrs: false })

const props = withDefaults(defineProps<TypographyInternalProps>(), {
  ellipsis: false,
  copyable: false,
})

const emit = defineEmits<TypographyBaseEmits>()

defineSlots<TypographyBaseSlots>()

interface TypographyInternalProps extends TypographyBaseProps {
  component: string
  kind: 'text' | 'title' | 'paragraph'
  level?: TypographyTitleLevel
}

const locale = useLocale('Typography')
const rootRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

function isRenderable(node: unknown) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

// ---------- decorations ----------
const tags = computed(() => {
  const list: string[] = []
  if (props.strong)
    list.push('strong')
  if (props.underline)
    list.push('u')
  if (props.delete)
    list.push('del')
  if (props.code)
    list.push('code')
  if (props.mark)
    list.push('mark')
  if (props.keyboard)
    list.push('kbd')
  if (props.italic)
    list.push('i')
  return list
})

// ---------- ellipsis ----------
const ellipsisConfig = computed<TypographyEllipsisConfig | undefined>(() => {
  if (!props.ellipsis)
    return undefined
  return typeof props.ellipsis === 'object' ? props.ellipsis : {}
})
const rows = computed(() => Math.max(Math.floor(Number(ellipsisConfig.value?.rows ?? 1)) || 1, 1))
const expandable = computed(() => ellipsisConfig.value?.expandable ?? false)

const expandedProps = {
  get expanded() {
    return ellipsisConfig.value?.expanded
  },
}
const [expanded, setExpanded] = useControlled(expandedProps, 'expanded', {
  defaultValue: () => !!ellipsisConfig.value?.defaultExpanded,
  onChange: value => emit('update:expanded', value),
})

/** The text is rendered truncated (and measured) in this state. */
const collapsed = computed(() => !!ellipsisConfig.value && !(expandable.value && expanded.value))
const singleLine = computed(() => rows.value === 1)
const overflowed = ref(false)

function measure() {
  const el = contentRef.value
  if (!el || !collapsed.value || !expandable.value) {
    overflowed.value = false
    return
  }
  // 1px of tolerance for sub-pixel line heights
  overflowed.value = singleLine.value ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight > el.clientHeight + 1
}

let observer: ResizeObserver | undefined
onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(rootRef.value)
  }
})
onUpdated(measure)
onBeforeUnmount(() => observer?.disconnect())

function toggleExpand(event: MouseEvent) {
  const next = !expanded.value
  setExpanded(next)
  emit('expand', next, event)
}

const showCollapse = computed(() => !!ellipsisConfig.value && expandable.value === 'collapsible' && expanded.value)

// ---------- copy ----------
const copyConfig = computed<TypographyCopyConfig | undefined>(() => {
  if (!props.copyable)
    return undefined
  return typeof props.copyable === 'object' ? props.copyable : {}
})
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyIcon = computed(() => {
  const icon = copyConfig.value?.icon
  const icons = Array.isArray(icon) ? icon : [icon]
  return copied.value ? icons[1] : icons[0]
})

function getRenderedText() {
  const root = rootRef.value
  if (!root)
    return ''
  const clone = root.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.am-typography-action').forEach(node => node.remove())
  return clone.textContent ?? ''
}

async function handleCopy(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (props.disabled)
    return
  const { text } = copyConfig.value ?? {}
  const value = typeof text === 'function' ? await text() : text
  await copyText(value ?? getRenderedText().trim())
  copied.value = true
  emit('copy', event)
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 3000)
}
onBeforeUnmount(() => clearTimeout(copyTimer))

// ---------- root ----------
const classNames = computed(() => [
  'am-typography',
  `am-typography-${props.kind}`,
  {
    [`am-typography-title-${props.level}`]: props.kind === 'title',
    [`am-typography-${props.type}`]: !!props.type,
    'am-typography-disabled': props.disabled,
    'am-typography-ellipsis': collapsed.value,
    'am-typography-ellipsis-single-line': collapsed.value && singleLine.value,
    'am-typography-ellipsis-multiple-line': collapsed.value && !singleLine.value,
    'am-typography-ellipsis-overflowed': collapsed.value && overflowed.value,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    ref="rootRef"
    :class="classNames"
    :style="styles?.root"
    :aria-disabled="disabled || undefined"
  >
    <template v-if="collapsed">
      <span
        ref="contentRef"
        class="am-typography-ellipsis-content"
        :style="singleLine ? undefined : { WebkitLineClamp: rows }"
      >
        <!-- floated to the end of the last visible line, see style/index.css -->
        <button
          v-if="expandable && overflowed && !singleLine"
          type="button"
          class="am-typography-action am-typography-expand"
          :class="classes?.action"
          :style="styles?.action"
          :aria-label="locale.expand"
          @click="toggleExpand"
        >
          <slot name="ellipsisSymbol" :expanded="false">
            <RenderNode v-if="isRenderable(ellipsisConfig?.symbol)" :node="ellipsisConfig?.symbol" :params="false" />
            <template v-else>
              {{ locale.expand }}
            </template>
          </slot>
        </button>
        <Decorate :tags="tags">
          <slot />
        </Decorate>
      </span>
      <button
        v-if="expandable && overflowed && singleLine"
        type="button"
        class="am-typography-action am-typography-expand"
        :class="classes?.action"
        :style="styles?.action"
        :aria-label="locale.expand"
        @click="toggleExpand"
      >
        <slot name="ellipsisSymbol" :expanded="false">
          <RenderNode v-if="isRenderable(ellipsisConfig?.symbol)" :node="ellipsisConfig?.symbol" :params="false" />
          <template v-else>
            {{ locale.expand }}
          </template>
        </slot>
      </button>
    </template>
    <template v-else>
      <Decorate :tags="tags">
        <slot />
      </Decorate>
      <button
        v-if="showCollapse"
        type="button"
        class="am-typography-action am-typography-collapse"
        :class="classes?.action"
        :style="styles?.action"
        :aria-label="locale.collapse"
        @click="toggleExpand"
      >
        <slot name="ellipsisSymbol" :expanded="true">
          <RenderNode v-if="isRenderable(ellipsisConfig?.symbol)" :node="ellipsisConfig?.symbol" :params="true" />
          <template v-else>
            {{ locale.collapse }}
          </template>
        </slot>
      </button>
    </template>
    <button
      v-if="copyConfig"
      type="button"
      class="am-typography-action am-typography-copy"
      :class="[{ 'am-typography-copy-success': copied }, classes?.action]"
      :style="styles?.action"
      :disabled="disabled || undefined"
      :aria-label="copied ? locale.copied : locale.copy"
      @click="handleCopy"
    >
      <slot name="copyIcon" :copied="copied">
        <RenderNode v-if="isRenderable(copyIcon)" :node="copyIcon" />
        <CheckOutlined v-else-if="copied" />
        <CopyOutlined v-else />
      </slot>
    </button>
  </component>
</template>

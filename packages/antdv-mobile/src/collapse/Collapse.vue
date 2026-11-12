<script setup lang="ts">
import type { Key } from '../_util/type'
import type { CollapseEmits, CollapseProps, CollapseSlots } from './interface'
import { computed, provide } from 'vue'
import { toArray } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import CollapsePanel from './CollapsePanel.vue'
import { collapseContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCollapse', inheritAttrs: false })

const props = withDefaults(defineProps<CollapseProps>(), {
  accordion: false,
  bordered: true,
  ghost: false,
  destroyOnHidden: false,
})
const emit = defineEmits<CollapseEmits>()
const slots = defineSlots<CollapseSlots>()

const size = useSize(() => props.size)

const [activeKey, setActiveKey] = useControlled<CollapseProps, 'activeKey', Key | Key[] | undefined>(props, 'activeKey', {
  defaultValue: () => props.defaultActiveKey,
  onChange: (keys) => {
    emit('update:activeKey', keys as Key[])
    emit('change', keys as Key[])
  },
})

const activeKeys = computed<Key[]>(() => {
  const keys = toArray(activeKey.value)
  return props.accordion ? keys.slice(0, 1) : keys
})

const isActive = (key: Key) => activeKeys.value.some(k => String(k) === String(key))

function toggle(key: Key) {
  const active = isActive(key)
  if (props.accordion)
    setActiveKey(active ? [] : [key])
  else
    setActiveKey(active ? activeKeys.value.filter(k => String(k) !== String(key)) : [...activeKeys.value, key])
}

const expandIconPlacement = computed(() => props.expandIconPlacement ?? props.expandIconPosition ?? 'end')

provide(collapseContextKey, {
  isActive,
  toggle,
  collapsible: computed(() => props.collapsible),
  destroyOnHidden: computed(() => props.destroyOnHidden),
  expandIconPlacement,
  expandIcon: computed(() => slots.expandIcon ?? props.expandIcon),
  classes: computed(() => props.classes),
  styles: computed(() => props.styles),
})

const classNames = computed(() => [
  'am-collapse',
  `am-collapse-icon-${expandIconPlacement.value}`,
  {
    'am-collapse-sm': size.value === 'small',
    'am-collapse-lg': size.value === 'large',
    'am-collapse-bordered': props.bordered && !props.ghost,
    'am-collapse-ghost': props.ghost,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <CollapsePanel
      v-for="(item, index) in items"
      :key="item.key ?? index"
      :header="item.label"
      :extra="item.extra"
      :show-arrow="item.showArrow"
      :collapsible="item.collapsible"
      :force-render="item.forceRender"
      :classes="item.classes"
      :styles="item.styles"
      :class="item.class"
      :style="item.style"
    >
      <template v-if="slots.labelRender" #header>
        <slot name="labelRender" :item="item" :index="index" />
      </template>
      <slot name="contentRender" :item="item" :index="index">
        <RenderNode :node="item.content ?? item.children" />
      </slot>
    </CollapsePanel>
    <slot />
  </div>
</template>

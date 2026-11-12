<script setup lang="ts">
import type { ButtonColorType, ButtonEmits, ButtonProps, ButtonSlots, ButtonType, ButtonVariantType } from './interface'
import { LoadingOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmButton', inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  iconPlacement: 'start',
  shape: 'default',
  htmlType: 'button',
  disabled: undefined,
  loading: false,
})
const emit = defineEmits<ButtonEmits>()
const slots = defineSlots<ButtonSlots>()

const typeMap: Record<ButtonType, [ButtonColorType, ButtonVariantType]> = {
  default: ['default', 'outlined'],
  primary: ['primary', 'solid'],
  dashed: ['default', 'dashed'],
  link: ['primary', 'link'],
  text: ['default', 'text'],
}

const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)

const colorVariant = computed<[ButtonColorType, ButtonVariantType]>(() => {
  const [typeColor, typeVariant] = typeMap[props.type ?? 'default'] ?? typeMap.default
  const color = props.color ?? (props.danger ? 'danger' : typeColor)
  return [color, props.variant ?? typeVariant]
})

// ---------- loading (supports `{ delay }` like antdv-next) ----------
function getLoadingConfig(loading: ButtonProps['loading']) {
  if (typeof loading === 'object' && loading) {
    const delay = typeof loading.delay === 'number' && !Number.isNaN(loading.delay) ? loading.delay : 0
    return { loading: delay <= 0, delay }
  }
  return { loading: !!loading, delay: 0 }
}

const innerLoading = ref(getLoadingConfig(props.loading).loading)
let delayTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.loading,
  (val) => {
    clearTimeout(delayTimer)
    const config = getLoadingConfig(val)
    if (config.delay > 0) {
      delayTimer = setTimeout(() => {
        innerLoading.value = true
      }, config.delay)
    }
    else {
      innerLoading.value = config.loading
    }
  },
  { immediate: true, deep: true },
)
onBeforeUnmount(() => clearTimeout(delayTimer))

const loadingIcon = computed(() => (typeof props.loading === 'object' ? props.loading?.icon : undefined))
const hasIcon = computed(() => innerLoading.value || !!slots.icon || (props.icon !== undefined && props.icon !== null && props.icon !== false))

const classNames = computed(() => {
  const [color, variant] = colorVariant.value
  return [
    'am-button',
    `am-button-color-${color}`,
    `am-button-variant-${variant}`,
    {
      [`am-button-${props.shape}`]: props.shape !== 'default',
      'am-button-sm': size.value === 'small',
      'am-button-lg': size.value === 'large',
      'am-button-block': props.block,
      'am-button-ghost': props.ghost,
      'am-button-loading': innerLoading.value,
      'am-button-disabled': disabled.value,
      'am-button-icon-only': hasIcon.value && !slots.default,
      'am-button-icon-end': props.iconPlacement === 'end',
    },
    props.rootClass,
    props.classes?.root,
  ]
})

function handleClick(event: MouseEvent) {
  if (innerLoading.value || disabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="href !== undefined ? 'a' : 'button'"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    :type="href !== undefined ? undefined : htmlType"
    :href="href !== undefined && !disabled ? href : undefined"
    :target="href !== undefined ? target : undefined"
    :disabled="href === undefined && disabled ? true : undefined"
    :aria-disabled="disabled || undefined"
    :aria-busy="innerLoading || undefined"
    @click="handleClick"
  >
    <span v-if="hasIcon" class="am-button-icon" :class="classes?.icon" :style="styles?.icon">
      <template v-if="innerLoading">
        <RenderNode v-if="loadingIcon" :node="loadingIcon" />
        <LoadingOutlined v-else class="am-spin-icon" />
      </template>
      <slot v-else name="icon">
        <RenderNode :node="icon" />
      </slot>
    </span>
    <span v-if="$slots.default" class="am-button-content" :class="classes?.content" :style="styles?.content">
      <slot />
    </span>
  </component>
</template>

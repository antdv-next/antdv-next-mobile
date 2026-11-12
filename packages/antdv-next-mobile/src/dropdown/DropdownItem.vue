<script setup lang="ts">
import type { Key } from '../_util/type'
import type { DropdownItemEmits, DropdownItemProps, DropdownItemSlots, DropdownItemValue, DropdownOption } from './interface'
import { CheckOutlined } from '@antdv-next/icons'
import { computed, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { genId, resolveContainer } from '../_util'
import { useControlled, useLockScroll } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useConfig, usePopupTheme } from '../config-provider/context'
import { useLocale } from '../locale'
import { dropdownContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDropdownItem', inheritAttrs: false })

const props = withDefaults(defineProps<DropdownItemProps>(), {
  title: undefined,
  options: () => [],
  highlight: false,
  disabled: false,
  closeOnSelect: true,
  showFooter: false,
  confirmText: undefined,
  resetText: undefined,
  arrowIcon: undefined,
  forceRender: false,
  destroyOnHidden: false,
})
const emit = defineEmits<DropdownItemEmits>()
const slots = defineSlots<DropdownItemSlots>()

const dropdown = inject(dropdownContextKey, null)
const config = useConfig()
const popupTheme = usePopupTheme()
const locale = useLocale('Dropdown')

// `key` is a reserved attribute in Vue: read it from the vnode (`<am-dropdown-item key="sort" />`)
const instance = getCurrentInstance()
const itemKey = (instance?.vnode.key ?? genId('am-dropdown-item')) as Key

const anchorRef = ref<HTMLElement>()
const layerRef = ref<HTMLElement>()

const [value, setValue] = useControlled<typeof props, 'value', DropdownItemValue | undefined>(props, 'value', {
  defaultValue: () => props.defaultValue,
})

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const active = computed(() => !!dropdown && dropdown.activeKey.value === itemKey)
const selectedOption = computed(() => props.options.find(option => option.value === value.value))

/** content has been mounted at least once */
const rendered = ref(active.value || props.forceRender)
/** layer is displayed (stays true until the leave animation ends) */
const visible = ref(active.value)

watch(active, (val) => {
  if (val) {
    rendered.value = true
    visible.value = true
  }
})

useLockScroll(layerRef, () => active.value)

const container = computed(() => {
  const getContainer = dropdown?.getContainer.value
  if (getContainer === false)
    return null
  if (getContainer !== undefined)
    return resolveContainer(getContainer)
  return config.getPopupContainer.value?.() ?? resolveContainer()
})

const layerStyle = computed(() => {
  const rect = dropdown?.rect.value
  return [
    container.value ? popupTheme.value.style : undefined,
    {
      top: `${rect?.top ?? 0}px`,
      left: `${rect?.left ?? 0}px`,
      width: rect?.width ? `${rect.width}px` : undefined,
      right: rect?.width ? 'auto' : undefined,
      zIndex: dropdown?.zIndex.value,
    },
    props.styles?.root,
  ]
})

// ---------- registration: the bar is rendered by the parent ----------
function renderTitle() {
  if (slots.title)
    return slots.title()
  if (isNode(props.title))
    return h(RenderNode, { node: props.title })
  const option = selectedOption.value
  return option ? h(RenderNode, { node: option.label }) : null
}

const registration = {
  key: itemKey,
  el: undefined as HTMLElement | null | undefined,
  layerEl: () => layerRef.value,
  renderTitle,
  get renderArrow() {
    if (slots.arrowIcon)
      return () => slots.arrowIcon!()
    return isNode(props.arrowIcon) ? () => h(RenderNode, { node: props.arrowIcon }) : undefined
  },
  highlight: () => props.highlight,
  disabled: () => props.disabled,
}
const unregister = dropdown?.register(registration)

onMounted(() => {
  registration.el = anchorRef.value
  dropdown?.sort()
})
onBeforeUnmount(() => unregister?.())

function close() {
  dropdown?.close()
}

function onMaskClick() {
  if (dropdown?.closeOnMaskClick.value)
    close()
}

function onSelect(option: DropdownOption) {
  if (option.disabled)
    return
  if (option.value !== value.value) {
    setValue(option.value)
    emit('update:value', option.value)
    emit('change', option.value, option)
  }
  if (props.closeOnSelect)
    close()
}

function onConfirm() {
  emit('confirm')
  close()
}

function onAfterLeave() {
  visible.value = false
  if (props.destroyOnHidden)
    rendered.value = false
  emit('afterOpenChange', false)
}
</script>

<template>
  <div ref="anchorRef" class="am-dropdown-item">
    <Teleport :to="container ?? 'body'" :disabled="!container">
      <div
        v-if="rendered"
        v-show="visible"
        ref="layerRef"
        v-bind="$attrs"
        class="am-dropdown-layer"
        :class="[container ? popupTheme.class : undefined, rootClass, classes?.root]"
        :style="layerStyle"
        :dir="container ? popupTheme.dir : undefined"
      >
        <Transition name="am-fade" appear>
          <div v-show="active" class="am-dropdown-mask" :class="classes?.mask" :style="styles?.mask" @click="onMaskClick" />
        </Transition>
        <Transition name="am-slide-top" appear @after-enter="emit('afterOpenChange', true)" @after-leave="onAfterLeave">
          <div v-show="active" class="am-dropdown-panel" :class="classes?.panel" :style="styles?.panel">
            <div class="am-dropdown-panel-body" :class="classes?.body" :style="styles?.body">
              <slot :close="close">
                <div class="am-dropdown-options" role="listbox">
                  <div
                    v-for="option in options"
                    :key="option.value"
                    class="am-dropdown-option"
                    :class="[
                      classes?.option,
                      {
                        'am-dropdown-option-active': option.value === value,
                        'am-dropdown-option-disabled': option.disabled,
                      },
                    ]"
                    :style="styles?.option"
                    role="option"
                    :aria-selected="option.value === value"
                    :aria-disabled="option.disabled || undefined"
                    @click="onSelect(option)"
                  >
                    <span class="am-dropdown-option-label"><RenderNode :node="option.label" /></span>
                    <CheckOutlined v-if="option.value === value" class="am-dropdown-option-check" />
                  </div>
                </div>
              </slot>
            </div>
            <div v-if="showFooter" class="am-dropdown-footer" :class="classes?.footer" :style="styles?.footer">
              <Button class="am-dropdown-footer-button" @click="emit('reset')">
                <RenderNode v-if="isNode(resetText)" :node="resetText" />
                <template v-else>
                  {{ locale.reset }}
                </template>
              </Button>
              <Button class="am-dropdown-footer-button" type="primary" @click="onConfirm">
                <RenderNode v-if="isNode(confirmText)" :node="confirmText" />
                <template v-else>
                  {{ locale.confirm }}
                </template>
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

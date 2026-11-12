<script setup lang="ts">
import type { CollapseItemType } from '../collapse/interface'
import type { AggregationColor } from './color'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import Collapse from '../collapse/Collapse.vue'
import { useLocale } from '../locale'
import { generateColor, isBright } from './color'
import ColorBlock from './ColorBlock.vue'
import { useColorPickerPanelContext } from './context'

/** The preset groups of the panel (`extra.components.Presets` of `panelRender`). */
defineOptions({ name: 'AmColorPickerPanelPresets' })

const ctx = useColorPickerPanelContext()
const locale = useLocale('ColorPicker')

const groups = computed(() =>
  (ctx.presets.value ?? []).map((preset, index) => ({
    key: `panel-${preset.key ?? index}`,
    label: preset.label,
    defaultOpen: preset.defaultOpen ?? true,
    colors: Array.isArray(preset.colors) ? preset.colors.map(color => generateColor(color)) : [],
  })),
)

const items = computed<CollapseItemType[]>(() => groups.value.map(group => ({ key: group.key, label: group.label })))
const defaultActiveKey = groups.value.filter(group => group.defaultOpen).map(group => group.key)

function isChecked(color: AggregationColor) {
  return !ctx.color.value.cleared && color.toCssString() === ctx.color.value.toCssString()
}

function colorClass(color: AggregationColor) {
  return {
    'am-color-picker-presets-color-checked': isChecked(color),
    'am-color-picker-presets-color-bright': isBright(color),
    'am-color-picker-presets-color-translucent': color.toRgb().a <= 0.5,
  }
}

function onSelect(color: AggregationColor) {
  if (!ctx.disabled.value)
    ctx.change(color)
}
</script>

<template>
  <div
    v-if="Array.isArray(ctx.presets.value)"
    class="am-color-picker-presets"
    :class="ctx.classes.value?.presets"
    :style="ctx.styles.value?.presets"
  >
    <Collapse ghost size="small" :items="items" :default-active-key="defaultActiveKey">
      <template #labelRender="{ index }">
        <div class="am-color-picker-presets-label">
          <RenderNode :node="groups[index].label" />
        </div>
      </template>
      <template #contentRender="{ index }">
        <div class="am-color-picker-presets-items">
          <template v-if="groups[index].colors.length">
            <button
              v-for="(color, colorIndex) in groups[index].colors"
              :key="`preset-${colorIndex}-${color.toHexString()}`"
              type="button"
              class="am-color-picker-presets-color"
              :class="colorClass(color)"
              :disabled="ctx.disabled.value"
              :aria-label="color.toHexString()"
              :aria-pressed="isChecked(color)"
              @click="onSelect(color)"
            >
              <ColorBlock :color="color.toCssString()" />
            </button>
          </template>
          <span v-else class="am-color-picker-presets-empty">{{ locale.presetEmpty }}</span>
        </div>
      </template>
    </Collapse>
  </div>
</template>

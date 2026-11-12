<script setup lang="ts">
import { computed } from 'vue'
import Button from '../button/Button.vue'
import { useLocale } from '../locale'
import { generateColor, getColorAlpha } from './color'
import ColorBlock from './ColorBlock.vue'
import ColorInput from './ColorInput.vue'
import ColorPalette from './ColorPalette.vue'
import ColorSlider from './ColorSlider.vue'
import { useColorPickerPanelContext } from './context'

/** The picking part of the panel (`extra.components.Picker` of `panelRender`). */
defineOptions({ name: 'AmColorPickerPanelPicker' })

const ctx = useColorPickerPanelContext()
const inputLocale = useLocale('Input')

const hsb = computed(() => ctx.color.value.toHsb())
const hue = computed(() => Math.min(359, Math.round(hsb.value.h)))
const alpha = computed(() => getColorAlpha(ctx.color.value))
const opaque = computed(() => generateColor({ ...hsb.value, a: 1 }).toRgbString())

function onHueChange(value: number) {
  ctx.change(generateColor({ ...hsb.value, h: value }), true, { type: 'hue', value })
}

function onAlphaChange(value: number) {
  ctx.change(generateColor({ ...hsb.value, a: value / 100 }), true, { type: 'alpha', value })
}
</script>

<template>
  <div class="am-color-picker-panel-picker">
    <div v-if="ctx.allowClear.value" class="am-color-picker-operation">
      <Button
        class="am-color-picker-clear"
        size="small"
        :disabled="ctx.disabled.value || ctx.color.value.cleared"
        @click="ctx.clear()"
      >
        <template #icon>
          <ColorBlock cleared />
        </template>
        {{ inputLocale.clear }}
      </Button>
    </div>
    <ColorPalette />
    <div class="am-color-picker-slider-container" :class="ctx.classes.value?.slider" :style="ctx.styles.value?.slider">
      <div class="am-color-picker-slider-group">
        <ColorSlider
          type="hue"
          :value="hue"
          :max="359"
          :disabled="ctx.disabled.value"
          :handle-color="`hsl(${hue}, 100%, 50%)`"
          @change="onHueChange"
          @complete="ctx.changeComplete()"
        />
        <ColorSlider
          v-if="!ctx.disabledAlpha.value"
          type="alpha"
          :value="alpha"
          :max="100"
          :disabled="ctx.disabled.value"
          :handle-color="ctx.color.value.toRgbString()"
          :rail-style="{ background: `linear-gradient(to right, transparent, ${opaque})` }"
          @change="onAlphaChange"
          @complete="ctx.changeComplete()"
        />
      </div>
      <ColorBlock class="am-color-picker-swatch" :color="ctx.color.value.toCssString()" :cleared="ctx.color.value.cleared" />
    </div>
    <ColorInput />
  </div>
</template>

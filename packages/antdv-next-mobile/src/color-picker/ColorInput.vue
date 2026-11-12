<script setup lang="ts">
import type { InputNumberValueType } from '../input-number/interface'
import type { SegmentedValue } from '../segmented/interface'
import type { ColorPickerFormat } from './interface'
import { computed, ref, watch } from 'vue'
import InputNumber from '../input-number/InputNumber.vue'
import Input from '../input/Input.vue'
import Segmented from '../segmented/Segmented.vue'
import { generateColor, getColorAlpha, getRoundNumber, toHexFormat } from './color'
import { useColorPickerPanelContext } from './context'

/** Internal: format switch + value inputs. */
defineOptions({ name: 'AmColorPickerInput' })

const ctx = useColorPickerPanelContext()

const formatOptions = (['hex', 'hsb', 'rgb'] as ColorPickerFormat[]).map(value => ({ value, label: value.toUpperCase() }))

const rgb = computed(() => ctx.color.value.toRgb())
const hsb = computed(() => ctx.color.value.toHsb())
const alpha = computed(() => getColorAlpha(ctx.color.value))

// ---------- hex ----------
const hexReg = /^#(?:[\da-f]{6}|[\da-f]{8})$/i
const hexValue = ref('')

watch(() => ctx.color.value, (color) => {
  hexValue.value = toHexFormat(color.toHexString())
}, { immediate: true })

function onHexChange(text: string) {
  hexValue.value = toHexFormat(text)
  if (hexReg.test(`#${toHexFormat(text, true)}`))
    ctx.change(generateColor(text))
}

// ---------- numbers ----------
/** An emptied field keeps the color; it shows the current value again on blur. */
const isNumber = (value: InputNumberValueType | null): value is number => typeof value === 'number' && !Number.isNaN(value)

function onRgbChange(value: InputNumberValueType | null, key: 'r' | 'g' | 'b') {
  if (isNumber(value))
    ctx.change(generateColor({ ...rgb.value, [key]: value }))
}

function onHsbChange(value: InputNumberValueType | null, key: 'h' | 's' | 'b') {
  if (isNumber(value))
    ctx.change(generateColor({ ...hsb.value, [key]: key === 'h' ? value : value / 100 }))
}

function onAlphaChange(value: InputNumberValueType | null) {
  if (isNumber(value))
    ctx.change(generateColor({ ...hsb.value, a: value / 100 }))
}

function onFormatChange(value: SegmentedValue) {
  ctx.setFormat(value as ColorPickerFormat)
}
</script>

<template>
  <div class="am-color-picker-input-container" :class="ctx.classes.value?.input" :style="ctx.styles.value?.input">
    <Segmented
      v-if="!ctx.disabledFormat.value"
      class="am-color-picker-format"
      block
      size="large"
      :options="formatOptions"
      :value="ctx.format.value"
      :disabled="ctx.disabled.value"
      @change="onFormatChange"
    />
    <div class="am-color-picker-input-row">
      <div class="am-color-picker-input" :class="`am-color-picker-${ctx.format.value}-input`">
        <template v-if="ctx.format.value === 'rgb'">
          <InputNumber
            v-for="key in (['r', 'g', 'b'] as const)"
            :key="key"
            mode="input"
            size="middle"
            variant="outlined"
            inputmode="numeric"
            :min="0"
            :max="255"
            :precision="0"
            :value="rgb[key]"
            :disabled="ctx.disabled.value"
            :aria-label="key"
            @change="onRgbChange($event, key)"
          />
        </template>
        <template v-else-if="ctx.format.value === 'hsb'">
          <InputNumber
            mode="input"
            size="middle"
            variant="outlined"
            inputmode="numeric"
            :min="0"
            :max="360"
            :precision="0"
            :value="getRoundNumber(hsb.h)"
            :disabled="ctx.disabled.value"
            aria-label="h"
            @change="onHsbChange($event, 'h')"
          />
          <InputNumber
            v-for="key in (['s', 'b'] as const)"
            :key="key"
            mode="input"
            size="middle"
            variant="outlined"
            inputmode="numeric"
            suffix="%"
            :min="0"
            :max="100"
            :precision="0"
            :value="getRoundNumber(hsb[key] * 100)"
            :disabled="ctx.disabled.value"
            :aria-label="key"
            @change="onHsbChange($event, key)"
          />
        </template>
        <Input
          v-else
          size="middle"
          variant="outlined"
          prefix="#"
          autocomplete="off"
          :maxlength="9"
          :value="hexValue"
          :disabled="ctx.disabled.value"
          aria-label="hex"
          @update:value="onHexChange"
        />
      </div>
      <InputNumber
        v-if="!ctx.disabledAlpha.value"
        class="am-color-picker-alpha-input"
        mode="input"
        size="middle"
        variant="outlined"
        inputmode="numeric"
        suffix="%"
        :min="0"
        :max="100"
        :precision="0"
        :value="alpha"
        :disabled="ctx.disabled.value"
        aria-label="alpha"
        @change="onAlphaChange"
      />
    </div>
  </div>
</template>

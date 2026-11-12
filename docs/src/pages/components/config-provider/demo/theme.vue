<docs lang="zh-CN">
通过 `theme.token` 修改主色与圆角，所有派生颜色（按压态、浅色背景、描边）会自动计算。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const colors = ['#1677ff', '#00b96b', '#722ed1', '#fa541c', '#eb2f96']
const primary = ref(colors[1])
const radius = ref(8)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small" align="center">
      <span
        v-for="color in colors"
        :key="color"
        class="swatch"
        :class="{ active: primary === color }"
        :style="{ background: color }"
        @click="primary = color"
      />
    </am-flex>
    <am-segmented v-model:value="radius" block :options="[{ label: '直角', value: 2 }, { label: '默认', value: 8 }, { label: '圆润', value: 20 }]" />
    <am-config-provider :theme="{ token: { colorPrimary: primary, borderRadius: radius, borderRadiusSM: radius / 2 } }">
      <am-flex vertical gap="small">
        <am-flex gap="small" wrap align="center">
          <am-button type="primary">
            主按钮
          </am-button>
          <am-button color="primary" variant="filled">
            浅色按钮
          </am-button>
          <am-button color="primary" variant="outlined">
            描边按钮
          </am-button>
        </am-flex>
        <am-flex gap="small" align="center" wrap>
          <am-switch default-checked />
          <am-tag color="processing">
            标签
          </am-tag>
          <am-checkbox default-checked>
            复选框
          </am-checkbox>
        </am-flex>
        <am-progress :percent="60" />
      </am-flex>
    </am-config-provider>
  </am-flex>
</template>

<style scoped>
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}

.swatch.active {
  box-shadow:
    0 0 0 2px var(--am-color-bg-container),
    0 0 0 4px var(--am-color-text-quaternary);
}
</style>

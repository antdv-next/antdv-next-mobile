<docs lang="zh-CN">
通过属性调整旋转角度、间距、字号与颜色，修改后水印会自动重绘。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  rotate: -22,
  gap: 60,
  fontSize: 16,
  colored: false,
})
</script>

<template>
  <am-flex vertical gap="middle">
    <am-watermark
      content="Antdv Next"
      :rotate="state.rotate"
      :gap="[state.gap, state.gap]"
      :font="{ fontSize: state.fontSize, color: state.colored ? 'rgba(22, 119, 255, 0.3)' : undefined }"
    >
      <am-typography-paragraph>
        水印组件会在内容上方覆盖一层不可交互的图层，不影响下方内容的点击与滚动。
      </am-typography-paragraph>
      <am-typography-paragraph>
        调整下方的配置可以看到水印实时变化。
      </am-typography-paragraph>
      <div style="height: 120px" />
    </am-watermark>
    <am-flex gap="small" wrap>
      <am-button size="small" @click="state.rotate = state.rotate === -22 ? 30 : -22">
        旋转 {{ state.rotate }}°
      </am-button>
      <am-button size="small" @click="state.gap = state.gap === 60 ? 20 : 60">
        间距 {{ state.gap }}
      </am-button>
      <am-button size="small" @click="state.fontSize = state.fontSize === 16 ? 22 : 16">
        字号 {{ state.fontSize }}
      </am-button>
      <am-button size="small" @click="state.colored = !state.colored">
        {{ state.colored ? '默认颜色' : '主题色' }}
      </am-button>
    </am-flex>
  </am-flex>
</template>

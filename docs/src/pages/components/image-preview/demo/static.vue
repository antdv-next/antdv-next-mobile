<docs lang="zh-CN">
`ImagePreview.show()` 无需声明组件即可打开预览，返回的对象可用于手动关闭；`ImagePreview.clear()` 关闭所有函数式预览。
</docs>

<script setup lang="ts">
import { ImagePreview } from 'antdv-next-mobile'
import { ref } from 'vue'

function createImage(text: string, color: string, width = 900, height = 1200) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<rect width="100%" height="100%" fill="${color}"/>`
    + `<circle cx="${width * 0.75}" cy="${height * 0.25}" r="${width * 0.08}" fill="#fff" fill-opacity="0.6"/>`
    + `<path d="M0 ${height} L${width * 0.35} ${height * 0.55} L${width * 0.6} ${height * 0.8} L${width * 0.8} ${height * 0.65} L${width} ${height} Z" fill="#fff" fill-opacity="0.35"/>`
    + `<text x="50%" y="50%" fill="#fff" font-size="${width / 6}" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const images = [
  createImage('1', '#1677ff'),
  createImage('2', '#13c2c2', 1200, 800),
  createImage('3', '#722ed1'),
  createImage('4', '#eb2f96', 1200, 600),
]

const last = ref('-')

function show() {
  ImagePreview.show({
    images,
    current: 1,
    closable: true,
    onChange: (index) => {
      last.value = `切换到第 ${index + 1} 张`
    },
    onClose: () => {
      last.value = '已关闭'
    },
  })
}

function showAndClose() {
  const handler = ImagePreview.show({ images, showIndex: false })
  setTimeout(() => handler.close(), 2000)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button type="primary" block @click="show">
      函数式调用
    </am-button>
    <am-button block @click="showAndClose">
      2 秒后自动关闭
    </am-button>
  </am-flex>
  <p class="tip">
    最近的回调：{{ last }}
  </p>
</template>

<style scoped>
.tip {
  margin: 12px 0 0;
  color: var(--am-color-text-description);
  font-size: 14px;
}
</style>

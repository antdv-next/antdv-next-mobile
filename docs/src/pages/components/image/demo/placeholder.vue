<docs lang="zh-CN">
加载中默认显示占位，可通过 `placeholder` 属性 / 插槽自定义。加载失败时使用 `fallback` 容错图片，没有容错图片时展示失败提示，也可以用 `fallback` 插槽自定义。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

function createImage(text: string, color: string, width = 300, height = 300) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<rect width="100%" height="100%" fill="${color}"/>`
    + `<text x="50%" y="50%" fill="#fff" font-size="${height / 7}" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const fallback = createImage('Fallback', '#8c8c8c')
// 没有 src 时一直处于加载占位状态
const loadingSrc = ref<string>()
</script>

<template>
  <div class="grid">
    <div class="item">
      <am-image :src="loadingSrc" :width="96" :height="96" :radius="8" />
      <span class="label">默认占位</span>
    </div>
    <div class="item">
      <am-image :src="loadingSrc" :width="96" :height="96" :radius="8">
        <template #placeholder>
          <span class="custom">加载中</span>
        </template>
      </am-image>
      <span class="label">自定义占位</span>
    </div>
    <div class="item">
      <am-image :src="loadingSrc" :width="96" :height="96" :radius="8" :placeholder="false" class="bordered" />
      <span class="label">无占位</span>
    </div>
    <div class="item">
      <am-image src="broken-image.png" :width="96" :height="96" :radius="8" />
      <span class="label">加载失败</span>
    </div>
    <div class="item">
      <am-image src="broken-image.png" :fallback="fallback" :width="96" :height="96" :radius="8" />
      <span class="label">容错图片</span>
    </div>
    <div class="item">
      <am-image src="broken-image.png" :width="96" :height="96" :radius="8">
        <template #fallback>
          <span class="custom">图片走丢了</span>
        </template>
      </am-image>
      <span class="label">自定义失败</span>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.label {
  color: var(--am-color-text-description);
  font-size: 12px;
}

.custom {
  color: var(--am-color-primary);
  font-size: 12px;
}

.bordered {
  border: 1px dashed var(--am-color-border);
}
</style>

<docs lang="zh-CN">
设置 `preview` 后点击图片全屏预览，支持双指缩放、双击放大、下拉或单击关闭。`preview.src` 可以指定预览时使用的原图。
</docs>

<script setup lang="ts">
function createImage(text: string, color: string, width = 600, height = 450) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<rect width="100%" height="100%" fill="${color}"/>`
    + `<circle cx="${width * 0.75}" cy="${height * 0.3}" r="${height * 0.12}" fill="#fff" fill-opacity="0.6"/>`
    + `<path d="M0 ${height} L${width * 0.35} ${height * 0.45} L${width * 0.6} ${height * 0.75} L${width * 0.8} ${height * 0.55} L${width} ${height} Z" fill="#fff" fill-opacity="0.35"/>`
    + `<text x="50%" y="50%" fill="#fff" font-size="${height / 8}" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const thumb = createImage('缩略图', '#1677ff', 200, 150)
const origin = createImage('原图 1200 × 900', '#1677ff', 1200, 900)
</script>

<template>
  <am-flex gap="middle">
    <am-image :src="origin" :width="120" :height="90" :radius="8" preview />
    <am-image :src="thumb" :width="120" :height="90" :radius="8" :preview="{ src: origin, closable: true, maxScale: 5 }" />
  </am-flex>
</template>

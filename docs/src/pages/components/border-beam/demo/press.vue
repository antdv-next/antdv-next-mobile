<docs lang="zh-CN">
流光层是容器内的普通元素（`.am-border-beam`），可以用 CSS 控制它的显示时机。这里默认隐藏并暂停动画，按住卡片时显示。
</docs>

<docs lang="en-US">
The beam layer is a plain element inside the container (`.am-border-beam`), so CSS decides when it shows. Here it is hidden and paused by default and revealed while the card is pressed.
</docs>

<template>
  <am-border-beam>
    <am-card class="press-card" title="Press and hold" clickable>
      The border beam appears while this card is pressed.
    </am-card>
  </am-border-beam>
</template>

<style scoped>
.press-card :deep(.am-border-beam) {
  opacity: 0;
  transition: opacity var(--am-motion-duration-mid);
}

.press-card :deep(.am-border-beam)::before {
  animation-play-state: paused;
}

.press-card:active :deep(.am-border-beam) {
  opacity: 1;
}

.press-card:active :deep(.am-border-beam)::before {
  animation-play-state: running;
}
</style>

<docs lang="zh-CN">
最简单的用法：点击触发元素显示气泡卡片，触摸其他区域关闭。支持 `title` 与 `content`，也可以使用同名插槽。
</docs>

<docs lang="en-US">
The simplest usage: tap the trigger element to show the popover, and touch anywhere else to close it. `title` and `content` are supported, as well as the same-named slots.
</docs>

<template>
  <am-flex gap="small" wrap>
    <am-popover content="Popover content" placement="topLeft">
      <am-button>Tap me</am-button>
    </am-popover>
    <am-popover title="Title" content="Popover with a title" placement="top">
      <am-button>Title</am-button>
    </am-popover>
    <am-popover placement="topRight">
      <template #content>
        <div class="content">
          <p>Custom content via slot</p>
          <am-button type="primary" size="small">
            Action
          </am-button>
        </div>
      </template>
      <am-button>Slot</am-button>
    </am-popover>
  </am-flex>
</template>

<style scoped>
.content p {
  margin: 0 0 8px;
}
</style>

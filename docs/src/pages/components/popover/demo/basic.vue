<docs lang="zh-CN">
最简单的用法：点击触发元素显示气泡卡片，触摸其他区域关闭。支持 `title` 与 `content`，也可以使用同名插槽。
</docs>

<template>
  <am-flex gap="small" wrap>
    <am-popover content="这是一段气泡内容" placement="topLeft">
      <am-button>点我</am-button>
    </am-popover>
    <am-popover title="标题" content="带标题的气泡卡片" placement="top">
      <am-button>带标题</am-button>
    </am-popover>
    <am-popover placement="topRight">
      <template #content>
        <div class="content">
          <p>通过插槽自定义内容</p>
          <am-button type="primary" size="small">
            操作
          </am-button>
        </div>
      </template>
      <am-button>插槽内容</am-button>
    </am-popover>
  </am-flex>
</template>

<style scoped>
.content p {
  margin: 0 0 8px;
}
</style>

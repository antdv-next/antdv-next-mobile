<docs lang="zh-CN">
在每个分组前放置 `<am-index-bar-anchor>`，右侧索引会根据锚点自动生成。点击或在索引栏上拖动可以快速跳转，滚动时锚点吸顶。
</docs>

<script setup lang="ts">
const groups = 'ABCDEFGHJKLMNPQRSTWXYZ'.split('').map(letter => ({
  letter,
  names: Array.from({ length: 4 }, (_, i) => `${letter} 联系人 ${i + 1}`),
}))
</script>

<template>
  <div class="scroller">
    <am-index-bar>
      <template v-for="group in groups" :key="group.letter">
        <am-index-bar-anchor :index="group.letter" />
        <am-list :bordered="false">
          <am-list-item v-for="name in group.names" :key="name" :title="name" />
        </am-list>
      </template>
    </am-index-bar>
  </div>
</template>

<style scoped>
.scroller {
  height: 420px;
  overflow-y: auto;
}
</style>

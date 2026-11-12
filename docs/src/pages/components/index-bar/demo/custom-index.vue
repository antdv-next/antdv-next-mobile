<docs lang="zh-CN">
通过 `indexList` 自定义右侧的索引列表，索引可以是数字或任意文字。
</docs>

<script setup lang="ts">
const indexList = [1, 2, 3, 4, 5, 6, 7, 8]
</script>

<template>
  <div class="scroller">
    <am-index-bar :index-list="indexList">
      <template v-for="index in indexList" :key="index">
        <am-index-bar-anchor :index="index">
          第 {{ index }} 章
        </am-index-bar-anchor>
        <am-list :bordered="false">
          <am-list-item v-for="i in 3" :key="i" :title="`第 ${index} 章 第 ${i} 节`" />
        </am-list>
      </template>
    </am-index-bar>
  </div>
</template>

<style scoped>
.scroller {
  height: 360px;
  overflow-y: auto;
}
</style>

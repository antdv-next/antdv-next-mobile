<docs lang="zh-CN">
锚点的默认插槽可以自定义内容；`sticky` 设为 `false` 关闭吸顶。
</docs>

<script setup lang="ts">
const cities = [
  { index: '热', title: '热门城市', list: ['北京', '上海', '广州', '深圳'] },
  { index: 'A', title: 'A', list: ['安庆', '安阳', '鞍山'] },
  { index: 'B', title: 'B', list: ['保定', '包头', '北海', '蚌埠'] },
  { index: 'C', title: 'C', list: ['成都', '重庆', '长沙', '常州'] },
  { index: 'D', title: 'D', list: ['大连', '东莞', '大理'] },
  { index: 'H', title: 'H', list: ['杭州', '合肥', '哈尔滨', '海口'] },
]
</script>

<template>
  <div class="scroller">
    <am-index-bar :sticky="false">
      <template v-for="group in cities" :key="group.index">
        <am-index-bar-anchor :index="group.index">
          <b>{{ group.title }}</b>（{{ group.list.length }}）
        </am-index-bar-anchor>
        <am-list :bordered="false">
          <am-list-item v-for="city in group.list" :key="city" :title="city" />
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

<docs lang="zh-CN">
简单的展示，移动端默认一行一列。
</docs>

<script setup lang="ts">
const items = [
  { key: 'name', label: '用户名', content: '周毛毛' },
  { key: 'phone', label: '手机号', content: '181 0000 0000' },
  { key: 'city', label: '居住地', content: '浙江省杭州市' },
  { key: 'address', label: '地址', content: '浙江省杭州市西湖区万塘路 18 号黄龙时代广场 B 座' },
]
</script>

<template>
  <am-descriptions title="用户信息" :items="items">
    <template #extra>
      <am-button type="link" size="small">
        编辑
      </am-button>
    </template>
  </am-descriptions>
</template>

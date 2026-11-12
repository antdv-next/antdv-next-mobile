<docs lang="zh-CN">
`count` 设置流光数量（正整数），多条流光均匀分布在边框上。`items` 可以分别设置每条流光的 `color`、`lineWidth`、`outset` 和 `size`，数量由数组长度决定并优先于 `count`；未设置的属性继承组件的同名属性。
</docs>

<docs lang="en-US">
`count` sets the number of beams (a positive integer); they are evenly distributed around the border. `items` configures the `color`, `lineWidth`, `outset` and `size` of every beam: its length is the number of beams and wins over `count`; omitted properties inherit the component props.
</docs>

<script setup lang="ts">
const beamItems = [
  { color: '#1677ff', size: 48 },
  { color: '#52c41a', size: 72 },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-border-beam :count="3">
      <am-card title="Multiple beams">
        Set count to distribute several beams evenly around the border.
      </am-card>
    </am-border-beam>
    <am-border-beam :items="beamItems">
      <am-card title="Configured beams">
        Use items to set the color and size of each beam.
      </am-card>
    </am-border-beam>
  </am-flex>
</template>

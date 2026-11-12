<docs lang="zh-CN">
`use12Hours` 开启 12 小时制，增加上午 / 下午列；也可以直接使用带 `h` 与 `a` 的 `format`。
</docs>

<docs lang="en-US">
`use12Hours` enables the 12-hour clock and adds an AM / PM column; you can also use a `format` with `h` and `a` directly.
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref(dayjs().hour(15).minute(30).second(0))
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" use12-hours />
    <am-time-picker v-model:value="value" format="h:mm A" />
  </am-flex>
</template>

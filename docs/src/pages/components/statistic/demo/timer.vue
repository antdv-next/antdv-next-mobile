<docs lang="zh-CN">
`Statistic.Timer` 支持倒计时与正计时，`format` 可以包含天、毫秒等单位，倒计时结束触发 `finish`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const start = Date.now()
const deadline = start + 1000 * 60 * 60 * 24 * 2 + 1000 * 30
const short = ref(Date.now() + 10 * 1000)
const finished = ref(false)

function restart() {
  finished.value = false
  short.value = Date.now() + 10 * 1000
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="large" wrap>
      <am-statistic-timer title="倒计时" :value="deadline" />
      <am-statistic-timer title="精确到毫秒" :value="deadline" format="HH:mm:ss:SSS" />
    </am-flex>
    <am-statistic-timer title="距离活动结束" :value="deadline" format="D 天 H 时 m 分 s 秒" />
    <am-flex gap="large" wrap>
      <am-statistic-timer type="countup" title="正计时" :value="start" format="mm:ss" />
      <am-statistic-timer
        title="10 秒倒计时"
        :value="short"
        format="s.SS 秒"
        :value-style="finished ? { color: 'var(--am-color-error)' } : undefined"
        @finish="finished = true"
      />
    </am-flex>
    <am-button block :disabled="!finished" @click="restart">
      {{ finished ? '重新开始' : '倒计时进行中...' }}
    </am-button>
  </am-flex>
</template>

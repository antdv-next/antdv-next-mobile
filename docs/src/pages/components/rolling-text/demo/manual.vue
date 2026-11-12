<docs lang="zh-CN">
`autoStart` 设为 `false` 后，通过组件实例的 `start()` 与 `reset()` 手动控制，`finish` 在最后一位停止时触发。
</docs>

<docs lang="en-US">
With `autoStart` set to `false`, control it through `start()` and `reset()` of the component instance. `finish` is triggered when the last digit stops.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const rollingRef = ref<{ start: () => void, reset: () => void }>()
const finished = ref(false)

function start() {
  finished.value = false
  rollingRef.value?.start()
}

function reset() {
  finished.value = false
  rollingRef.value?.reset()
}
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-rolling-text
      ref="rollingRef"
      :value="6789"
      :from="1000"
      :auto-start="false"
      :duration="1.5"
      @finish="finished = true"
    />
    <am-space>
      <am-button type="primary" size="small" @click="start">
        Start
      </am-button>
      <am-button size="small" @click="reset">
        Reset
      </am-button>
      <am-tag v-if="finished" color="success">
        Finished
      </am-tag>
    </am-space>
  </am-flex>
</template>

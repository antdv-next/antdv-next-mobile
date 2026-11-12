<docs lang="zh-CN">
设置 `closable` 显示关闭按钮。点击后触发 `close` 事件并自动隐藏；在数据驱动的列表中，调用 `event.preventDefault()` 后由数据决定是否移除。
</docs>

<docs lang="en-US">
Set `closable` to show the close button. Tapping it triggers the `close` event and hides the tag automatically; in a data-driven list, call `event.preventDefault()` and let the data decide whether to remove it.
</docs>

<script setup lang="ts">
import { CloseCircleFilled } from '@antdv-next/icons'
import { ref } from 'vue'

const tags = ref(['Vue', 'TypeScript', 'Vite', 'Vitest'])

function remove(event: MouseEvent, tag: string) {
  event.preventDefault()
  tags.value = tags.value.filter(item => item !== tag)
}
</script>

<template>
  <am-space vertical size="middle">
    <am-space wrap>
      <am-tag
        v-for="tag in tags"
        :key="tag"
        color="blue"
        size="large"
        closable
        @close="remove($event, tag)"
      >
        {{ tag }}
      </am-tag>
      <am-button v-if="tags.length < 4" size="small" type="link" @click="tags = ['Vue', 'TypeScript', 'Vite', 'Vitest']">
        Reset
      </am-button>
    </am-space>
    <am-space wrap>
      <am-tag closable>
        Auto hide
      </am-tag>
      <am-tag color="error" closable>
        <template #closeIcon>
          <CloseCircleFilled />
        </template>
        Custom icon
      </am-tag>
    </am-space>
  </am-space>
</template>

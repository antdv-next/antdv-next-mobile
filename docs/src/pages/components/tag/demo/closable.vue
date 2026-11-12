<docs lang="zh-CN">
设置 `closable` 显示关闭按钮。点击后触发 `close` 事件并自动隐藏；在数据驱动的列表中，调用 `event.preventDefault()` 后由数据决定是否移除。
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
        重置
      </am-button>
    </am-space>
    <am-space wrap>
      <am-tag closable>
        自动隐藏
      </am-tag>
      <am-tag color="error" closable>
        <template #closeIcon>
          <CloseCircleFilled />
        </template>
        自定义图标
      </am-tag>
    </am-space>
  </am-space>
</template>

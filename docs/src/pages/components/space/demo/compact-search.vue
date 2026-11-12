<docs lang="zh-CN">
`Input.Search` 与 `TextArea` 也可以参与组合。搜索框在组合中会变成带边框的分段（单独使用时仍是圆角的填充样式）；多行文本会撑开所在的行，同一行的按钮跟随它的高度。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const city = ref('hz')
const keyword = ref('')
const title = ref('')
const content = ref('')
const reply = ref('')

const cities = [
  { label: '杭州', value: 'hz' },
  { label: '上海', value: 'sh' },
  { label: '北京', value: 'bj' },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-space-compact block>
      <am-select v-model:value="city" :options="cities" title="选择城市" style="flex: 0 0 92px" />
      <am-input-search v-model:value="keyword" placeholder="搜索酒店 / 地标" />
      <am-button type="primary">
        搜索
      </am-button>
    </am-space-compact>

    <am-space-compact vertical block>
      <am-input v-model:value="title" placeholder="标题" />
      <am-textarea v-model:value="content" placeholder="说点什么..." :rows="3" />
      <am-button type="primary" block>
        发布
      </am-button>
    </am-space-compact>

    <am-space-compact block>
      <am-textarea v-model:value="reply" placeholder="回复评论" :auto-size="{ minRows: 1, maxRows: 4 }" />
      <am-button type="primary">
        发送
      </am-button>
    </am-space-compact>
  </am-flex>
</template>

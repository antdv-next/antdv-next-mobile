<docs lang="zh-CN">
`clickable` 让整行带有按压反馈并触发 `click` 事件（默认显示箭头），适合点击后打开自定义弹层、跳转到二级页面选择的场景。`requiredMark="optional"` 改为标记可选项；`help` 可自定义提示信息。
</docs>

<docs lang="en-US">
`clickable` gives the whole row press feedback and triggers the `click` event (an arrow is shown by default), which suits opening a custom popup or navigating to a secondary page to select a value. `requiredMark="optional"` marks the optional items instead; `help` customizes the prompt message.
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const model = reactive({ name: '', address: '', remark: '' })
const open = ref(false)
const addresses = ['No. 100 Wensan Road, Xihu District, Hangzhou', 'No. 1 Century Avenue, Pudong, Shanghai', 'No. 88 Jianguo Road, Chaoyang, Beijing']

function pick(address: string) {
  model.address = address
  open.value = false
}
</script>

<template>
  <am-form :model="model" required-mark="optional">
    <am-form-item name="name" label="Contact" :rules="[{ required: true }]">
      <am-input v-model:value="model.name" placeholder="Please enter" />
    </am-form-item>
    <am-form-item name="address" label="Address" clickable :rules="[{ required: true, message: 'Please select an address' }]" @click="open = true">
      <span v-if="model.address">{{ model.address }}</span>
      <span v-else style="color: var(--am-color-text-placeholder)">Please select</span>
    </am-form-item>
    <am-form-item name="remark" label="Remark" help="Optional, up to 50 characters">
      <am-input v-model:value="model.remark" :maxlength="50" placeholder="Taste, preferences, etc." />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        Submit
      </am-button>
    </template>
  </am-form>
  <am-popup v-model:open="open" placement="bottom" round safe-area>
    <div style="padding: 8px 0">
      <div
        v-for="address in addresses"
        :key="address"
        style="padding: 14px 16px; font-size: 16px"
        @click="pick(address)"
      >
        {{ address }}
      </div>
    </div>
  </am-popup>
</template>

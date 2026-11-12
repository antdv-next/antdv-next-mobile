<docs lang="zh-CN">
`clickable` 让整行带有按压反馈并触发 `click` 事件（默认显示箭头），适合点击后打开自定义弹层、跳转到二级页面选择的场景。`requiredMark="optional"` 改为标记可选项；`help` 可自定义提示信息。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const model = reactive({ name: '', address: '', remark: '' })
const open = ref(false)
const addresses = ['浙江省杭州市西湖区文三路 100 号', '上海市浦东新区世纪大道 1 号', '北京市朝阳区建国路 88 号']

function pick(address: string) {
  model.address = address
  open.value = false
}
</script>

<template>
  <am-form :model="model" required-mark="optional">
    <am-form-item name="name" label="联系人" :rules="[{ required: true }]">
      <am-input v-model:value="model.name" placeholder="请输入联系人" />
    </am-form-item>
    <am-form-item name="address" label="收货地址" clickable :rules="[{ required: true, message: '请选择收货地址' }]" @click="open = true">
      <span v-if="model.address">{{ model.address }}</span>
      <span v-else style="color: var(--am-color-text-placeholder)">请选择</span>
    </am-form-item>
    <am-form-item name="remark" label="备注" help="选填，最多 50 字">
      <am-input v-model:value="model.remark" :maxlength="50" placeholder="口味、偏好等" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        提交
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

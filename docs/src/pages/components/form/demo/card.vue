<docs lang="zh-CN">
`mode="card"` 渲染为带圆角的内嵌卡片分组，配合 `header` 可以把一个长表单拆成多个分组（多个 `Form` 共用同一个 `model` 即可）。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const model = reactive({ name: '', phone: '', address: '', invoice: false, title: '' })
const baseRef = ref()
const invoiceRef = ref()
const message = ref('')

async function submit() {
  try {
    await Promise.all([baseRef.value.validate(), invoiceRef.value.validate()])
    message.value = `提交成功：${JSON.stringify(model)}`
  }
  catch (error: any) {
    message.value = error?.message ?? '校验失败'
  }
}
</script>

<template>
  <div style="padding: 4px 0 16px; background: var(--am-color-bg-layout)">
    <am-form ref="baseRef" :model="model" mode="card" header="收货信息">
      <am-form-item name="name" label="收货人" :rules="[{ required: true }]">
        <am-input v-model:value="model.name" placeholder="姓名" />
      </am-form-item>
      <am-form-item name="phone" label="手机号" :rules="[{ required: true }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]">
        <am-input v-model:value="model.phone" type="tel" inputmode="tel" placeholder="11 位手机号" />
      </am-form-item>
      <am-form-item name="address" label="详细地址" :rules="[{ required: true }]">
        <am-textarea v-model:value="model.address" auto-size placeholder="街道、门牌号" />
      </am-form-item>
    </am-form>
    <am-form ref="invoiceRef" :model="model" mode="card" header="发票信息">
      <am-form-item name="invoice" label="开具发票" content-align="end">
        <am-switch v-model:checked="model.invoice" />
      </am-form-item>
      <am-form-item v-if="model.invoice" name="title" label="发票抬头" :rules="[{ required: true }]">
        <am-input v-model:value="model.title" placeholder="个人或公司名称" />
      </am-form-item>
      <template #footer>
        <am-button type="primary" block @click="submit">
          提交订单
        </am-button>
        <p v-if="message" style="margin: 12px 0 0; font-size: 12px; word-break: break-all; color: var(--am-color-text-tertiary)">
          {{ message }}
        </p>
      </template>
    </am-form>
  </div>
</template>

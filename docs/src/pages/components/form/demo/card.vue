<docs lang="zh-CN">
`mode="card"` 渲染为带圆角的内嵌卡片分组，配合 `header` 可以把一个长表单拆成多个分组（多个 `Form` 共用同一个 `model` 即可）。
</docs>

<docs lang="en-US">
`mode="card"` renders an inset card group with rounded corners. Together with `header`, a long form can be split into several groups (several `Form`s simply share the same `model`).
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
    message.value = `Submitted: ${JSON.stringify(model)}`
  }
  catch (error: any) {
    message.value = error?.message ?? 'Validation failed'
  }
}
</script>

<template>
  <div style="padding: 4px 0 16px; background: var(--am-color-bg-layout)">
    <am-form ref="baseRef" :model="model" mode="card" header="Shipping Info">
      <am-form-item name="name" label="Recipient" :rules="[{ required: true }]">
        <am-input v-model:value="model.name" placeholder="Name" />
      </am-form-item>
      <am-form-item name="phone" label="Phone" :rules="[{ required: true }, { pattern: /^1\d{10}$/, message: 'Invalid phone number' }]">
        <am-input v-model:value="model.phone" type="tel" inputmode="tel" placeholder="11-digit number" />
      </am-form-item>
      <am-form-item name="address" label="Address" :rules="[{ required: true }]">
        <am-textarea v-model:value="model.address" auto-size placeholder="Street and house number" />
      </am-form-item>
    </am-form>
    <am-form ref="invoiceRef" :model="model" mode="card" header="Invoice Info">
      <am-form-item name="invoice" label="Invoice" content-align="end">
        <am-switch v-model:checked="model.invoice" />
      </am-form-item>
      <am-form-item v-if="model.invoice" name="title" label="Title" :rules="[{ required: true }]">
        <am-input v-model:value="model.title" placeholder="Person or company name" />
      </am-form-item>
      <template #footer>
        <am-button type="primary" block @click="submit">
          Place Order
        </am-button>
        <p v-if="message" style="margin: 12px 0 0; font-size: 12px; word-break: break-all; color: var(--am-color-text-tertiary)">
          {{ message }}
        </p>
      </template>
    </am-form>
  </div>
</template>

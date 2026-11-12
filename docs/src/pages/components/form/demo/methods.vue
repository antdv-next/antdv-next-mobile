<docs lang="zh-CN">
通过 `ref` 调用表单实例方法：`validate` / `validateFields(nameList?)`、`resetFields`、`clearValidate`、`setFieldsValue`、`getFieldsValue`、`scrollToField`。`htmlType="reset"` 的按钮等价于 `resetFields()`。
</docs>

<script setup lang="ts">
import type { FormInstance } from 'antdv-next-mobile'
import { reactive, ref } from 'vue'

const formRef = ref<FormInstance>()
const model = reactive({ name: '张三', age: 18, bio: '' })
const output = ref('')

async function validateName() {
  try {
    const values = await formRef.value!.validateFields(['name'])
    output.value = `校验通过：${JSON.stringify(values)}`
  }
  catch (error: any) {
    output.value = `校验失败：${error.message}`
  }
}

function fill() {
  formRef.value?.setFieldsValue({ name: '李四', age: 28, bio: 'Hello antdv-next-mobile' })
}

function read() {
  output.value = JSON.stringify(formRef.value?.getFieldsValue())
}
</script>

<template>
  <am-form ref="formRef" :model="model">
    <am-form-item name="name" label="姓名" :rules="[{ required: true }]">
      <am-input v-model:value="model.name" placeholder="请输入姓名" allow-clear />
    </am-form-item>
    <am-form-item name="age" label="年龄" :rules="[{ type: 'number', min: 18, message: '需年满 18 岁' }]">
      <am-input-number v-model:value="model.age" :min="0" :max="120" />
    </am-form-item>
    <am-form-item name="bio" label="简介" :rules="[{ required: true }]">
      <am-textarea v-model:value="model.bio" auto-size placeholder="介绍一下自己" />
    </am-form-item>
    <template #footer>
      <am-flex gap="small" wrap>
        <am-button size="small" type="primary" html-type="submit">
          submit
        </am-button>
        <am-button size="small" html-type="reset">
          reset
        </am-button>
        <am-button size="small" @click="validateName">
          validateFields(['name'])
        </am-button>
        <am-button size="small" @click="formRef?.clearValidate()">
          clearValidate
        </am-button>
        <am-button size="small" @click="fill">
          setFieldsValue
        </am-button>
        <am-button size="small" @click="read">
          getFieldsValue
        </am-button>
      </am-flex>
      <p v-if="output" style="margin: 12px 0 0; font-size: 12px; word-break: break-all; color: var(--am-color-text-tertiary)">
        {{ output }}
      </p>
    </template>
  </am-form>
</template>

<docs lang="zh-CN">
最基础的登录表单：`model` 绑定数据，`FormItem` 通过 `name` 关联字段、`rules` 声明校验。`htmlType="submit"` 的按钮会触发校验，通过后触发 `finish`，失败触发 `finishFailed`。
</docs>

<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@antdv-next/icons'
import { reactive, ref } from 'vue'

const model = reactive({ username: '', password: '', remember: true })
const result = ref('')

function onFinish(values: Record<string, any>) {
  result.value = `finish: ${JSON.stringify(values)}`
}

function onFinishFailed({ errorFields }: { errorFields: { name: (string | number)[], errors: string[] }[] }) {
  result.value = `finishFailed: ${errorFields.map(field => field.errors[0]).join('；')}`
}
</script>

<template>
  <am-form :model="model" name="login" @finish="onFinish" @finish-failed="onFinishFailed">
    <am-form-item name="username" label="账号" :rules="[{ required: true, message: '请输入账号' }]">
      <am-input v-model:value="model.username" placeholder="手机号 / 邮箱" allow-clear>
        <template #prefix>
          <UserOutlined />
        </template>
      </am-input>
    </am-form-item>
    <am-form-item name="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]">
      <am-input-password v-model:value="model.password" placeholder="请输入密码">
        <template #prefix>
          <LockOutlined />
        </template>
      </am-input-password>
    </am-form-item>
    <am-form-item name="remember" label="记住我" content-align="end">
      <am-switch v-model:checked="model.remember" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        登录
      </am-button>
      <p v-if="result" style="margin: 12px 0 0; font-size: 12px; word-break: break-all; color: var(--am-color-text-tertiary)">
        {{ result }}
      </p>
    </template>
  </am-form>
</template>

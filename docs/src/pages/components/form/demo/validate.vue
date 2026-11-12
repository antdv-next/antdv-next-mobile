<docs lang="zh-CN">
校验规则与 PC 端一致（基于 async-validator）：内置类型、正则、自定义异步 `validator`、`warningOnly`。`validateTrigger` 可在 Form、FormItem 或单条规则（`trigger`）上设置为 `change` / `blur`；错误信息显示在控件下方。
</docs>

<docs lang="en-US">
The validation rules are the same as on PC (based on async-validator): built-in types, regular expressions, custom async `validator` and `warningOnly`. `validateTrigger` can be set to `change` / `blur` on Form, FormItem or a single rule (`trigger`); error messages are shown below the control.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({ nickname: '', phone: '', email: '', password: '', confirm: '' })

const rules = {
  nickname: [
    { required: true },
    { min: 2, max: 8, trigger: 'blur' as const },
    {
      validator: async (_rule: unknown, value: string) => {
        await new Promise(resolve => setTimeout(resolve, 600))
        if (value === 'admin')
          throw new Error('This nickname is already taken')
      },
      trigger: 'blur' as const,
    },
  ],
  phone: [{ required: true }, { pattern: /^1\d{10}$/, message: 'Invalid phone number' }],
  email: [{ type: 'email' as const, warningOnly: true, message: 'The email may be invalid (does not block submit)' }],
  password: [{ required: true }, { min: 6, message: 'At least 6 characters' }],
}

const confirmRules = [
  { required: true, message: 'Please confirm your password' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && value !== model.password)
        throw new Error('The two passwords do not match')
    },
  },
]
</script>

<template>
  <am-form :model="model" :rules="rules" scroll-to-first-error>
    <am-form-item name="nickname" label="Nickname" has-feedback extra="2-8 characters, validated on blur; try admin">
      <am-input v-model:value="model.nickname" placeholder="Please enter" />
    </am-form-item>
    <am-form-item name="phone" label="Phone">
      <am-input v-model:value="model.phone" type="tel" inputmode="tel" :maxlength="11" placeholder="Please enter" />
    </am-form-item>
    <am-form-item name="email" label="Email">
      <am-input v-model:value="model.email" inputmode="email" placeholder="Optional" />
    </am-form-item>
    <am-form-item name="password" label="Password">
      <am-input-password v-model:value="model.password" placeholder="At least 6 characters" />
    </am-form-item>
    <am-form-item name="confirm" label="Confirm" :rules="confirmRules" validate-first>
      <am-input-password v-model:value="model.confirm" placeholder="Enter it again" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        Sign up
      </am-button>
    </template>
  </am-form>
</template>

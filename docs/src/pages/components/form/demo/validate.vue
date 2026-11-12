<docs lang="zh-CN">
校验规则与 PC 端一致（基于 async-validator）：内置类型、正则、自定义异步 `validator`、`warningOnly`。`validateTrigger` 可在 Form、FormItem 或单条规则（`trigger`）上设置为 `change` / `blur`；错误信息显示在控件下方。
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
          throw new Error('该昵称已被占用')
      },
      trigger: 'blur' as const,
    },
  ],
  phone: [{ required: true }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }],
  email: [{ type: 'email' as const, warningOnly: true, message: '邮箱格式可能有误（不阻塞提交）' }],
  password: [{ required: true }, { min: 6, message: '密码至少 6 位' }],
}

const confirmRules = [
  { required: true, message: '请再次输入密码' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && value !== model.password)
        throw new Error('两次输入的密码不一致')
    },
  },
]
</script>

<template>
  <am-form :model="model" :rules="rules" scroll-to-first-error>
    <am-form-item name="nickname" label="昵称" has-feedback extra="2-8 个字符，失焦时校验；输入 admin 试试">
      <am-input v-model:value="model.nickname" placeholder="请输入昵称" />
    </am-form-item>
    <am-form-item name="phone" label="手机号">
      <am-input v-model:value="model.phone" type="tel" inputmode="tel" :maxlength="11" placeholder="请输入手机号" />
    </am-form-item>
    <am-form-item name="email" label="邮箱">
      <am-input v-model:value="model.email" inputmode="email" placeholder="选填" />
    </am-form-item>
    <am-form-item name="password" label="密码">
      <am-input-password v-model:value="model.password" placeholder="至少 6 位" />
    </am-form-item>
    <am-form-item name="confirm" label="确认密码" :rules="confirmRules" validate-first>
      <am-input-password v-model:value="model.confirm" placeholder="请再次输入密码" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        注册
      </am-button>
    </template>
  </am-form>
</template>

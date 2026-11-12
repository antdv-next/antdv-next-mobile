<docs lang="zh-CN">
`Picker`、`DatePicker`、`Cascader`、`Select` 等选择类组件在表单中自动使用无边框形态，与输入框对齐，并在选择后触发 `change` 校验。给 `FormItem` 加上 `arrow` 可以提示这一行会打开弹层。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive<{ gender?: string, birthday?: string, city: string[], education: string[], hobbies: string[] }>({
  gender: undefined,
  birthday: undefined,
  city: [],
  education: [],
  hobbies: [],
})

const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '保密', value: 'secret' },
]
const educationColumns = [['高中', '大专', '本科', '硕士', '博士'].map(label => ({ label, value: label }))]
const cityOptions = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      { label: '杭州', value: 'hangzhou', children: [{ label: '西湖区', value: 'xihu' }, { label: '余杭区', value: 'yuhang' }] },
      { label: '宁波', value: 'ningbo', children: [{ label: '鄞州区', value: 'yinzhou' }] },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing', children: [{ label: '玄武区', value: 'xuanwu' }] }],
  },
]
const hobbyOptions = ['阅读', '运动', '音乐', '旅行', '摄影'].map(label => ({ label, value: label }))
</script>

<template>
  <am-form :model="model" content-align="end">
    <am-form-item name="gender" label="性别" arrow :rules="[{ required: true, message: '请选择性别' }]">
      <am-select v-model:value="model.gender" :options="genderOptions" title="性别" placeholder="请选择" :suffix-icon="null" />
    </am-form-item>
    <am-form-item name="birthday" label="生日" arrow :rules="[{ required: true, message: '请选择生日' }]">
      <am-date-picker v-model:value="model.birthday" value-format="YYYY-MM-DD" title="生日" placeholder="请选择" :suffix-icon="null" />
    </am-form-item>
    <am-form-item name="education" label="学历" arrow>
      <am-picker v-model:value="model.education" :columns="educationColumns" title="学历" placeholder="请选择" :suffix-icon="null" />
    </am-form-item>
    <am-form-item name="city" label="所在地区" arrow :rules="[{ required: true, type: 'array', message: '请选择所在地区' }]">
      <am-cascader v-model:value="model.city" :options="cityOptions" title="所在地区" placeholder="请选择" :suffix-icon="null" />
    </am-form-item>
    <am-form-item name="hobbies" label="兴趣爱好" arrow>
      <am-select v-model:value="model.hobbies" mode="multiple" :options="hobbyOptions" title="兴趣爱好" placeholder="可多选" :suffix-icon="null" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        保存
      </am-button>
    </template>
  </am-form>
</template>

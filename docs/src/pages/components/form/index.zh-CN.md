---
title: Form
subtitle: 表单
description: 具有数据收集、校验和提交功能的表单，以移动端单元格的形式呈现。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

API 与 antdv-next 的 `Form` 对齐：`model` + `rules` 驱动校验，`FormItem` 通过 `name` 关联字段，实例方法 `validate` / `resetFields` / `setFieldsValue` 等保持同名。移动端的 `FormItem` 渲染为一行单元格（细线分隔、错误信息显示在控件下方），表单内的输入类组件默认使用 `borderless` 形态。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>登录表单</demo>
<demo src="./demo/validate.vue" full>表单校验</demo>
<demo src="./demo/layout.vue" full>垂直布局</demo>
<demo src="./demo/card.vue" full>卡片模式</demo>
<demo src="./demo/picker.vue" full>搭配选择器</demo>
<demo src="./demo/fields.vue" full>更多表单项与禁用</demo>
<demo src="./demo/clickable.vue" full>可点击的单元格</demo>
<demo src="./demo/methods.vue" full>实例方法</demo>

## API

### Form 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象（响应式对象），校验、重置与 `finish` 都依赖它 | `Record<string, any>` | - |
| rules | 表单级校验规则，按字段名组织，支持嵌套路径；与 `FormItem` 的 `rules` 合并 | `FormRulesMap` | - |
| name | 表单名称，会作为表单字段 `id` 的前缀 | `string` | - |
| layout | 表单布局 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| labelAlign | 水平布局下标签的对齐方式 | `'start' \| 'end'` | `'start'` |
| labelWidth | 水平布局下标签的宽度 | `number \| string` | `5.6em` |
| labelWrap | 标签文本是否换行（默认超出省略） | `boolean` | `false` |
| colon | 水平布局下是否在标签后显示冒号 | `boolean` | `false` |
| contentAlign | 控件区域的对齐方式 | `'start' \| 'end'` | `'start'` |
| disabled | 禁用表单内的所有组件 | `boolean` | `false` |
| size | 表单内组件的尺寸 | `'small' \| 'middle' \| 'large'` | - |
| variant | 表单内组件的形态变体 | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'borderless'` |
| requiredMark | 必填标记。`'optional'` 改为给非必填项显示「可选」 | `boolean \| 'optional'` | `true` |
| validateTrigger | 统一设置字段触发校验的时机，`false` 表示只在提交 / 手动调用时校验 | `'change' \| 'blur' \| ('change' \| 'blur')[] \| false` | `'change'` |
| validateMessages | 校验提示模板，覆盖语言包中的默认模板，支持 `${label}`、`${min}` 等变量 | `ValidateMessages` | - |
| scrollToFirstError | 提交失败后滚动到第一个错误字段 | `boolean \| { behavior?, block?, focus? }` | `false` |
| mode | 展示模式，`card` 为带圆角的内嵌卡片 | `'default' \| 'card'` | `'default'` |
| header | 表单项上方的标题，同名插槽优先 | `VueNode` | - |
| footer | 表单项下方的区域（通常放提交按钮），同名插槽优先 | `VueNode` | - |
| autocomplete | 原生 `form` 的 `autocomplete` | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'body' \| 'footer' \| 'item' \| 'label' \| 'content' \| 'help' \| 'extra', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'body' \| 'footer' \| 'item' \| 'label' \| 'content' \| 'help' \| 'extra', CSSProperties>` | - |

### Form 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| finish | 提交表单且校验通过后触发 | `(values: Record<string, any>) => void` |
| finishFailed | 提交表单且校验失败后触发 | `({ values, errorFields, message, outOfDate }) => void` |
| submit | 表单提交时触发（校验之前） | `(event: Event) => void` |
| reset | 表单被原生重置（`htmlType="reset"`）时触发，随后执行 `resetFields` | `(event: Event) => void` |
| validate | 任一字段校验结束后触发 | `(name: (string \| number)[], status: boolean, errors: string[] \| null) => void` |
| valuesChange | 用户操作导致字段值变化时触发 | `(changedValues, values) => void` |

### Form 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 表单项 |
| header | 标题区域，优先于 `header` 属性 |
| footer | 底部区域，优先于 `footer` 属性 |

### Form 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| validate / validateFields | 校验并获取字段值，可指定字段；失败时 reject `{ values, errorFields, message }` | `(nameList?: NamePath[], options?: { validateOnly?: boolean, dirty?: boolean }) => Promise<Values>` |
| resetFields | 重置字段为初始值并清除校验状态 | `(nameList?: NamePath[]) => void` |
| clearValidate | 清除校验状态 | `(nameList?: NamePath[]) => void` |
| scrollToField | 滚动到对应字段位置 | `(name: NamePath, options?: { behavior?, block?, focus? }) => void` |
| focusField | 聚焦对应字段的控件 | `(name: NamePath) => void` |
| getFieldValue | 获取字段值 | `(name: NamePath) => any` |
| getFieldsValue | 获取一组字段值。不传时返回已注册字段的值，`true` 返回整个 `model` | `(nameList?: NamePath[] \| true) => Values` |
| setFieldValue | 设置字段值 | `(name: NamePath, value: any) => void` |
| setFieldsValue | 设置一组字段值 | `(values: Record<string, any>) => void` |
| setFields | 设置一组字段的值与校验状态 | `(fields: { name, value?, errors?, warnings?, touched?, validating? }[]) => void` |
| getFieldError / getFieldWarning | 获取字段的错误 / 警告信息 | `(name: NamePath) => string[]` |
| getFieldsError | 获取一组字段的错误信息 | `(nameList?: NamePath[]) => { name, errors, warnings }[]` |
| isFieldTouched / isFieldsTouched | 字段是否被用户操作过 | `(name: NamePath) => boolean` |
| isFieldValidating / isFieldsValidating | 字段是否正在校验 | `(name: NamePath) => boolean` |
| submit | 提交表单，与点击 `submit` 按钮效果相同 | `() => void` |
| nativeElement | 原生 `form` 元素 | `HTMLFormElement` |

> `NamePath` 为 `string | number | (string | number)[]`。

### FormItem 属性 {#form-item-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段在 `model` 中的路径，如 `'name'` 或 `['user', 'name']` | `NamePath` | - |
| label | 标签文本，同名插槽优先 | `VueNode` | - |
| rules | 校验规则，见 [Rule](#rule) | `FormRule[]` | - |
| required | 必填样式。不设置时根据校验规则自动生成 | `boolean` | - |
| help | 提示信息，设置后替代校验信息显示，同名插槽优先 | `VueNode` | - |
| extra | 额外的提示信息，同名插槽优先 | `VueNode` | - |
| validateStatus | 手动指定校验状态 | `'success' \| 'warning' \| 'error' \| 'validating'` | - |
| hasFeedback | 在控件末尾展示校验状态图标 | `boolean` | `false` |
| validateTrigger | 字段触发校验的时机 | `'change' \| 'blur' \| ('change' \| 'blur')[] \| false` | 继承 Form |
| validateFirst | 某条规则校验失败后停止校验后续规则，`'parallel'` 为并行校验 | `boolean \| 'parallel'` | `false` |
| validateDebounce | 由 `change` / `blur` 触发的校验的防抖时间（毫秒） | `number` | - |
| messageVariables | 校验模板变量，默认 `label` 取自 `label` 属性 | `Record<string, string>` | - |
| noStyle | 不渲染单元格，只渲染控件；校验信息会显示在最近的父级 `FormItem` 上 | `boolean` | `false` |
| hidden | 隐藏该项（仍会参与校验与提交） | `boolean` | `false` |
| layout | 覆盖 Form 的 `layout` | `'horizontal' \| 'vertical'` | 继承 Form |
| labelAlign | 覆盖 Form 的 `labelAlign` | `'start' \| 'end'` | 继承 Form |
| labelWidth | 覆盖 Form 的 `labelWidth` | `number \| string` | 继承 Form |
| colon | 覆盖 Form 的 `colon` | `boolean` | 继承 Form |
| contentAlign | 覆盖 Form 的 `contentAlign` | `'start' \| 'end'` | 继承 Form |
| id | 控件的 `id`，默认由 `name` 生成 | `string` | - |
| clickable | 整行可点击（带按压反馈） | `boolean` | `false` |
| arrow | 行尾的箭头，可传入自定义节点，同名插槽优先 | `boolean \| VueNode` | 同 `clickable` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'label' \| 'content' \| 'help' \| 'extra', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'label' \| 'content' \| 'help' \| 'extra', CSSProperties>` | - |

### FormItem 事件 {#form-item-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击单元格时触发 | `(event: MouseEvent) => void` |

### FormItem 插槽 {#form-item-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 控件 |
| label | 标签，优先于 `label` 属性 |
| help | 提示信息，优先于 `help` 属性 |
| extra | 额外提示，优先于 `extra` 属性 |
| arrow | 自定义箭头，优先于 `arrow` 属性 |

### Rule {#rule}

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| type | 值的类型 | `'string' \| 'number' \| 'boolean' \| 'integer' \| 'float' \| 'array' \| 'object' \| 'enum' \| 'date' \| 'url' \| 'hex' \| 'email' \| 'tel' \| 'regexp' \| 'method'` |
| required | 是否必填 | `boolean` |
| message | 错误信息，不设置时使用语言包中的模板 | `string` |
| len / min / max | 长度（字符串、数组）或大小（数字）限制 | `number` |
| pattern | 正则校验 | `RegExp` |
| enum | 枚举值，需 `type: 'enum'` | `any[]` |
| whitespace | 仅包含空格时视为错误，需 `type: 'string'` | `boolean` |
| transform | 校验前转换值 | `(value) => any` |
| validator | 自定义校验，返回 Promise，reject 的 `Error.message` 作为错误信息 | `(rule, value) => Promise<void>` |
| warningOnly | 仅警告，不阻塞提交 | `boolean` |
| trigger / validateTrigger | 该规则的触发时机 | `'change' \| 'blur' \| ('change' \| 'blur')[]` |
| defaultField | `type: 'array'` 时每个元素的规则 | `Rule` |

### 自定义表单控件 {#custom-field}

自定义控件只需支持 `v-model:value`，`FormItem` 会监听 `model` 中对应字段的变化并触发 `change` 校验。需要 `blur` 校验、校验状态或 `id` 时使用 `useFormItemInputContext`：

```ts
import { useFormItemInputContext, useMergedStatus } from 'antdv-next-mobile'

const formItem = useFormItemInputContext()
const status = useMergedStatus(() => props.status) // 'error' | 'warning' | ...

formItem.onFieldChange() // 值变化后调用
formItem.onFieldBlur() // 失焦 / 关闭弹层后调用
formItem.id.value // 控件 id
```

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Form` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-form-background` | 表单项背景色 | `var(--am-color-bg-container)` |
| `--am-form-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-form-label-width` | 水平布局下的标签宽度 | `5.6em` |
| `--am-form-label-color` | 标签颜色 | `var(--am-color-text)` |
| `--am-form-label-gap` | 标签与控件的间距 | `var(--am-padding-sm)` |
| `--am-form-item-padding-block` | 表单项垂直内边距 | `9px` |
| `--am-form-item-padding-inline` | 表单项水平内边距 | `var(--am-padding)` |
| `--am-form-item-content-min-height` | 控件区域最小高度 | `30px` |
| `--am-form-item-active-background` | 可点击表单项的按压背景色 | `var(--am-color-fill-tertiary)` |
| `--am-form-explain-font-size` | 校验 / 提示信息文字大小 | `var(--am-font-size-sm)` |
| `--am-form-header-color` | 标题颜色 | `var(--am-color-text-tertiary)` |
| `--am-form-card-radius` | 卡片模式圆角 | `var(--am-border-radius-lg)` |
| `--am-form-card-margin` | 卡片模式两侧外边距 | `var(--am-margin-sm)` |

## 与 PC 端的差异 {#diff}

- `FormItem` 渲染为移动端单元格：细线分隔、标签在左（或上方）、错误信息在控件下方；没有 `inline` 布局与栅格（`labelCol` / `wrapperCol`），用 `labelWidth` 控制标签宽度。
- 新增 `mode="card"`、`header` / `footer`、`contentAlign`，`FormItem` 新增 `clickable`、`arrow` 与 `click` 事件。
- `variant` 默认为 `'borderless'`（PC 为 `'outlined'`），`colon` 默认为 `false`，`labelAlign` 默认为 `'start'`。
- `scrollToFirstError` 默认滚动到屏幕中间且不自动聚焦（避免弹出键盘），可通过 `{ focus: true }` 开启。
- `validateTrigger` 只支持 `change` / `blur`；规则的 `message` 只支持字符串。
- 不支持 `tooltip`、`feedbackIcons`、`preserve`、`clearOnDestroy`、`validateOnRuleChange`、`Form.useForm` / `Form.useWatch`、`Form.List`、`Form.Provider`、`fieldsChange` 事件与 `getFieldInstance`；`requiredMark` 不支持函数形式。

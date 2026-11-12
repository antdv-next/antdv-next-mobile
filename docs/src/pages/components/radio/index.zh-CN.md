---
title: Radio
subtitle: 单选框
description: 在一组备选项中进行单选。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 用于在多个备选项中选中单个状态。
- 和 `Select` / `Picker` 的区别是，`Radio` 的所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

API 与 Antdv Next 的 `Radio` 对齐：`Radio.Group` 的 `v-model:value`、`options`、`optionType`、`buttonStyle`，`change` 事件参数结构保持一致。移动端额外提供了列表形态（`block`）与自定义图标。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/disabled.vue">不可用</demo>
<demo src="./demo/options.vue">通过 options 配置</demo>
<demo src="./demo/vertical.vue">垂直排列</demo>
<demo src="./demo/block.vue" full>列表形态</demo>
<demo src="./demo/button.vue">按钮样式</demo>
<demo src="./demo/button-size.vue">按钮尺寸与通栏</demo>
<demo src="./demo/icon.vue">自定义图标</demo>

## API

### Radio / Radio.Button 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked (v-model) | 是否选中 | `boolean` | - |
| defaultChecked | 初始是否选中 | `boolean` | `false` |
| disabled | 禁用状态 | `boolean` | `false` |
| value | 在 `Radio.Group` 中使用时的选项值 | `any` | - |
| block | 通栏展示：文字在左、单选框在右（仅 `Radio`） | `boolean` | `false` |
| icon | 自定义图标，同名插槽优先（仅 `Radio`） | `VueNode \| (ctx: { checked, disabled }) => VueNode` | - |
| name | 原生 `input` 的 `name` | `string` | - |
| id | 原生 `input` 的 `id`，在 `Form.Item` 内默认取字段 id | `string` | - |
| title | 原生 `title` | `string` | - |
| tabIndex | 原生 `tabindex` | `number` | - |
| autoFocus | 自动获取焦点 | `boolean` | `false` |
| required | 原生 `required` | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'label', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'label', CSSProperties>` | - |

### Radio / Radio.Button 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中时触发 | `(e: RadioChangeEvent) => void` |
| update:checked | 选中时触发，用于 `v-model:checked` | `(checked: boolean) => void` |
| click | 点击时触发 | `(event: MouseEvent) => void` |
| focus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |

```ts
interface RadioChangeEvent {
  target: RadioProps & { checked: boolean }
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: Event
}
```

### Radio 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 文字内容 | - |
| icon | 自定义图标，优先于 `icon` 属性（仅 `Radio`） | `{ checked: boolean, disabled: boolean }` |

### Radio 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获取焦点 | `() => void` |
| blur | 移除焦点 | `() => void` |
| input | 原生 `input` 元素 | `HTMLInputElement` |
| nativeElement | 根元素 | `HTMLElement` |

### Radio.Group 属性 {#group-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 当前选中的值 | `any` | - |
| defaultValue | 默认选中的值 | `any` | - |
| options | 选项配置，设置后忽略默认插槽 | `(string \| number \| RadioOptionType)[]` | - |
| optionType | 选项的展示类型 | `'default' \| 'button'` | `'default'` |
| buttonStyle | 按钮样式的风格 | `'outline' \| 'solid'` | `'outline'` |
| size | 按钮样式的尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| disabled | 整组禁用 | `boolean` | `false` |
| name | 组内所有 `input` 的 `name`，默认自动生成 | `string` | - |
| id | 根节点 `id`，在 `Form.Item` 内默认取字段 id | `string` | - |
| block | 宽度撑满父元素；按钮样式下等分宽度，默认样式下为列表形态 | `boolean` | `false` |
| vertical | 垂直排列 | `boolean` | `false` |
| orientation | 排列方向，`vertical` 优先 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| labelRender | 自定义选项文字，同名插槽优先 | `(params: { item: RadioOptionType, index: number }) => VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemLabel', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemLabel', CSSProperties>` | - |

```ts
interface RadioOptionType {
  label: VueNode
  value: any
  disabled?: boolean
  title?: string
  id?: string
  required?: boolean
  class?: string
  style?: CSSProperties
}
```

### Radio.Group 事件 {#group-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 选项变化时触发 | `(e: RadioChangeEvent) => void` |
| update:value | 选项变化时触发，用于 `v-model:value` | `(value: any) => void` |

### Radio.Group 插槽 {#group-slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自由组合 `Radio` / `Radio.Button`，未设置 `options` 时生效 | - |
| labelRender | 自定义选项文字 | `{ item: RadioOptionType, index: number }` |
| icon | 统一自定义组内图标 | `{ checked: boolean, disabled: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Radio` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-radio-size` | 单选框尺寸 | `20px` |
| `--am-radio-dot-size` | 选中圆点尺寸 | `8px` |
| `--am-radio-gap` | 单选框与文字间距 | `var(--am-padding-xs)` |
| `--am-radio-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-radio-color` | 选中颜色 | `var(--am-color-primary)` |
| `--am-radio-border-color` | 未选中边框颜色 | `var(--am-color-border)` |
| `--am-radio-min-height` | 最小高度（触控热区） | `32px` |
| `--am-radio-block-height` | `block` 形态的最小行高 | `48px` |
| `--am-radio-group-gap` | 组内选项水平间距 | `var(--am-padding)` |
| `--am-radio-button-height` | 按钮样式高度 | `var(--am-control-height)` |
| `--am-radio-button-font-size` | 按钮样式文字大小 | `var(--am-font-size-lg)` |
| `--am-radio-button-padding-inline` | 按钮样式水平内边距 | `var(--am-padding)` |
| `--am-radio-button-border-radius` | 按钮样式圆角 | `var(--am-border-radius)` |
| `--am-radio-button-color` | 按钮样式选中颜色 | `var(--am-color-primary)` |
| `--am-radio-button-checked-bg` | `outline` 风格选中背景 | `var(--am-color-primary-bg)` |

## 与 PC 端的差异 {#diff}

- 新增 `block`（`Radio` 与默认样式的 `Radio.Group` 为列表形态）、`icon` 属性 / 插槽，`Radio.Group` 新增 `icon` 插槽。
- 单选框尺寸更大（20px），整行 `label` 都是点击热区，最小高度 32px。
- `outline` 风格的按钮选中时带有浅色背景，按压反馈使用 `:active`，没有 hover 态与波纹动效。
- 不提供 `mouseenter`、`mouseleave`、`keypress`、`keydown` 事件；方向键切换由原生同名 `radio` 提供。
- `classes` / `styles` 只支持对象形式，不支持函数形式。

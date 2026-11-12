---
title: Rate
subtitle: 评分
description: 用于对事物进行评分操作。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 对评价进行展示。
- 对事物进行快速的评级操作。

API 与 antdv-next 的 `Rate` 对齐，移动端除了点击之外，还可以按住在星星上左右滑动来评分。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/half.vue">半星</demo>
<demo src="./demo/text.vue">辅助文字</demo>
<demo src="./demo/clear.vue">清除</demo>
<demo src="./demo/character.vue">其他字符</demo>
<demo src="./demo/size.vue">尺寸与数量</demo>
<demo src="./demo/disabled.vue">只读</demo>
<demo src="./demo/style-class.vue">组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前数，受控值，支持 `v-model:value` | `number` | - |
| defaultValue | 默认值 | `number` | `0` |
| count | star 总数 | `number` | `5` |
| allowHalf | 是否允许半选 | `boolean` | `false` |
| allowClear | 是否允许再次点击后清除（滑动到第一颗星之外同样会清除） | `boolean` | `true` |
| disabled | 只读，无法进行交互 | `boolean` | `false` |
| character | 自定义字符，同名插槽优先 | `VueNode \| ((ctx: { index: number, value: number }) => VueNode)` | `<StarFilled />` |
| size | 星星尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| keyboard | 支持使用键盘左右方向键操作 | `boolean` | `true` |
| id | 根节点 id，在 `Form.Item` 中自动设置 | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'star', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'star', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 选择时的回调，滑动过程中数值变化也会触发 | `(value: number) => void` |
| update:value | `v-model:value` 更新 | `(value: number) => void` |
| focus | 获取焦点时的回调 | `() => void` |
| blur | 失去焦点时的回调 | `() => void` |
| keydown | 按键回调 | `(event: KeyboardEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| character | 自定义字符，优先于 `character` 属性 | `{ index: number, value: number }` |

### 方法 {#methods}

| 名称 | 说明 |
| --- | --- |
| focus() | 获取焦点 |
| blur() | 移除焦点 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Rate` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-rate-size` | 星星大小 | `24px`（small `18px` / large `32px`） |
| `--am-rate-gap` | 星星间距 | `var(--am-margin-xs)` |
| `--am-rate-color` | 选中颜色 | `var(--am-color-warning)` |
| `--am-rate-color-inactive` | 未选中颜色 | `var(--am-color-fill)` |

## 与 PC 端的差异 {#diff}

- 新增触摸滑动评分：按住并左右滑动即可连续改变分值，纵向滑动不会拦截页面滚动。
- 不支持 `tooltips`（移动端没有 hover），辅助文字请参考「辅助文字」示例自行渲染。
- 没有 `hoverChange`、`mouseleave` 事件。
- `character` 的函数参数为 `{ index, value }`，并新增同名 `character` 插槽。
- `size` 取值与本库其他组件一致为 `'small' | 'middle' | 'large'`。
- 默认星星尺寸更大（24px），并扩大了每颗星的触摸热区。

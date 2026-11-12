---
title: ColorPicker
subtitle: 颜色选择器
description: 在底部面板中拖动选择颜色，支持透明度、预设颜色与多种格式。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要用户自定义颜色（主题色、标签色、画笔颜色等）时。
- 希望把颜色面板直接嵌入页面时，使用 `ColorPickerPanel`。

API 与 antdv-next 的 `ColorPicker` 对齐：`value` 可以是颜色字符串或 `Color` 对象，`valueFormat` 决定 `v-model:value` 得到的格式，`format` 决定输入框与文本的显示格式。移动端使用底部弹层代替下拉面板，点击「确定」后才会提交。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法与文本</demo>
<demo src="./demo/size.vue">尺寸与禁用</demo>
<demo src="./demo/clear.vue">清除与禁用透明度</demo>
<demo src="./demo/presets.vue">预设颜色</demo>
<demo src="./demo/format.vue">颜色格式</demo>
<demo src="./demo/controlled.vue">受控与事件</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器与表单</demo>
<demo src="./demo/panel.vue">内嵌面板 ColorPickerPanel</demo>

## API

### ColorPicker 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 已提交的颜色，`null` / 空字符串表示无色 | `string \| Color \| null` | - |
| defaultValue | 默认颜色（非受控） | `string \| Color \| null` | - |
| valueFormat | `v-model:value` 的输出格式，设置后得到对应格式的字符串，否则得到 `Color` 对象 | `'hex' \| 'rgb' \| 'hsb' \| ((color: Color) => string)` | - |
| format (v-model) | 输入框与触发器文本的颜色格式 | `'hex' \| 'rgb' \| 'hsb'` | - |
| defaultFormat | 默认颜色格式（非受控） | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` |
| allowClear | 在面板中显示清除按钮 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| disabledAlpha | 禁用透明度 | `boolean` | `false` |
| disabledFormat | 禁用颜色格式切换 | `boolean` | `false` |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| presets | 预设颜色分组 | [ColorPickerPresetsItem](#presets-item)[] | - |
| showText | 显示颜色文本，或自定义渲染，同名插槽优先 | `boolean \| ((info: { color: Color }) => VNodeChild)` | `false` |
| size | 触发器尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| panelRender | 自定义面板内容，同名插槽优先 | `(info: { panel: VNode, extra: { components: { Picker, Presets } } }) => VNodeChild` | - |
| destroyOnHidden | 关闭后销毁弹层内容 | `boolean` | `false` |
| title | 弹层标题，同名插槽优先 | `VueNode` | - |
| okText | 确认按钮文字 | `string` | `'确定'` |
| cancelText | 取消按钮文字 | `string` | `'取消'` |
| getContainer | 弹层挂载节点，`false` 时原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 弹层层级 | `number` | - |
| maskClosable | 点击遮罩是否关闭（等同取消） | `boolean` | `true` |
| id | 触发器的 id，默认使用 FormItem 生成的 id | `string` | - |
| rootClass | 触发器与弹层根节点的 class | `string` | - |
| classes | 语义化结构 class：`root`、`body`、`content`、`description`、`popup` | `ColorPickerSemanticClassNames` | - |
| styles | 语义化结构 style | `ColorPickerSemanticStyles` | - |

### ColorPicker 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 已提交的颜色变化 | `(value: string \| Color \| null) => void` |
| change | 已提交的颜色变化（点击确定） | `(color: Color, css: string) => void` |
| changeComplete | 一次拖动结束，或点选预设、输入等非拖动的变化；此时颜色尚未提交 | `(color: Color) => void` |
| select | 面板中的待定颜色变化（拖动时连续触发），尚未提交 | `(color: Color, css: string) => void` |
| confirm | 点击确定 | `(color: Color) => void` |
| cancel | 点击取消或遮罩 | `() => void` |
| clear | 已提交的颜色被清除 | `() => void` |
| formatChange | 颜色格式变化 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |
| update:format | 颜色格式变化 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |
| openChange | 弹层展开 / 收起 | `(open: boolean) => void` |
| update:open | 弹层展开 / 收起 | `(open: boolean) => void` |

### ColorPicker 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器 | `{ open, value: Color, label: string, disabled, toggle }` |
| showText | 自定义触发器文本 | `{ color: Color }` |
| panelRender | 自定义面板内容，用 `<component :is="panel" />` 渲染默认面板 | `{ panel, extra: { components: { Picker, Presets } } }` |
| title | 弹层标题 | - |

### ColorPicker 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

### ColorPickerPanel 属性 {#panel-props}

内嵌面板，没有触发器与弹层，颜色变化即时生效。支持 `value (v-model)`、`defaultValue`、`valueFormat`、`format (v-model)`、`defaultFormat`、`allowClear`、`disabled`、`disabledAlpha`、`disabledFormat`、`presets`、`panelRender`、`rootClass`，含义同上。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| classes | 语义化结构 class：`root`、`palette`、`slider`、`input`、`presets` | `ColorPickerPanelSemanticClassNames` | - |
| styles | 语义化结构 style | `ColorPickerPanelSemanticStyles` | - |

### ColorPickerPanel 事件 {#panel-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 颜色变化 | `(value: string \| Color \| null) => void` |
| change | 颜色变化，拖动时连续触发 | `(color: Color, css: string) => void` |
| changeComplete | 一次拖动结束，或非拖动的变化 | `(color: Color) => void` |
| clear | 点击清除 | `() => void` |
| formatChange | 颜色格式变化 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |
| update:format | 颜色格式变化 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |

插槽：`panelRender`，同 ColorPicker。

### ColorPickerPresetsItem {#presets-item}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 分组标题 | `VueNode` | - |
| colors | 颜色列表 | `(string \| Color)[]` | - |
| defaultOpen | 默认是否展开 | `boolean` | `true` |
| key | 分组的 key | `string \| number` | - |

### Color {#color}

事件、`showText`、`v-model:value`（未设置 `valueFormat` 时）得到的颜色对象，与 antdv-next 一致。

| 成员 | 说明 | 类型 |
| --- | --- | --- |
| toHexString | `#rrggbb`，有透明度时为 `#rrggbbaa` | `() => string` |
| toRgbString | `rgb(r,g,b)` 或 `rgba(r,g,b,a)` | `() => string` |
| toHsbString | `hsb(h, s%, b%)` 或 `hsba(h, s%, b%, a)` | `() => string` |
| toCssString | 可直接用于 CSS 的字符串（同 `toRgbString`） | `() => string` |
| toHex | 不带 `#` 的十六进制字符串 | `() => string` |
| toRgb | RGB 对象 | `() => { r, g, b, a }` |
| toHsb | HSB 对象（`s`、`b`、`a` 为 0 - 1） | `() => { h, s, b, a }` |
| equals | 是否为同一颜色 | `(color?: Color \| null) => boolean` |
| cleared | 是否为「无色」 | `boolean` |

颜色字符串支持 3 / 4 / 6 / 8 位十六进制、`rgb()` / `rgba()`、`hsb()` / `hsba()`、`hsl()` / `hsla()`。

## 主题变量 {#design-token}

触发器与弹层的其余变量见 [Picker](/components/picker#design-token)。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-color-picker-block-size` | 触发器色块尺寸 | `calc(var(--am-control-height) - 12px)` |
| `--am-color-picker-block-border-radius` | 色块圆角 | `var(--am-border-radius-sm)` |
| `--am-color-picker-block-border-color` | 色块描边颜色 | `var(--am-color-split)` |
| `--am-color-picker-checkerboard-color` | 透明棋盘格颜色 | `var(--am-color-fill-secondary)` |
| `--am-color-picker-checkerboard-size` | 透明棋盘格尺寸 | `8px` |
| `--am-color-picker-text-color` | 触发器文本颜色 | `var(--am-color-text)` |
| `--am-color-picker-text-font-size` | 触发器文本字号 | `var(--am-font-size)` |
| `--am-color-picker-palette-height` | 饱和度 / 亮度面板高度 | `160px` |
| `--am-color-picker-palette-border-radius` | 面板圆角 | `var(--am-border-radius)` |
| `--am-color-picker-slider-height` | 滑轨高度 | `12px` |
| `--am-color-picker-slider-touch-height` | 滑块触摸区域高度 | `40px` |
| `--am-color-picker-handle-size` | 拖动手柄尺寸 | `24px` |
| `--am-color-picker-handle-border-color` | 拖动手柄描边颜色 | `var(--am-color-white)` |
| `--am-color-picker-swatch-size` | 面板中当前颜色色块尺寸 | `40px` |
| `--am-color-picker-preset-size` | 预设色块尺寸 | `28px` |
| `--am-color-picker-preset-touch-size` | 预设色块触摸区域尺寸 | `40px` |
| `--am-color-picker-gap` | 面板各部分的间距 | `var(--am-margin-sm)` |

## 与 PC 端的差异 {#diff}

- 使用底部弹层代替下拉面板，头部带「取消 / 确定」：拖动、输入、点选预设只改变待定颜色并触发 `select`，点击「确定」后才提交并触发 `change` / `update:value`（与本库其它选择器一致）；`changeComplete` 仍在一次拖动结束时触发，但此时颜色尚未提交。新增 `select`、`confirm`、`cancel` 事件与 `toggle()` 方法。
- `clear` 在清除被提交（点击确定）后触发；内嵌的 `ColorPickerPanel` 没有待定状态，`change`、`clear` 即时触发。
- 不支持渐变模式（`mode: 'gradient'`），值类型不包含渐变数组，`Color` 没有 `isGradient()` / `getColors()`，语言包中的 `singleColor` / `gradientColor` 暂未使用。
- 没有 `trigger`（移动端没有 hover）、`placement`、`arrow`、`autoAdjustOverflow`；弹层容器使用 `getContainer`（与 Popup 一致），不支持 `getPopupContainer`。
- 颜色格式切换使用 Segmented 代替下拉 Select；数值输入框不带步进按钮；清除按钮是带文字的按钮。
- 新增移动端属性：`title`、`okText`、`cancelText`、`maskClosable`、`zIndex`、`defaultOpen`、`id`，以及可嵌入页面的 `ColorPickerPanel`（`ColorPicker.Panel`）。
- 默认插槽为作用域插槽 `{ open, value, label, disabled, toggle }`，需要自行调用 `toggle()` 打开弹层。
- `classes` / `styles` 仅支持对象：ColorPicker 为 `root`、`body`、`content`、`description`、`popup`（`popup` 为弹层主体，不再细分 `popup.root` / `popup.container`）；ColorPickerPanel 为 `root`、`palette`、`slider`、`input`、`presets`。
- 颜色模型为内置实现，输出字符串与 PC 端一致；不支持颜色名（如 `red`），超出范围的 `rgb()` 分量会被截断到 0 - 255。
- RTL 下色板与滑块保持物理方向，不做镜像。

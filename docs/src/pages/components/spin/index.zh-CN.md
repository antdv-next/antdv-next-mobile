---
title: Spin
subtitle: 加载中
description: 用于页面和区块的加载中状态。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

API 与 antdv-next 的 `Spin` 对齐：`spinning`、`size`、`description`、`delay`、`indicator`、`fullscreen`、`percent`，包裹内容时自动添加半透明遮罩。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/size.vue">各种大小</demo>
<demo src="./demo/description.vue">描述文案</demo>
<demo src="./demo/nested.vue">包裹内容</demo>
<demo src="./demo/delay.vue">延迟显示</demo>
<demo src="./demo/fullscreen.vue">全屏</demo>
<demo src="./demo/indicator.vue">自定义指示符</demo>
<demo src="./demo/percent.vue">进度</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| spinning | 是否为加载中状态 | `boolean` | `true` |
| size | 组件大小 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| description | 指示符下方的描述文案，同名插槽优先 | `VueNode` | - |
| delay | 延迟显示加载效果的时间（防止闪烁），单位毫秒 | `number` | `0` |
| indicator | 自定义加载指示符，同名插槽优先 | `VueNode` | - |
| fullscreen | 显示带有遮罩的全屏加载，同时锁定页面滚动 | `boolean` | `false` |
| percent | 展示进度（0 - 100），仅默认指示符生效 | `number` | - |
| tip | 已废弃，请使用 `description` | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'section' \| 'indicator' \| 'description' \| 'container', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'section' \| 'indicator' \| 'description' \| 'container', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 被包裹的内容，加载中时变为半透明且不可点击 |
| indicator | 自定义加载指示符 |
| description | 自定义描述文案 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Spin` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-spin-color` | 指示符颜色 | `var(--am-color-primary)` |
| `--am-spin-size` | 指示符尺寸 | `28px`（small `20px`，large `40px`） |
| `--am-spin-stroke-width` | 圆环线宽（相对 48 的画布） | `4` |
| `--am-spin-description-color` | 描述文案颜色 | `var(--am-color-text-secondary)` |
| `--am-spin-description-font-size` | 描述文案字号 | `var(--am-font-size)` |
| `--am-spin-gap` | 指示符与描述的间距 | `var(--am-margin-xs)` |
| `--am-spin-z-index` | 全屏模式的层级 | `var(--am-z-index-popup-base)` |

## 与 PC 端的差异 {#diff}

- 默认指示符为圆环（移动端更常见的样式），而非 PC 端的四点旋转。
- `description` 在任何模式下都会显示在指示符下方；PC 端仅在包裹内容或全屏时显示。
- `percent` 仅支持数字，不支持 `'auto'`。
- 全屏模式会锁定页面滚动并拦截触摸。
- 不支持 `Spin.setDefaultIndicator` 与已废弃的 `wrapperClassName`。

---
title: Avatar
subtitle: 头像
description: 用来代表用户或事物，支持图片、图标或字符展示。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 在个人中心、评论、会话列表中展示用户或群组。
- 图片加载失败时自动回退为图标或字符，避免出现破图。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/type.vue">三种类型</demo>
<demo src="./demo/size.vue">尺寸</demo>
<demo src="./demo/fallback.vue">加载失败回退</demo>
<demo src="./demo/gap.vue">字符自动缩放</demo>
<demo src="./demo/badge.vue">带徽标的头像</demo>
<demo src="./demo/group.vue">头像组</demo>
<demo src="./demo/list.vue" full>列表中使用</demo>

## API

### Avatar 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址，也可以是自定义的图片节点，同名插槽优先 | `VueNode` | - |
| srcSet | 图片的 `srcset`，用于不同屏幕密度 | `string` | - |
| alt | 图片无法显示时的替代文本 | `string` | - |
| icon | 图标头像，同名插槽优先 | `VueNode` | - |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` |
| size | 头像大小，数字单位为 px | `'small' \| 'middle' \| 'large' \| number` | `'middle'` |
| gap | 字符头像距离左右两侧的最小距离（px），超出时字符自动缩小 | `number` | `4` |
| fit | 图片的 `object-fit`（移动端特有） | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| draggable | 图片是否允许拖动 | `boolean \| 'true' \| 'false'` | - |
| crossOrigin | 图片的 CORS 设置 | `'' \| 'anonymous' \| 'use-credentials'` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root', string>` | - |
| styles | 语义化结构样式 | `Record<'root', CSSProperties>` | - |

展示优先级：可用的图片 `src` > `icon` > 默认插槽中的字符。

### Avatar 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| error | 图片加载失败时触发，随后回退为 `icon` 或字符 | `(event: Event) => void` |

原生 `click` 等事件会透传到根节点，可直接使用 `@click`。

### Avatar 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 字符头像的内容 |
| icon | 自定义图标，优先于 `icon` 属性 |
| src | 自定义图片节点，优先于 `src` 属性 |

### AvatarGroup 属性 {#group-props}

也可以通过 `Avatar.Group` 访问，模板中使用 `<am-avatar-group>`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max | 最多显示的头像个数与折叠头像的样式 | `{ count?: number, style?: CSSProperties }` | - |
| size | 组内所有头像的大小，单个头像的 `size` 优先 | `'small' \| 'middle' \| 'large' \| number` | - |
| shape | 组内所有头像的形状，单个头像的 `shape` 优先 | `'circle' \| 'square'` | - |
| rootClass | 根节点类名 | `string` | - |

### AvatarGroup 插槽 {#group-slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 头像列表 | - |
| overflow | 自定义折叠头像的内容，默认 `+N` | `{ count: number }` |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-avatar-size` | 头像大小 | `40px`（`small` 28px / `large` 56px） |
| `--am-avatar-font-size` | 字符大小 | `18px` |
| `--am-avatar-icon-size` | 图标大小 | `20px` |
| `--am-avatar-border-radius` | 方形头像的圆角 | `var(--am-border-radius)` |
| `--am-avatar-bg` | 背景色 | `var(--am-color-text-placeholder)` |
| `--am-avatar-color` | 文字 / 图标颜色 | `var(--am-color-text-light-solid)` |
| `--am-avatar-group-overlap` | 头像组内相邻头像的重叠距离 | `-8px` |
| `--am-avatar-group-border-color` | 头像组内头像的描边颜色 | `var(--am-color-bg-container)` |

## 与 PC 端的差异 {#diff}

- `error` 是普通事件，无法通过返回 `false` 阻止回退；需要自定义回退内容时请提供 `icon` 或默认插槽。
- `size` 不支持响应式断点对象（`{ xs, sm, ... }`）。
- `AvatarGroup` 的 `max` 不支持 `popover`，折叠的头像不会在气泡中展开；可通过 `overflow` 插槽自定义折叠头像并自行处理点击。
- 新增 `fit` 属性控制图片填充方式。
- 默认尺寸更大：`middle` 40px、`small` 28px、`large` 56px。

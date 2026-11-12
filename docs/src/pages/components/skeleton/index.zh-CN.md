---
title: Skeleton
subtitle: 骨架屏
description: 在需要等待加载内容的位置提供一个占位图形组合。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 网络较慢，需要长时间等待加载处理的情况下。
- 图文信息内容较多的列表 / 卡片中。
- 只在第一次加载数据的时候使用。
- 可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。

API 与 antdv-next 的 `Skeleton` 对齐：`loading` 为 `false` 时渲染默认插槽，`avatar` / `title` / `paragraph` 既可以是布尔值也可以是配置对象。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/complex.vue">复杂的组合</demo>
<demo src="./demo/active.vue">动画效果</demo>
<demo src="./demo/children.vue">包含子组件</demo>
<demo src="./demo/list.vue" full>列表</demo>
<demo src="./demo/element.vue">按钮 / 头像 / 输入框 / 图像</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### Skeleton 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否展示动画效果 | `boolean` | `false` |
| loading | 为 `true` 时显示占位图，为 `false` 时显示默认插槽 | `boolean` | - |
| avatar | 是否显示头像占位图 | `boolean \| SkeletonAvatarConfig` | `false` |
| title | 是否显示标题占位图 | `boolean \| SkeletonTitleConfig` | `true` |
| paragraph | 是否显示段落占位图 | `boolean \| SkeletonParagraphConfig` | `true` |
| round | 为 `true` 时，段落和标题显示圆角 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'section' \| 'avatar' \| 'title' \| 'paragraph', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'section' \| 'avatar' \| 'title' \| 'paragraph', CSSProperties>` | - |

#### SkeletonAvatarConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 头像占位图的大小 | `'small' \| 'middle' \| 'large' \| number` | `'large'` |
| shape | 头像占位图的形状 | `'circle' \| 'square'` | `'circle'`（只有标题时为 `'square'`） |

#### SkeletonTitleConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 标题占位图的宽度 | `number \| string` | - |

#### SkeletonParagraphConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 段落占位图的行数 | `number` | `3`（带头像时为 `2`） |
| width | 段落占位图的宽度，数组时对应每行宽度，否则为最后一行的宽度 | `number \| string \| Array<number \| string>` | - |

### Skeleton.Button 属性 {#button-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否展示动画效果 | `boolean` | `false` |
| block | 宽度撑满父元素 | `boolean` | `false` |
| shape | 按钮形状 | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` |
| size | 按钮大小 | `'small' \| 'middle' \| 'large'` | `'middle'` |

### Skeleton.Avatar 属性 {#avatar-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否展示动画效果 | `boolean` | `false` |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` |
| size | 头像大小 | `'small' \| 'middle' \| 'large' \| number` | `'middle'` |

### Skeleton.Input 属性 {#input-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否展示动画效果 | `boolean` | `false` |
| block | 宽度撑满父元素 | `boolean` | `false` |
| size | 输入框大小 | `'small' \| 'middle' \| 'large'` | `'middle'` |

### Skeleton.Image 属性 {#image-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 是否展示动画效果 | `boolean` | `false` |
| size | 图像占位图尺寸，数组为 `[宽, 高]` | `number \| string \| [number \| string, number \| string]` | `96` |

四个元素组件同样支持 `rootClass`、`classes` 与 `styles`（语义化结构：`root`、`content`）。

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | `loading` 为 `false` 时显示的真实内容 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Skeleton` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-skeleton-color` | 占位块颜色 | `var(--am-color-fill-secondary)` |
| `--am-skeleton-color-highlight` | 动画高亮颜色 | `var(--am-color-fill)` |
| `--am-skeleton-title-height` | 标题高度 | `16px` |
| `--am-skeleton-paragraph-height` | 段落行高度 | `16px` |
| `--am-skeleton-paragraph-gap` | 段落行间距 | `12px` |
| `--am-skeleton-border-radius` | 占位块圆角 | `var(--am-border-radius-sm)` |
| `--am-skeleton-avatar-size` | 头像尺寸 | `var(--am-control-height)` |
| `--am-skeleton-duration` | 动画时长 | `1.4s` |

## 与 PC 端的差异 {#diff}

- 不提供 `Skeleton.Node`，需要自定义形状时直接覆盖 `Skeleton.Image` / `Skeleton.Button` 的尺寸即可。
- `Skeleton.Image` 新增 `size` 属性，便于适配移动端不同比例的图片。
- 尺寸使用移动端的 `'small' \| 'middle' \| 'large'`，不支持 PC 端已废弃的 `'default'`。

---
title: Upload
subtitle: 上传
description: 文件选择上传控件，默认以图片宫格的形式展示。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

上传是将信息（图片、视频或文件）通过网页发布到远程服务器上的过程。

- 当需要上传一张或多张图片（头像、凭证、评价晒图）时。
- 当需要展现上传的进度、失败后重试时。
- 当需要直接调起相机拍照上传时（`capture`）。

API 与 Antdv Next 的 `Upload` 对齐：`fileList`（`v-model:fileList`）、`action`、`customRequest`、`beforeUpload`、`maxCount`、`listType`、`showUploadList`、`Upload.LIST_IGNORE` 等语义一致。移动端默认使用图片宫格（`picture-card`）：方形缩略图、角标删除、上传中遮罩、失败后点击重试、点击图片全屏预览。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/request.vue">上传进度与失败重试</demo>
<demo src="./demo/status.vue">文件状态</demo>
<demo src="./demo/limit.vue">限制数量与大小</demo>
<demo src="./demo/before-upload.vue">上传前校验</demo>
<demo src="./demo/before-remove.vue">删除前确认</demo>
<demo src="./demo/custom.vue">自定义触发区域与列数</demo>
<demo src="./demo/text.vue">文件列表</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fileList | 文件列表（受控），支持 `v-model:fileList` | [UploadFile](#uploadfile)`[]` | - |
| defaultFileList | 默认的文件列表（非受控） | [UploadFile](#uploadfile)`[]` | - |
| accept | 接受上传的文件类型，同原生 `accept` | `string` | - |
| multiple | 是否支持多选文件 | `boolean` | `false` |
| maxCount | 限制上传数量，达到后隐藏上传按钮；为 `1` 时新文件会替换当前文件 | `number` | - |
| maxSize | 单个文件的大小上限（字节），超出的文件不会加入列表并触发 `exceed` | `number` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| action | 上传的地址。未设置 `action` 与 `customRequest` 时只收集文件（状态为 `done`），不发起请求 | `string \| ((file: UploadRawFile) => string \| Promise<string>)` | - |
| method | 上传请求的 http method | `string` | `'post'` |
| headers | 上传的请求头部 | `Record<string, string>` | - |
| data | 上传所需额外参数或返回上传额外参数的方法 | `object \| ((file: UploadFile) => object \| Promise<object>)` | - |
| name | 发到后台的文件参数名 | `string` | `'file'` |
| withCredentials | 上传请求时是否携带 cookie | `boolean` | `false` |
| customRequest | 通过覆盖默认的上传行为，自定义自己的上传实现 | `(options: `[RequestOptions](#request-options)`, info: { defaultRequest }) => void \| { abort: () => void }` | - |
| beforeUpload | 上传文件之前的钩子。返回 `false`（或 Promise reject）时文件加入列表但不上传；返回 `Upload.LIST_IGNORE` 时不加入列表；resolve `File` / `Blob` 时上传该对象 | `(file: UploadRawFile, fileList: UploadRawFile[]) => boolean \| string \| Blob \| void \| Promise<...>` | - |
| beforeRemove | 删除文件之前的钩子，返回 `false`（或 Promise resolve `false` / reject）时不删除 | `(file: UploadFile) => boolean \| void \| Promise<boolean \| void>` | - |
| listType | 列表的展示方式 | `'picture-card' \| 'text'` | `'picture-card'` |
| showUploadList | 是否展示文件列表，可设为对象单独控制 `showPreviewIcon`（点击预览）与 `showRemoveIcon`（删除角标） | `boolean \| { showPreviewIcon?: boolean, showRemoveIcon?: boolean }` | `true` |
| capture | 直接调起相机，同原生 `capture` | `boolean \| 'user' \| 'environment'` | - |
| previewFile | 自定义缩略图的生成逻辑 | `(file: File \| Blob) => Promise<string>` | - |
| isImageUrl | 自定义文件是否以图片缩略图展示 | `(file: UploadFile) => boolean` | - |
| iconRender | 自定义非图片文件的图标，同名插槽优先 | `(file: UploadFile, listType?: UploadListType) => VueNode` | - |
| columns | `picture-card` 宫格的列数 | `number` | `4` |
| preview | 点击已上传的图片时是否打开内置的图片预览 | `boolean` | `true` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'list' \| 'item' \| 'trigger', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'list' \| 'item' \| 'trigger', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 文件状态改变时触发：加入列表、上传进度、成功、失败、删除 | `(info: { file: UploadFile, fileList: UploadFile[], event?: { percent: number } }) => void` |
| preview | 点击文件时触发 | `(file: UploadFile) => void` |
| remove | 文件被删除后触发 | `(file: UploadFile) => void` |
| exceed | 选择的文件因 `maxCount` / `maxSize` 被忽略时触发 | `(files: File[], reason: 'maxCount' \| 'maxSize') => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义上传按钮的内容 | - |
| itemRender | 自定义列表项 | `{ file: UploadFile, index: number, fileList: UploadFile[], actions: { preview, remove, retry } }` |
| iconRender | 自定义非图片文件的图标 | `{ file: UploadFile, listType: UploadListType }` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| chooseFile | 打开文件选择 | `() => void` |
| upload | 重新上传列表中的某个文件 | `(file: UploadFile) => void` |
| abort | 中断某个文件（或全部文件）的上传请求 | `(file?: UploadFile) => void` |

### UploadFile {#uploadfile}

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| uid | 唯一标识符 | `string` |
| name | 文件名 | `string` |
| status | 上传状态，被 `beforeUpload` 拦截的文件没有 `status` | `'uploading' \| 'done' \| 'error' \| 'removed'` |
| percent | 上传进度 | `number` |
| url | 文件地址，用于缩略图与预览 | `string` |
| thumbUrl | 缩略图地址 | `string` |
| originFileObj | 原始的 `File` 对象 | `UploadRawFile` |
| response | 服务端响应内容 | `any` |
| error | 上传失败的错误信息 | `any` |
| size / type / lastModified | 同 `File` 的对应属性 | - |

### RequestOptions {#request-options}

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| action | 上传的地址 | `string` |
| filename | 文件参数名 | `string` |
| file | 要上传的文件 | `UploadRawFile \| Blob` |
| data | 额外参数 | `Record<string, unknown>` |
| headers | 请求头部 | `Record<string, string>` |
| withCredentials | 是否携带 cookie | `boolean` |
| method | http method | `string` |
| onProgress | 上传进度回调 | `(event: { percent: number }) => void` |
| onSuccess | 上传成功回调 | `(body: any, xhr?: XMLHttpRequest) => void` |
| onError | 上传失败回调 | `(error: Error, body?: any) => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Upload` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-upload-columns` | 宫格列数（由 `columns` 属性设置） | `4` |
| `--am-upload-gap` | 宫格间距 | `var(--am-margin-xs)` |
| `--am-upload-item-bg` | 列表项与上传按钮的背景色 | `var(--am-color-fill-tertiary)` |
| `--am-upload-item-border-radius` | 列表项圆角 | `var(--am-border-radius)` |
| `--am-upload-trigger-color` | 上传按钮图标颜色 | `var(--am-color-text-quaternary)` |
| `--am-upload-trigger-icon-size` | 上传按钮图标大小 | `28px` |
| `--am-upload-mask-bg` | 上传中 / 失败遮罩背景色 | `var(--am-color-bg-mask)` |
| `--am-upload-mask-color` | 遮罩文字颜色 | `var(--am-color-white)` |
| `--am-upload-remove-size` | 删除角标大小 | `18px` |
| `--am-upload-remove-bg` | 删除角标背景色 | `var(--am-color-bg-mask)` |
| `--am-upload-remove-color` | 删除角标图标颜色 | `var(--am-color-white)` |

## 与 PC 端的差异 {#diff}

- `listType` 默认为 `picture-card`（PC 为 `text`），只支持 `picture-card` 与 `text`；宫格通过 `columns` 设置列数。
- 删除拦截使用 `beforeRemove` 属性（PC 为 `onRemove` 的返回值），`remove` 事件仅在删除后通知；`preview` 为事件。
- 未设置 `action` 与 `customRequest` 时不发起请求，文件直接以 `done` 状态加入列表，便于随表单一起提交。
- 达到 `maxCount` 后隐藏上传按钮；新增 `maxSize` 属性与 `exceed` 事件。
- 上传失败的文件点击即可重试；点击已上传的图片会打开内置的 [ImagePreview](/components/image-preview)（`preview` 属性可关闭）。
- `itemRender` 仅提供插槽，参数为 `{ file, index, fileList, actions }`（没有 `originNode`）。
- 新增 `capture`（PC 同名）、`chooseFile` / `upload` / `abort` 方法。
- 不支持拖拽上传（`Upload.Dragger`）、`directory`、`pastable`、`openFileDialogOnClick`、`progress`、`picture` / `picture-circle` 列表、下载相关配置以及对象形式的 `accept`。

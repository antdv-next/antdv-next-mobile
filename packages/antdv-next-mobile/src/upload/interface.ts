import type { CSSProperties, VNodeChild } from 'vue'

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed'
export type UploadListType = 'picture-card' | 'text'

/** The native `File` picked by the user, tagged with the `uid` of its list entry (PC: `VcFile`). */
export interface UploadRawFile extends File {
  uid: string
}

export interface UploadFile<T = any> {
  uid: string
  name: string
  size?: number
  type?: string
  lastModified?: number
  /** Address of the uploaded file, used for the thumbnail and the preview */
  url?: string
  thumbUrl?: string
  /** Absent for files that were intercepted by `beforeUpload` */
  status?: UploadFileStatus
  percent?: number
  originFileObj?: UploadRawFile
  response?: T
  error?: any
  xhr?: any
}

export interface UploadChangeParam<T = UploadFile> {
  file: T
  fileList: T[]
  event?: { percent: number }
}

export interface UploadProgressEvent {
  percent: number
}

export interface UploadRequestError extends Error {
  status?: number
  method?: string
  url?: string
}

export interface UploadRequestOption {
  action: string
  filename: string
  data: Record<string, unknown>
  file: UploadRawFile | Blob
  headers: Record<string, string>
  withCredentials: boolean
  method: string
  onProgress: (event: UploadProgressEvent) => void
  onError: (error: Error, body?: any) => void
  onSuccess: (body: any, xhr?: XMLHttpRequest) => void
}

export interface UploadRequestHandler {
  abort: () => void
}

export type UploadRequestResult = void | UploadRequestHandler

export type UploadCustomRequest = (
  options: UploadRequestOption,
  info: { defaultRequest: (options: UploadRequestOption) => UploadRequestHandler },
) => UploadRequestResult

export type UploadBeforeUploadResult = void | boolean | string | Blob | File

export interface UploadShowUploadList {
  /** Tap a finished image to preview it */
  showPreviewIcon?: boolean
  /** Show the delete badge */
  showRemoveIcon?: boolean
}

export interface UploadItemActions {
  preview: () => void
  remove: () => void
  /** upload again (failed files) */
  retry: () => void
}

export type UploadExceedReason = 'maxCount' | 'maxSize'

export interface UploadSemanticClassNames {
  root?: string
  list?: string
  item?: string
  trigger?: string
}

export interface UploadSemanticStyles {
  root?: CSSProperties
  list?: CSSProperties
  item?: CSSProperties
  trigger?: CSSProperties
}

export interface UploadProps {
  /** Controlled file list. Supports `v-model:fileList`. */
  fileList?: UploadFile[]
  defaultFileList?: UploadFile[]
  accept?: string
  multiple?: boolean
  /** Max number of files. The trigger is hidden once reached; `1` replaces the current file. */
  maxCount?: number
  /** Max size of one file in bytes, larger files are skipped and reported by `exceed` */
  maxSize?: number
  disabled?: boolean
  /** Upload URL. Without `action` and `customRequest` picked files are only collected (status `done`). */
  action?: string | ((file: UploadRawFile) => string | PromiseLike<string>)
  method?: string
  headers?: Record<string, string>
  data?: Record<string, unknown> | ((file: UploadFile) => Record<string, unknown> | Promise<Record<string, unknown>>)
  /** Name of the file field */
  name?: string
  withCredentials?: boolean
  customRequest?: UploadCustomRequest
  /**
   * Hook before uploading. Return `false` (or reject) to keep the file in the list without uploading,
   * `Upload.LIST_IGNORE` to drop it, or a `File` / `Blob` to upload that instead.
   */
  beforeUpload?: (file: UploadRawFile, fileList: UploadRawFile[]) => UploadBeforeUploadResult | Promise<UploadBeforeUploadResult>
  /** Guard before removing. Return `false` (or resolve `false` / reject) to keep the file. */
  beforeRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>
  listType?: UploadListType
  showUploadList?: boolean | UploadShowUploadList
  /** `capture` of the native input: `'user'`, `'environment'` or `true` */
  capture?: boolean | 'user' | 'environment'
  /** Custom thumbnail generation, resolves the thumbnail URL */
  previewFile?: (file: File | Blob) => PromiseLike<string>
  /** Whether the file is displayed as an image */
  isImageUrl?: (file: UploadFile) => boolean
  /** Icon of non-image files. The same-named slot wins. */
  iconRender?: (file: UploadFile, listType?: UploadListType) => VNodeChild
  /** Number of columns of the `picture-card` grid */
  columns?: number
  /** Open the built-in image preview when a finished image is tapped */
  preview?: boolean
  rootClass?: string
  classes?: UploadSemanticClassNames
  styles?: UploadSemanticStyles
}

export interface UploadEmits {
  'update:fileList': [fileList: UploadFile[]]
  /** Every state change: added, progress, done, error, removed */
  'change': [info: UploadChangeParam]
  'preview': [file: UploadFile]
  'remove': [file: UploadFile]
  /** Picked files that were skipped because of `maxCount` / `maxSize` */
  'exceed': [files: File[], reason: UploadExceedReason]
}

export interface UploadSlots {
  /** content of the upload trigger */
  default?: () => any
  itemRender?: (props: { file: UploadFile, index: number, fileList: UploadFile[], actions: UploadItemActions }) => any
  iconRender?: (props: { file: UploadFile, listType: UploadListType }) => any
}

export interface UploadRef {
  /** open the native file picker */
  chooseFile: () => void
  /** upload (again) a file of the list */
  upload: (file: UploadFile) => void
  /** abort the request of one file, or of every uploading file */
  abort: (file?: UploadFile) => void
}

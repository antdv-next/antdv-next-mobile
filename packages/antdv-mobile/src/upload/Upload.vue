<script setup lang="ts">
import type {
  UploadEmits,
  UploadFile,
  UploadItemActions,
  UploadProps,
  UploadRawFile,
  UploadRequestHandler,
  UploadRequestOption,
  UploadSlots,
} from './interface'
import { CloseOutlined, ExclamationCircleOutlined, FileOutlined, PaperClipOutlined, PlusOutlined, UploadOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Spinner } from '../_base'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import ImagePreview from '../image-preview/ImagePreview.vue'
import { useLocale } from '../locale'
import { defaultRequest } from './request'
import { isImageUrl as defaultIsImageUrl, genUid, LIST_IGNORE } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmUpload', inheritAttrs: false })

const props = withDefaults(defineProps<UploadProps>(), {
  fileList: undefined,
  multiple: false,
  disabled: undefined,
  method: 'post',
  name: 'file',
  withCredentials: false,
  listType: 'picture-card',
  showUploadList: true,
  capture: undefined,
  columns: 4,
  preview: true,
})
const emit = defineEmits<UploadEmits>()
defineSlots<UploadSlots>()

const locale = useLocale('Upload')
const disabled = useDisabled(() => props.disabled)
const formItem = useFormItemInputContext()

const inputRef = ref<HTMLInputElement>()

// ---------- file list (controlled / uncontrolled) ----------
// Kept locally (instead of `useControlled`) because async upload callbacks must always
// read the latest list synchronously, even before the parent applied `update:fileList`.
const list = ref<UploadFile[]>(props.fileList ?? props.defaultFileList ?? [])
let disposed = false

function commit(next: UploadFile[], files: UploadFile[], event?: { percent: number }) {
  list.value = next
  emit('update:fileList', next)
  files.forEach(file => emit('change', { file, fileList: next, event }))
  formItem.onFieldChange()
}

const findFile = (uid: string) => list.value.find(item => item.uid === uid)

/** Replaces a file of the list. Files that are no longer in the list are ignored (same as PC). */
function updateFile(file: UploadFile, event?: { percent: number }) {
  const index = list.value.findIndex(item => item.uid === file.uid)
  if (index === -1)
    return false
  const next = list.value.slice()
  next[index] = file
  commit(next, [file], event)
  return true
}

// ---------- thumbnails ----------
const objectUrls = new Map<string, string>()

function revokeThumb(uid: string) {
  const url = objectUrls.get(uid)
  if (url) {
    URL.revokeObjectURL(url)
    objectUrls.delete(uid)
  }
}

function createThumb(raw: UploadRawFile): string | undefined {
  if (props.previewFile || !raw.type?.startsWith('image/'))
    return undefined
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function')
    return undefined
  const url = URL.createObjectURL(raw)
  objectUrls.set(raw.uid, url)
  return url
}

function resolvePreviewFile(raw: UploadRawFile) {
  if (!props.previewFile)
    return
  Promise.resolve(props.previewFile(raw)).then(
    (thumbUrl) => {
      const current = findFile(raw.uid)
      if (!disposed && current && thumbUrl)
        updateFile({ ...current, thumbUrl })
    },
    () => {},
  )
}

const isImage = (file: UploadFile) => (props.isImageUrl ? props.isImageUrl(file) : defaultIsImageUrl(file))
const getThumb = (file: UploadFile) => (isImage(file) ? file.thumbUrl || file.url : undefined)

// ---------- request ----------
interface UploadTask {
  cancelled: boolean
  request?: UploadRequestHandler
}
const requests = new Map<string, UploadTask>()
const bodies = new Map<string, Blob>()
const preparing = new Set<string>()

function cancelRequest(uid: string) {
  const task = requests.get(uid)
  if (!task)
    return
  requests.delete(uid)
  task.cancelled = true
  task.request?.abort()
}

function releaseFile(uid: string) {
  cancelRequest(uid)
  bodies.delete(uid)
  revokeThumb(uid)
}

watch(() => props.fileList?.map(file => file.uid), (uids) => {
  if (!uids || !props.fileList)
    return
  const retained = new Set(uids)
  for (const uid of new Set([...requests.keys(), ...bodies.keys(), ...objectUrls.keys()])) {
    if (!retained.has(uid))
      releaseFile(uid)
  }
  list.value = props.fileList
})

function abort(file?: UploadFile) {
  if (file)
    preparing.delete(file.uid)
  else
    preparing.clear()
  for (const uid of file ? [file.uid] : [...requests.keys()]) {
    cancelRequest(uid)
    const current = findFile(uid)
    if (current?.status === 'uploading')
      updateFile({ ...current, status: undefined, percent: undefined })
  }
}

async function startUpload(uid: string) {
  const file = findFile(uid)
  const raw = file?.originFileObj
  if (disposed || !file || !raw || file.status !== 'uploading')
    return
  const task: UploadTask = { cancelled: false }
  requests.set(uid, task)
  const activeFile = () => {
    const current = findFile(uid)
    return requests.get(uid) === task && current?.status === 'uploading' ? current : undefined
  }
  const fail = (error: any, response?: any) => {
    const current = activeFile()
    if (current) {
      requests.delete(uid)
      updateFile({ ...current, status: 'error', error, response })
    }
  }

  let action: string
  let data: Record<string, unknown>
  try {
    action = typeof props.action === 'function' ? await props.action(raw) : props.action ?? ''
    if (!activeFile())
      return
    data = typeof props.data === 'function' ? await props.data(file) : props.data ?? {}
  }
  catch (error) {
    fail(error)
    return
  }
  // removed (or restarted) while the action / data were resolved
  if (!activeFile())
    return

  const options: UploadRequestOption = {
    action,
    data,
    filename: props.name,
    file: bodies.get(uid) ?? raw,
    headers: props.headers ?? {},
    withCredentials: props.withCredentials,
    method: props.method,
    onProgress: (event) => {
      const current = activeFile()
      if (current) {
        const percent = Math.min(Math.max(event.percent, 0), 100)
        updateFile({ ...current, percent }, { percent })
      }
    },
    onSuccess: (response, xhr) => {
      const current = activeFile()
      if (current) {
        requests.delete(uid)
        updateFile({ ...current, status: 'done', percent: 100, response, xhr })
      }
    },
    onError: fail,
  }

  try {
    const request = props.customRequest ? props.customRequest(options, { defaultRequest }) : defaultRequest(options)
    if (request && typeof request.abort === 'function') {
      task.request = request
      if (task.cancelled)
        request.abort()
    }
  }
  catch (error) {
    fail(error)
  }
}

/** Uploads (again) a file that is already in the list. */
function upload(file: UploadFile) {
  const current = findFile(file.uid)
  if (!current?.originFileObj || current.status === 'uploading')
    return
  cancelRequest(current.uid)
  updateFile({ ...current, status: 'uploading', percent: 0, error: undefined, response: undefined })
  startUpload(current.uid)
}

const hasRequest = computed(() => props.action !== undefined || !!props.customRequest)
let selection = 0
let lastReplacement = 0

async function addFiles(picked: File[]) {
  if (disposed || disabled.value || !picked.length)
    return
  let files = picked

  if (props.maxSize !== undefined) {
    const oversize = files.filter(file => file.size > props.maxSize!)
    if (oversize.length) {
      emit('exceed', oversize, 'maxSize')
      files = files.filter(file => file.size <= props.maxSize!)
    }
  }
  if (props.maxCount !== undefined) {
    const remain = props.maxCount === 1 ? 1 : Math.max(props.maxCount - list.value.length - preparing.size, 0)
    if (files.length > remain) {
      emit('exceed', files.slice(remain), 'maxCount')
      files = files.slice(0, remain)
    }
  }
  if (!files.length)
    return
  const batch = ++selection

  const raws = files.map((file) => {
    const raw = file as UploadRawFile
    raw.uid = genUid()
    preparing.add(raw.uid)
    return raw
  })

  // `false`: keep in the list without uploading, `null`: ignored, Blob: the content to upload
  const parsed = await Promise.all(
    raws.map(async (raw): Promise<Blob | false | null> => {
      if (!props.beforeUpload)
        return raw
      try {
        const result = await props.beforeUpload(raw, raws)
        if (result === false)
          return false
        if (result === LIST_IGNORE)
          return null
        if (typeof result === 'object' && result)
          return result
        return raw
      }
      catch {
        return false
      }
    }),
  )

  let accepted = raws.map((raw, index) => ({ raw, body: parsed[index] }))
    .filter(({ raw, body }) => preparing.delete(raw.uid) && body !== null)
  if (disposed || (props.maxCount === 1 && batch < lastReplacement))
    return
  // The parent can replace the controlled list or reduce maxCount during preprocessing.
  const available = props.maxCount === 1 ? 1 : Math.max((props.maxCount ?? Infinity) - list.value.length, 0)
  if (accepted.length > available) {
    emit('exceed', accepted.slice(available).map(({ raw }) => raw), 'maxCount')
    accepted = accepted.slice(0, available)
  }
  const added: UploadFile[] = []
  for (const { raw, body } of accepted) {
    if (body && body !== raw)
      bodies.set(raw.uid, body)
    const willUpload = body !== false && hasRequest.value
    added.push({
      uid: raw.uid,
      name: raw.name,
      size: raw.size,
      type: raw.type,
      lastModified: raw.lastModified,
      originFileObj: raw,
      thumbUrl: createThumb(raw),
      percent: willUpload ? 0 : undefined,
      // without a request target the file is simply collected
      status: willUpload ? 'uploading' : body !== false ? 'done' : undefined,
    })
  }
  if (!added.length)
    return

  let next: UploadFile[]
  if (props.maxCount === 1) {
    lastReplacement = batch
    list.value.forEach(file => releaseFile(file.uid))
    next = added
  }
  else {
    next = [...list.value, ...added]
  }
  commit(next, added)

  added.forEach(file => file.originFileObj && resolvePreviewFile(file.originFileObj))
  added.forEach(file => file.status === 'uploading' && startUpload(file.uid))
}

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  // allow picking the same file again
  input.value = ''
  addFiles(files)
}

function chooseFile() {
  if (!disabled.value)
    inputRef.value?.click()
}

// ---------- item actions ----------
async function removeFile(file: UploadFile) {
  if (disabled.value)
    return
  if (props.beforeRemove) {
    try {
      if ((await props.beforeRemove(file)) === false)
        return
    }
    catch {
      return
    }
  }
  const current = findFile(file.uid)
  if (disposed || !current)
    return
  releaseFile(current.uid)
  const removed: UploadFile = { ...current, status: 'removed' }
  commit(list.value.filter(item => item.uid !== current.uid), [removed])
  emit('remove', removed)
}

const listConfig = computed(() => (typeof props.showUploadList === 'object' && props.showUploadList ? props.showUploadList : {}))
const previewOpen = ref(false)
const previewCurrent = ref(0)
const previewImages = computed(() =>
  list.value
    .filter(file => file.status !== 'uploading' && file.status !== 'error' && getThumb(file))
    .map(file => ({ src: (file.url || file.thumbUrl)!, alt: file.name, uid: file.uid })),
)

function previewItem(file: UploadFile) {
  emit('preview', file)
  if (!props.preview || listConfig.value.showPreviewIcon === false)
    return
  const index = previewImages.value.findIndex(item => item.uid === file.uid)
  if (index >= 0) {
    previewCurrent.value = index
    previewOpen.value = true
  }
}

function onItemClick(file: UploadFile) {
  if (file.status === 'uploading')
    return
  if (file.status === 'error') {
    if (!disabled.value)
      upload(file)
    return
  }
  previewItem(file)
}

function getActions(file: UploadFile): UploadItemActions {
  return {
    preview: () => previewItem(file),
    remove: () => removeFile(file),
    retry: () => upload(file),
  }
}

onBeforeUnmount(() => {
  disposed = true
  preparing.clear()
  requests.forEach((_, uid) => cancelRequest(uid))
  bodies.clear()
  objectUrls.forEach(url => URL.revokeObjectURL(url))
  objectUrls.clear()
})

// ---------- render ----------
const showList = computed(() => props.showUploadList !== false)
const showRemove = computed(() => !disabled.value && listConfig.value.showRemoveIcon !== false)
const showTrigger = computed(() => props.maxCount === undefined || list.value.length < props.maxCount)

/** `capture` is a plain attribute: `true` renders as `capture=""` (let the device choose the camera) */
const captureAttr = computed<any>(() => (props.capture === true ? '' : props.capture || undefined))

const classNames = computed(() => [
  'am-upload',
  `am-upload-${props.listType}`,
  { 'am-upload-disabled': disabled.value },
  props.rootClass,
  props.classes?.root,
])

defineExpose({ chooseFile, upload, abort })
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="[{ '--am-upload-columns': columns }, styles?.root]">
    <input
      ref="inputRef"
      class="am-upload-input"
      type="file"
      tabindex="-1"
      :accept="accept"
      :multiple="multiple"
      :capture="captureAttr"
      :disabled="disabled"
      @change="onInputChange"
      @click.stop
    >
    <div class="am-upload-list" :class="classes?.list" :style="styles?.list">
      <template v-if="showList">
        <template v-for="(file, index) in list" :key="file.uid">
          <slot name="itemRender" :file="file" :index="index" :file-list="list" :actions="getActions(file)">
            <div
              class="am-upload-item"
              :class="[file.status ? `am-upload-item-${file.status}` : undefined, classes?.item]"
              :style="styles?.item"
              @click="onItemClick(file)"
            >
              <template v-if="listType === 'picture-card'">
                <img v-if="getThumb(file)" class="am-upload-item-image" :src="getThumb(file)" :alt="file.name" draggable="false">
                <div v-else class="am-upload-item-file">
                  <span class="am-upload-item-icon">
                    <slot name="iconRender" :file="file" :list-type="listType">
                      <RenderNode v-if="iconRender" :node="iconRender(file, listType)" />
                      <FileOutlined v-else />
                    </slot>
                  </span>
                  <span class="am-upload-item-name">{{ file.name }}</span>
                </div>
                <div v-if="file.status === 'uploading'" class="am-upload-item-mask" role="progressbar" :aria-valuenow="Math.round(file.percent ?? 0)">
                  <Spinner class="am-upload-item-mask-icon" />
                  <span class="am-upload-item-mask-text">{{ file.percent ? `${Math.round(file.percent)}%` : locale.uploading }}</span>
                </div>
                <div v-else-if="file.status === 'error'" class="am-upload-item-mask am-upload-item-mask-error">
                  <ExclamationCircleOutlined class="am-upload-item-mask-icon" />
                  <span class="am-upload-item-mask-text">{{ locale.uploadError }}</span>
                </div>
              </template>
              <template v-else>
                <span class="am-upload-item-icon">
                  <Spinner v-if="file.status === 'uploading'" />
                  <slot v-else name="iconRender" :file="file" :list-type="listType">
                    <RenderNode v-if="iconRender" :node="iconRender(file, listType)" />
                    <PaperClipOutlined v-else />
                  </slot>
                </span>
                <span class="am-upload-item-name">{{ file.name }}</span>
                <span v-if="file.status === 'uploading'" class="am-upload-item-extra">{{ file.percent ? `${Math.round(file.percent)}%` : locale.uploading }}</span>
                <span v-else-if="file.status === 'error'" class="am-upload-item-extra">{{ locale.uploadError }}</span>
              </template>
              <button
                v-if="showRemove"
                type="button"
                class="am-upload-item-remove"
                :aria-label="locale.removeFile"
                @click.stop="removeFile(file)"
              >
                <CloseOutlined />
              </button>
            </div>
          </slot>
        </template>
      </template>
      <div
        v-if="showTrigger"
        class="am-upload-trigger"
        :class="[{ 'am-upload-trigger-custom': !!$slots.default }, classes?.trigger]"
        :style="styles?.trigger"
        :role="listType === 'picture-card' || $slots.default ? 'button' : undefined"
        :aria-label="locale.upload"
        :aria-disabled="disabled || undefined"
        @click="chooseFile"
      >
        <slot>
          <PlusOutlined v-if="listType === 'picture-card'" class="am-upload-trigger-icon" />
          <Button v-else :disabled="disabled">
            <template #icon>
              <UploadOutlined />
            </template>
            {{ locale.upload }}
          </Button>
        </slot>
      </div>
    </div>
    <ImagePreview
      v-if="preview"
      v-model:open="previewOpen"
      v-model:current="previewCurrent"
      :images="previewImages"
    />
  </div>
</template>

import type { UploadFile } from './interface'

/** `beforeUpload` return value that drops the file from the list. */
export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`

let seed = 0
export function genUid() {
  seed += 1
  return `am-upload-${Date.now()}-${seed}`
}

const imageExtReg = /\.(?:webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico|heic|heif|avif)$/i

export function isImageUrl(file: UploadFile): boolean {
  if (file.type && !file.thumbUrl)
    return file.type.startsWith('image/')
  const url = file.thumbUrl || file.url || ''
  if (!url)
    return false
  if (/^data:image\//.test(url) || url.startsWith('blob:'))
    return true
  if (url.startsWith('data:'))
    return false
  const path = url.split(/[?#]/)[0]
  const ext = path.match(/\.[^./\\]*$/)?.[0] ?? ''
  // an url without extension is most likely an image served by an API
  return ext ? imageExtReg.test(ext) : true
}

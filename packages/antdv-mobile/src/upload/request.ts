import type { UploadRequestError, UploadRequestHandler, UploadRequestOption } from './interface'

function getError(option: UploadRequestOption, xhr: XMLHttpRequest) {
  const error = new Error(`cannot ${option.method} ${option.action} ${xhr.status}`) as UploadRequestError
  error.status = xhr.status
  error.method = option.method
  error.url = option.action
  return error
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response
  if (!text)
    return text
  try {
    return JSON.parse(text)
  }
  catch {
    return text
  }
}

/** Default XHR upload (multipart/form-data) with progress, same contract as `customRequest`. */
export function defaultRequest(option: UploadRequestOption): UploadRequestHandler {
  const xhr = new XMLHttpRequest()

  if (xhr.upload) {
    xhr.upload.onprogress = (event) => {
      if (event.total > 0)
        option.onProgress({ percent: (event.loaded / event.total) * 100 })
    }
  }

  const formData = new FormData()
  Object.keys(option.data ?? {}).forEach((key) => {
    const value = option.data[key]
    if (Array.isArray(value))
      value.forEach(item => formData.append(`${key}[]`, item as any))
    else if (value !== undefined && value !== null)
      formData.append(key, value as any)
  })
  const { file } = option
  if (typeof File !== 'undefined' && file instanceof File)
    formData.append(option.filename, file, file.name)
  else
    formData.append(option.filename, file)

  xhr.onerror = () => option.onError(getError(option, xhr), getBody(xhr))
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300)
      option.onError(getError(option, xhr), getBody(xhr))
    else
      option.onSuccess(getBody(xhr), xhr)
  }

  xhr.open(option.method, option.action, true)
  if (option.withCredentials && 'withCredentials' in xhr)
    xhr.withCredentials = true

  const headers = option.headers ?? {}
  if (headers['X-Requested-With'] !== null)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  Object.keys(headers).forEach((key) => {
    if (headers[key] !== null && headers[key] !== undefined)
      xhr.setRequestHeader(key, headers[key])
  })

  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    },
  }
}

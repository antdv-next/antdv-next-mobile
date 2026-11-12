import type { UploadFile, UploadRequestOption } from '..'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, provide } from 'vue'
import Upload from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const last = <T>(list: T[] | undefined): T => list![list!.length - 1]

function makeFile(name = 'a.png', type = 'image/png', size = 10) {
  return new File([new Uint8Array(size)], name, { type })
}

async function pick(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
  await flushPromises()
}

const done: UploadFile = { uid: '-1', name: 'done.png', status: 'done', url: 'https://example.com/done.png' }
const q = (selector: string) => document.body.querySelector<HTMLElement>(selector)

describe('Upload', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the picture-card grid with a trigger by default', () => {
    const wrapper = mount(Upload, { props: { defaultFileList: [done], columns: 3 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-upload', 'am-upload-picture-card']))
    expect(wrapper.attributes('style')).toContain('--am-upload-columns: 3')
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(1)
    expect(wrapper.find('.am-upload-item').classes()).toContain('am-upload-item-done')
    expect(wrapper.find('.am-upload-item-image').attributes('src')).toBe(done.url)
    expect(wrapper.find('.am-upload-trigger').exists()).toBe(true)
    expect(wrapper.find('.am-upload-trigger').attributes('aria-label')).toBe('上传')
    expect(wrapper.find('.am-upload-item-remove').attributes('aria-label')).toBe('删除文件')
  })

  it('passes native input attributes', () => {
    const wrapper = mount(Upload, { props: { accept: 'image/*', multiple: true, capture: 'environment' } })
    const input = wrapper.find('input')
    expect(input.attributes('accept')).toBe('image/*')
    expect(input.attributes('multiple')).toBeDefined()
    expect(input.attributes('capture')).toBe('environment')
  })

  it('clicking the trigger opens the file picker unless disabled', async () => {
    const wrapper = mount(Upload)
    const click = vi.spyOn(wrapper.find('input').element, 'click')
    await wrapper.find('.am-upload-trigger').trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ disabled: true })
    await wrapper.find('.am-upload-trigger').trigger('click')
    ;(wrapper.vm as any).chooseFile()
    expect(click).toHaveBeenCalledTimes(1)
    expect(wrapper.classes()).toContain('am-upload-disabled')
  })

  it('without action / customRequest the picked files are collected as done', async () => {
    const wrapper = mount(Upload)
    await pick(wrapper, [makeFile('a.png'), makeFile('b.txt', 'text/plain')])
    const fileList = last(wrapper.emitted('update:fileList'))[0] as UploadFile[]
    expect(fileList.map(f => [f.name, f.status])).toEqual([['a.png', 'done'], ['b.txt', 'done']])
    expect(fileList[0].originFileObj).toBeInstanceOf(File)
    expect(fileList[0].originFileObj!.uid).toBe(fileList[0].uid)
    expect(wrapper.emitted('change')).toHaveLength(2)
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(2)
    // non-image file shows icon + name
    expect(wrapper.findAll('.am-upload-item')[1].find('.am-upload-item-name').text()).toBe('b.txt')
  })

  it('uploads through customRequest: progress, success and error with retry', async () => {
    const calls: UploadRequestOption[] = []
    const customRequest = vi.fn((options: UploadRequestOption, _info: { defaultRequest: unknown }) => {
      calls.push(options)
    })
    const wrapper = mount(Upload, {
      props: { customRequest, action: '/upload', data: { a: 1 }, headers: { token: 'x' }, name: 'pic', withCredentials: true },
    })
    await pick(wrapper, [makeFile('a.png')])
    expect(customRequest).toHaveBeenCalledTimes(1)
    expect(calls[0]).toMatchObject({ action: '/upload', data: { a: 1 }, headers: { token: 'x' }, filename: 'pic', withCredentials: true, method: 'post' })
    expect(typeof customRequest.mock.calls[0][1].defaultRequest).toBe('function')
    expect(wrapper.find('.am-upload-item').classes()).toContain('am-upload-item-uploading')
    expect(wrapper.find('.am-upload-item-mask-text').text()).toBe('上传中...')

    calls[0].onProgress({ percent: 42.4 })
    await nextTick()
    expect(wrapper.find('.am-upload-item-mask-text').text()).toBe('42%')
    const progress = last(wrapper.emitted('change'))[0] as any
    expect(progress.event).toEqual({ percent: 42.4 })
    expect(progress.file.status).toBe('uploading')

    calls[0].onError(new Error('boom'), { code: 500 })
    await nextTick()
    const failed = (last(wrapper.emitted('change'))[0] as any).file
    expect(failed.status).toBe('error')
    expect(failed.error.message).toBe('boom')
    expect(failed.response).toEqual({ code: 500 })
    expect(wrapper.find('.am-upload-item-mask-error').text()).toContain('上传失败')

    // tap the failed item to retry
    await wrapper.find('.am-upload-item').trigger('click')
    await flushPromises()
    expect(customRequest).toHaveBeenCalledTimes(2)
    calls[1].onSuccess({ url: 'ok' })
    await nextTick()
    const success = (last(wrapper.emitted('change'))[0] as any).file
    expect(success).toMatchObject({ status: 'done', percent: 100, response: { url: 'ok' } })
    expect(wrapper.find('.am-upload-item-mask').exists()).toBe(false)
  })

  it('resolves function action / data', async () => {
    const customRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: {
        customRequest,
        action: (file: File) => Promise.resolve(`/upload/${file.name}`),
        data: (file: UploadFile) => ({ uid: file.uid }),
      },
    })
    await pick(wrapper, [makeFile('a.png')])
    const options = customRequest.mock.calls[0][0]
    expect(options.action).toBe('/upload/a.png')
    expect(options.data.uid).toBe(options.file.uid)
  })

  it('default request posts FormData with XHR and reports progress', async () => {
    const instances: any[] = []
    class FakeXHR {
      upload: any = {}
      headers: Record<string, string> = {}
      status = 200
      responseText = '{"url":"/a.png"}'
      withCredentials = false
      open = vi.fn()
      abort = vi.fn()
      body: any
      onload: any
      onerror: any
      constructor() {
        instances.push(this)
      }

      setRequestHeader(key: string, value: string) {
        this.headers[key] = value
      }

      send(body: any) {
        this.body = body
      }
    }
    vi.stubGlobal('XMLHttpRequest', FakeXHR)
    const wrapper = mount(Upload, { props: { action: '/api/upload', method: 'put', headers: { Authorization: 'token' }, data: { biz: 'avatar' } } })
    await pick(wrapper, [makeFile('a.png')])
    const xhr = instances[0]
    expect(xhr.open).toHaveBeenCalledWith('put', '/api/upload', true)
    expect(xhr.headers).toMatchObject({ 'Authorization': 'token', 'X-Requested-With': 'XMLHttpRequest' })
    expect(xhr.body.get('biz')).toBe('avatar')
    expect(xhr.body.get('file')).toBeInstanceOf(File)

    xhr.upload.onprogress({ loaded: 5, total: 10 })
    await nextTick()
    expect((last(wrapper.emitted('change'))[0] as any).file.percent).toBe(50)
    xhr.onload()
    await nextTick()
    expect((last(wrapper.emitted('change'))[0] as any).file).toMatchObject({ status: 'done', response: { url: '/a.png' } })

    // http error
    await pick(wrapper, [makeFile('b.png')])
    instances[1].status = 500
    instances[1].onload()
    await nextTick()
    const failed = (last(wrapper.emitted('change'))[0] as any).file
    expect(failed.status).toBe('error')
    expect(failed.error.status).toBe(500)

    // removing an uploading file aborts the request
    await pick(wrapper, [makeFile('c.png')])
    await wrapper.findAll('.am-upload-item-remove')[2].trigger('click')
    await flushPromises()
    expect(instances[2].abort).toHaveBeenCalled()
  })

  it('beforeUpload: false keeps the file without uploading, LIST_IGNORE drops it, a Blob replaces the body', async () => {
    const customRequest = vi.fn()
    const replaced = new Blob(['compressed'])
    const beforeUpload = vi.fn((file: File, _fileList: File[]) => {
      if (file.name === 'skip.png')
        return false
      if (file.name === 'ignore.png')
        return Upload.LIST_IGNORE
      if (file.name === 'reject.png')
        return Promise.reject(new Error('no'))
      if (file.name === 'transform.png')
        return Promise.resolve(replaced)
      return true
    })
    const wrapper = mount(Upload, { props: { customRequest, beforeUpload, multiple: true } })
    await pick(wrapper, ['skip.png', 'ignore.png', 'reject.png', 'transform.png', 'ok.png'].map(name => makeFile(name)))
    expect(beforeUpload).toHaveBeenCalledTimes(5)
    expect(beforeUpload.mock.calls[0][1]).toHaveLength(5)
    const fileList = last(wrapper.emitted('update:fileList'))[0] as UploadFile[]
    expect(fileList.map(f => [f.name, f.status])).toEqual([
      ['skip.png', undefined],
      ['reject.png', undefined],
      ['transform.png', 'uploading'],
      ['ok.png', 'uploading'],
    ])
    expect(customRequest).toHaveBeenCalledTimes(2)
    expect(customRequest.mock.calls[0][0].file).toBe(replaced)
    expect(customRequest.mock.calls[1][0].file.name).toBe('ok.png')
  })

  it('maxCount hides the trigger and reports exceeding files, maxSize filters large files', async () => {
    const wrapper = mount(Upload, { props: { maxCount: 2, maxSize: 100, defaultFileList: [done], multiple: true } })
    expect(wrapper.find('.am-upload-trigger').exists()).toBe(true)
    await pick(wrapper, [makeFile('big.png', 'image/png', 200), makeFile('a.png'), makeFile('b.png')])
    const exceed = wrapper.emitted('exceed')!
    expect(exceed[0][1]).toBe('maxSize')
    expect((exceed[0][0] as File[]).map(f => f.name)).toEqual(['big.png'])
    expect(exceed[1][1]).toBe('maxCount')
    expect((exceed[1][0] as File[]).map(f => f.name)).toEqual(['b.png'])
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(2)
    expect(wrapper.find('.am-upload-trigger').exists()).toBe(false)
  })

  it('maxCount=1 replaces the current file when one is added programmatically', async () => {
    const wrapper = mount(Upload, { props: { maxCount: 1, defaultFileList: [done] } })
    await pick(wrapper, [makeFile('new.png')])
    const fileList = last(wrapper.emitted('update:fileList'))[0] as UploadFile[]
    expect(fileList.map(f => f.name)).toEqual(['new.png'])
  })

  it('removes a file, guarded by beforeRemove', async () => {
    const beforeRemove = vi.fn<(file: UploadFile) => boolean | Promise<boolean>>(() => false)
    const wrapper = mount(Upload, { props: { defaultFileList: [done], beforeRemove } })
    await wrapper.find('.am-upload-item-remove').trigger('click')
    await flushPromises()
    expect(beforeRemove).toHaveBeenCalledWith(done)
    expect(wrapper.emitted('remove')).toBeUndefined()

    beforeRemove.mockImplementation(() => Promise.reject(new Error('cancel')))
    await wrapper.find('.am-upload-item-remove').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('remove')).toBeUndefined()

    beforeRemove.mockImplementation(() => Promise.resolve(true))
    await wrapper.find('.am-upload-item-remove').trigger('click')
    await flushPromises()
    expect((wrapper.emitted('remove')![0][0] as UploadFile).status).toBe('removed')
    expect(last(wrapper.emitted('update:fileList'))[0]).toEqual([])
    expect((last(wrapper.emitted('change'))[0] as any).file.status).toBe('removed')
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(0)
  })

  it('is controlled by fileList', async () => {
    const wrapper = mount(Upload, { props: { fileList: [done] } })
    await wrapper.setProps({ fileList: [done, { uid: '-2', name: 'x.png', status: 'error' }] })
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(2)
    expect(wrapper.findAll('.am-upload-item')[1].classes()).toContain('am-upload-item-error')
    await wrapper.setProps({ fileList: [] })
    expect(wrapper.findAll('.am-upload-item')).toHaveLength(0)
  })

  it('tapping a finished image emits preview and opens the built-in viewer', async () => {
    const list: UploadFile[] = [done, { uid: '-2', name: 'doc.pdf', status: 'done', url: 'https://example.com/doc.pdf' }, { uid: '-3', name: 'b.png', status: 'done', url: 'https://example.com/b.png' }]
    const wrapper = mount(Upload, { props: { defaultFileList: list } })
    await wrapper.findAll('.am-upload-item')[1].trigger('click')
    expect(wrapper.emitted('preview')![0][0]).toEqual(list[1])
    expect(q('.am-image-preview')).toBeNull()

    await wrapper.findAll('.am-upload-item')[2].trigger('click')
    expect(q('.am-image-preview-index')!.textContent!.trim()).toBe('2 / 2')

    const plain = mount(Upload, { props: { defaultFileList: [done], preview: false } })
    document.body.innerHTML = ''
    await plain.find('.am-upload-item').trigger('click')
    expect(plain.emitted('preview')).toHaveLength(1)
    expect(q('.am-image-preview')).toBeNull()
  })

  it('showUploadList toggles the list, remove badge and preview', async () => {
    const wrapper = mount(Upload, { props: { defaultFileList: [done], showUploadList: false } })
    expect(wrapper.find('.am-upload-item').exists()).toBe(false)
    await wrapper.setProps({ showUploadList: { showRemoveIcon: false, showPreviewIcon: false } })
    expect(wrapper.find('.am-upload-item').exists()).toBe(true)
    expect(wrapper.find('.am-upload-item-remove').exists()).toBe(false)
    await wrapper.find('.am-upload-item').trigger('click')
    expect(q('.am-image-preview')).toBeNull()
  })

  it('text list type renders rows and a default localized button', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(Upload, { listType: 'text', defaultFileList: [done, { uid: '-2', name: 'x.zip', status: 'error' }] }),
      },
    })
    expect(wrapper.find('.am-upload').classes()).toContain('am-upload-text')
    expect(wrapper.find('.am-upload-trigger .am-button').text()).toBe(enUS.Upload.upload)
    const items = wrapper.findAll('.am-upload-item')
    expect(items[0].find('.am-upload-item-name').text()).toBe('done.png')
    expect(items[1].find('.am-upload-item-extra').text()).toBe(enUS.Upload.uploadError)
    expect(items[0].find('img').exists()).toBe(false)
  })

  it('renders default / itemRender / iconRender slots, slot wins over iconRender prop', async () => {
    const file: UploadFile = { uid: '-2', name: 'doc.pdf', status: 'done', type: 'application/pdf' }
    const wrapper = mount(Upload, {
      props: { defaultFileList: [file], iconRender: () => h('i', { class: 'prop-icon' }) },
      slots: { default: () => h('span', { class: 'custom-trigger' }, 'pick') },
    })
    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(true)

    const bySlot = mount(Upload, {
      props: { defaultFileList: [file], iconRender: () => h('i', { class: 'prop-icon' }) },
      slots: { iconRender: ({ file: f, listType }: any) => h('i', { class: 'slot-icon' }, `${f.name}-${listType}`) },
    })
    expect(bySlot.find('.slot-icon').text()).toBe('doc.pdf-picture-card')
    expect(bySlot.find('.prop-icon').exists()).toBe(false)

    const custom = mount(Upload, {
      props: { defaultFileList: [file, done] },
      slots: {
        itemRender: ({ file: f, index, actions }: any) => h('button', { class: 'custom-item', onClick: actions.remove }, `${index}:${f.name}`),
      },
    })
    expect(custom.findAll('.custom-item').map(w => w.text())).toEqual(['0:doc.pdf', '1:done.png'])
    expect(custom.find('.am-upload-item').exists()).toBe(false)
    await custom.find('.custom-item').trigger('click')
    await flushPromises()
    expect(custom.findAll('.custom-item')).toHaveLength(1)
  })

  it('uses previewFile for thumbnails and object URLs otherwise', async () => {
    const createObjectURL = vi.fn(() => 'blob:thumb')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL }))
    const wrapper = mount(Upload)
    await pick(wrapper, [makeFile('a.png')])
    expect(wrapper.find('.am-upload-item-image').attributes('src')).toBe('blob:thumb')
    await wrapper.find('.am-upload-item-remove').trigger('click')
    await flushPromises()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:thumb')

    const custom = mount(Upload, { props: { previewFile: () => Promise.resolve('data:image/png;base64,xx') } })
    await pick(custom, [makeFile('b.png')])
    expect(custom.find('.am-upload-item-image').attributes('src')).toBe('data:image/png;base64,xx')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Upload, {
      props: { defaultFileList: [done], rootClass: 'root-cls', classes: { item: 'item-cls', trigger: 'trigger-cls', list: 'list-cls' }, styles: { item: { opacity: 0.5 } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-upload-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-upload-item').attributes('style')).toContain('opacity: 0.5')
    expect(wrapper.find('.am-upload-trigger').classes()).toContain('trigger-cls')
    expect(wrapper.find('.am-upload-list').classes()).toContain('list-cls')
  })

  it('follows ConfigProvider componentDisabled and notifies the form item', async () => {
    const onFieldChange = vi.fn()
    const wrapper = mount({
      setup() {
        provide(formItemInputContextKey, { onFieldChange, onFieldBlur: () => {}, isFormItemInput: true } as any)
        return () => h(Upload, { defaultFileList: [done] })
      },
    })
    await wrapper.find('.am-upload-item-remove').trigger('click')
    await flushPromises()
    expect(onFieldChange).toHaveBeenCalledTimes(1)

    const disabled = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(Upload, { defaultFileList: [done] }) },
    })
    expect(disabled.find('.am-upload').classes()).toContain('am-upload-disabled')
    expect(disabled.find('.am-upload-item-remove').exists()).toBe(false)
  })
})

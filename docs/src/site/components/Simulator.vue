<script setup lang="ts">
import { ExportOutlined, ReloadOutlined } from '@antdv-next/icons'
import { computed, onMounted, ref, watch } from 'vue'
import { useMessages } from '../../shared/locale'
import { simulator } from '../state'

const t = useMessages()
const frameRef = ref<HTMLIFrameElement>()
const base = `${import.meta.env.BASE_URL}mobile.html`

const url = computed(() => {
  const query = simulator.demo ? `?demo=${encodeURIComponent(simulator.demo)}` : ''
  return `${base}#/${simulator.page}${query}`
})
// only the first url is used as `src`; later navigations replace the iframe location so the
// parent history (back button) is not polluted by the simulator.
const initialUrl = url.value
const time = ref('9:41')

function navigate() {
  const win = frameRef.value?.contentWindow
  if (!win)
    return
  try {
    win.location.replace(url.value)
  }
  catch {
    frameRef.value!.src = url.value
  }
}

watch(url, navigate)
watch(() => simulator.version, () => {
  frameRef.value?.contentWindow?.location.reload()
})

onMounted(() => {
  const update = () => {
    const now = new Date()
    time.value = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  }
  update()
  setInterval(update, 30_000)
})
</script>

<template>
  <aside class="simulator">
    <div class="simulator-toolbar">
      <span class="simulator-url">{{ simulator.page ? `/${simulator.page}` : '/' }}</span>
      <button class="icon-btn" :title="t.simulator.reload" :aria-label="t.simulator.reloadLabel" @click="simulator.version++">
        <ReloadOutlined />
      </button>
      <a class="icon-btn" :href="url" target="_blank" rel="noopener" :title="t.simulator.open" :aria-label="t.simulator.open">
        <ExportOutlined />
      </a>
    </div>
    <div class="phone">
      <div class="phone-status">
        <span>{{ time }}</span>
        <span class="phone-island" />
        <span class="phone-status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.6" y="5" width="3" height="6" rx="1" /><rect x="9.2" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.8" y="0" width="3" height="11" rx="1" /></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="20" height="10" rx="3" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" /><path d="M22 3.6v3.8c.8-.3 1.5-1 1.5-1.9S22.800 3.900 22 3.600Z" fill="currentColor" opacity=".45" /></svg>
        </span>
      </div>
      <iframe ref="frameRef" :src="initialUrl" :title="t.simulator.frame" class="phone-frame" />
    </div>
  </aside>
</template>

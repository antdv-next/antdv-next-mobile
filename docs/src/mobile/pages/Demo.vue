<script setup lang="ts">
import type { Component } from 'vue'
import { LeftOutlined } from '@antdv-next/icons'
import { computed, nextTick, onErrorCaptured, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDocs, useMessages } from '../../shared/locale'

const props = defineProps<{ name: string }>()
const route = useRoute()

interface LoadedDemo { id: string, full: boolean, component: Component }

const docs = useDocs()
const t = useMessages()
const entry = computed(() => docs.value.components.find(c => c.name === props.name))
// titles come from the current locale, the demo components are shared by both
const titles = computed(() => Object.fromEntries((entry.value?.demos ?? []).map(demo => [demo.id, demo.title])))
const demos = shallowRef<LoadedDemo[]>([])
const loading = ref(true)
const focused = ref('')
const errors = ref<Record<string, string>>({})

async function load() {
  loading.value = true
  demos.value = []
  errors.value = {}
  const current = entry.value
  if (current) {
    const loaded = await Promise.all(current.demos.map(async (demo) => {
      try {
        return { id: demo.id, full: demo.full, component: (await demo.load()).default }
      }
      catch (error) {
        errors.value[demo.id] = String(error)
        return { id: demo.id, full: demo.full, component: { render: () => null } as Component }
      }
    }))
    if (current.name === props.name)
      demos.value = loaded
  }
  loading.value = false
  await nextTick()
  scrollToDemo()
}

function scrollToDemo() {
  const id = route.query.demo as string | undefined
  focused.value = id ?? ''
  if (!id)
    return
  document.getElementById(`demo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(() => props.name, load, { immediate: true })
watch(() => route.query.demo, scrollToDemo)

onErrorCaptured((error, instance) => {
  // keep the rest of the page alive when one demo throws
  const el = instance?.$el as HTMLElement | undefined
  const id = el?.closest?.('.m-demo')?.id?.replace('demo-', '')
  if (id)
    errors.value[id] = String(error)
  console.error(error)
  return false
})
</script>

<template>
  <div class="m-demo-page">
    <header class="m-demo-nav">
      <RouterLink to="/" class="m-demo-back" :aria-label="t.mobile.back">
        <LeftOutlined />
      </RouterLink>
      {{ entry?.title ?? name }}
      <small>{{ entry?.subtitle }}</small>
    </header>
    <div v-if="!entry" class="m-demo-state">
      {{ t.mobile.notFound(name) }}
    </div>
    <div v-else-if="loading" class="m-demo-state">
      {{ t.mobile.loading }}
    </div>
    <div v-else class="m-demo-list">
      <section
        v-for="demo in demos"
        :id="`demo-${demo.id}`"
        :key="demo.id"
        class="m-demo"
        :class="{ 'm-demo-full': demo.full, 'focused': focused === demo.id }"
      >
        <h2 class="m-demo-title">
          {{ titles[demo.id] }}
        </h2>
        <div class="m-demo-body">
          <pre v-if="errors[demo.id]" class="m-demo-error">{{ errors[demo.id] }}</pre>
          <component :is="demo.component" v-else />
        </div>
      </section>
    </div>
  </div>
</template>

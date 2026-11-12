<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { localizePath, useDocs, useDocsLocale, useMessages } from '../../shared/locale'

const route = useRoute()
const docsLocale = useDocsLocale()
const docs = useDocs()
const t = useMessages()
const components = computed(() => docs.value.components)
const link = (path: string) => localizePath(path, docsLocale.locale)
const keyword = ref('')

interface Group { title: string, order: number, items: Array<{ to: string, title: string, subtitle?: string }> }

function groupBy<T extends { group: string, groupOrder: number }>(list: T[], toItem: (item: T) => Group['items'][number]) {
  const map = new Map<string, Group>()
  list.forEach((item) => {
    if (!map.has(item.group))
      map.set(item.group, { title: item.group, order: item.groupOrder, items: [] })
    map.get(item.group)!.items.push(toItem(item))
  })
  return Array.from(map.values()).sort((a, b) => a.order - b.order)
}

const isGuide = computed(() => route.meta.type === 'guide')

const groups = computed(() => {
  if (isGuide.value)
    return groupBy(docs.value.guides, g => ({ to: link(`/docs/${g.name}`), title: g.title }))
  const kw = keyword.value.trim().toLowerCase()
  const list = kw
    ? components.value.filter(c => c.title.toLowerCase().includes(kw) || c.subtitle.includes(kw) || c.name.includes(kw))
    : components.value
  return groupBy(list, c => ({ to: link(`/components/${c.name}`), title: c.title, subtitle: c.subtitle }))
})
</script>

<template>
  <aside class="site-sidebar">
    <label v-if="!isGuide" class="sidebar-search">
      <SearchOutlined />
      <input v-model="keyword" type="search" :placeholder="t.sidebar.search" :aria-label="t.sidebar.search">
      <span class="sidebar-count">{{ components.length }}</span>
    </label>
    <div v-for="group in groups" :key="group.title" class="sidebar-group">
      <div class="sidebar-group-title">
        {{ group.title }}
        <span v-if="!isGuide">{{ group.items.length }}</span>
      </div>
      <RouterLink v-for="item in group.items" :key="item.to" :to="item.to" class="sidebar-link">
        {{ item.title }}
        <span v-if="item.subtitle">{{ item.subtitle }}</span>
      </RouterLink>
    </div>
    <div v-if="!groups.length" class="sidebar-empty">
      {{ t.sidebar.empty }}
    </div>
  </aside>
</template>

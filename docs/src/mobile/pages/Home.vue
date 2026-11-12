<script setup lang="ts">
import type { ComponentEntry } from 'virtual:am-docs'
import { RightOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import logo from '../../assets/logo.svg'
import { setDocsLocale, useDocs, useDocsLocale, useMessages } from '../../shared/locale'

interface Group { title: string, order: number, items: ComponentEntry[] }

const docsLocale = useDocsLocale()
const docs = useDocs()
const t = useMessages()

const groups = computed(() => {
  const list: Group[] = []
  docs.value.components.forEach((component) => {
    let group = list.find(g => g.title === component.group)
    if (!group) {
      group = { title: component.group, order: component.groupOrder, items: [] }
      list.push(group)
    }
    group.items.push(component)
  })
  return list.sort((a, b) => a.order - b.order)
})

function toggleLocale() {
  setDocsLocale(docsLocale.locale === 'zh-CN' ? 'en-US' : 'zh-CN')
}
</script>

<template>
  <div class="m-home">
    <div class="m-home-hero">
      <img :src="logo" alt="">
      <h1>Antdv Next <b>Mobile</b></h1>
      <button class="m-home-locale" type="button" @click="toggleLocale">
        {{ t.switchLocale }}
      </button>
    </div>
    <p class="m-home-desc">
      {{ t.mobile.desc(docs.components.length) }}
    </p>
    <section v-for="group in groups" :key="group.title" class="m-home-group">
      <div class="m-home-group-title">
        {{ group.title }}
        <span>{{ group.items.length }}</span>
      </div>
      <div class="m-home-list">
        <RouterLink v-for="item in group.items" :key="item.name" :to="`/${item.name}`" class="m-home-item">
          {{ item.title }}
          <span class="m-home-sub">{{ item.subtitle }}</span>
          <RightOutlined />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

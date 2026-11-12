<script setup lang="ts">
import { RightOutlined } from '@antdv-next/icons'
import { components } from 'virtual:am-docs'

interface Group { title: string, order: number, items: typeof components }

const groups: Group[] = []
components.forEach((component) => {
  let group = groups.find(g => g.title === component.group)
  if (!group) {
    group = { title: component.group, order: component.groupOrder, items: [] }
    groups.push(group)
  }
  group.items.push(component)
})
groups.sort((a, b) => a.order - b.order)
</script>

<template>
  <div class="m-home">
    <div class="m-home-hero">
      <img src="/logo.svg" alt="">
      <h1>Antdv Next <b>Mobile</b></h1>
    </div>
    <p class="m-home-desc">
      与 antdv-next API 对齐的 Vue 3 移动端组件库，共 {{ components.length }} 个组件。
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

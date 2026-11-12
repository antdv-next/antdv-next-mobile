<script setup lang="ts">
defineOptions({ name: 'AmEmptyDefaultImage' })
</script>

<template>
  <svg class="am-empty-img-default" width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse class="am-empty-img-shadow" cx="80" cy="90" rx="56" ry="8" />
    <path class="am-empty-img-cloud" d="M118 26a7 7 0 0 1 13.6-2.3A5.5 5.5 0 1 1 133 34.5h-13.5A4.5 4.5 0 0 1 118 26Z" />
    <path class="am-empty-img-cloud" d="M27 40a5 5 0 0 1 9.7-1.6 4 4 0 1 1 1 7.6H28a3.2 3.2 0 0 1-1-6Z" />
    <path class="am-empty-img-back" d="M44 46 60 22h40l16 24v34a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V46Z" />
    <path class="am-empty-img-paper" d="M56 30a3 3 0 0 1 3-3h42a3 3 0 0 1 3 3v36H56V30Z" />
    <path class="am-empty-img-line" d="M64 38h32M64 46h32M64 54h20" />
    <path class="am-empty-img-front" d="M44 46h23a3 3 0 0 1 3 3 10 10 0 0 0 20 0 3 3 0 0 1 3-3h23v34a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V46Z" />
  </svg>
</template>

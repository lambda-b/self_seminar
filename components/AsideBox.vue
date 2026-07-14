<template>
  <aside class="my-3 rounded border-l-4 border-[#8fb8b3] bg-[#f4f8f7] px-4 py-3 text-[0.84rem] leading-snug text-[#213b40]">
    <p v-if="title" class="mb-2 text-[0.78rem] font-semibold text-[#176b87]">
      {{ title }}
    </p>
    <div class="aside-box-content">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<style scoped>
:deep(p) {
  margin: 0.25rem 0;
}

:deep(.katex-display) {
  margin: 0.45rem 0;
}

:deep(.katex) {
  font-size: 0.95em;
}
</style>

<template>
  <div class="small-text">
    <slot />
  </div>
</template>

<style scoped>
.small-text {
  font-size: 0.72rem;
  line-height: 1.25;
}

:deep(p) {
  margin: 0.2rem 0;
}

:deep(.katex-display) {
  margin: 0.35rem 0;
}

:deep(.katex) {
  font-size: 0.96em;
}
</style>

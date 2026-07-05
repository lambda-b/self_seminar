<template>
  <nav class="my-10">
    <slot />
  </nav>
</template>

<style scoped>
:deep(ul) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 1.35rem;
}

:deep(li:not(:last-child)::after) {
  content: "→";
  color: #176b87;
  margin-left: 0.8rem;
}
</style>

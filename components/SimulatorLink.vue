<script setup lang="ts">
const simulatorUrl = import.meta.env.DEV
  ? "http://localhost:5174/"
  : new URL("./supplement/secretary-simulator/", window.location.href).href;

// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
function openSimulator(event: MouseEvent) {
  const popup = window.open(
    simulatorUrl,
    "secretary-strategy-simulator",
    "popup=yes,width=1180,height=820,resizable=yes,scrollbars=yes",
  );

  if (popup) {
    event.preventDefault();
    popup.opener = null;
    popup.focus();
  }
}
</script>

<template>
  <a class="simulator-link" :href="simulatorUrl" target="_blank" rel="noopener" @click="openSimulator">
    <span><small>INTERACTIVE SUPPLEMENT</small>最適戦略をシミュレーションする</span>
    <b aria-hidden="true">↗</b>
  </a>
</template>

<style scoped>
.simulator-link { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.4rem; padding: .8rem 1rem; color: #fff; background: #176b87; border-left: .3rem solid #e09455; border-radius: .15rem; text-decoration: none; box-shadow: 0 .35rem 1rem rgba(23, 107, 135, .16); }
.simulator-link:hover { background: #125a72; }
.simulator-link span { font-weight: 650; }
.simulator-link small { display: block; margin-bottom: .05rem; color: #cbe6ed; font-size: .54rem; font-weight: 700; letter-spacing: .12em; }
.simulator-link b { font-size: 1.35rem; font-weight: 400; }
</style>

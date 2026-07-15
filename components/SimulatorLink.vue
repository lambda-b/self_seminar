<script setup lang="ts">
const simulatorUrl = new URL("./supplement/secretary-simulator/", window.location.href).href;
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const isPdfExport = import.meta.env.VITE_PDF_EXPORT === "true";

// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const openSimulator = (event: MouseEvent) => {
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
};
</script>

<template>
  <div
    v-if="isPdfExport"
    class="mt-4 flex items-center justify-between gap-3 rounded-sm border-l-4 border-slate-400 bg-slate-200 px-4 py-3 text-slate-600 shadow-inner"
    aria-disabled="true"
  >
    <span class="font-semibold">
      <small class="mb-0.5 block text-[0.52rem] font-bold tracking-[0.12em] text-slate-500">INTERACTIVE SUPPLEMENT</small>
      最適戦略シミュレータ
      <small class="mt-0.5 block text-[0.58rem] font-normal text-slate-500">PDF版では利用できません。Web版からお試しください。</small>
    </span>
    <span class="rounded-full border border-slate-400 px-2 py-1 text-[0.55rem] font-bold tracking-wide" aria-hidden="true">
      DISABLED
    </span>
  </div>
  <a
    v-else
    class="mt-4 flex items-center justify-between gap-3 rounded-sm border-l-4 border-orange-400 bg-[#176b87] px-4 py-3 text-white no-underline shadow-lg hover:bg-[#125a72]"
    :href="simulatorUrl"
    target="_blank"
    rel="noopener"
    @click="openSimulator"
  >
    <span class="font-semibold">
      <small class="mb-0.5 block text-[0.52rem] font-bold tracking-[0.12em] text-cyan-100">INTERACTIVE SUPPLEMENT</small>
      最適戦略シミュレータ
    </span>
    <b class="text-xl font-normal" aria-hidden="true">↗</b>
  </a>
</template>

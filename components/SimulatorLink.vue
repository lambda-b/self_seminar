<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const simulatorUrl = new URL("./supplement/secretary-simulator/", window.location.href).href;
const linkElement = ref<HTMLAnchorElement>();

const disableLinkForPrint = () => {
  linkElement.value?.removeAttribute("href");
};

const restoreLinkAfterPrint = () => {
  linkElement.value?.setAttribute("href", simulatorUrl);
};

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

onMounted(() => {
  window.addEventListener("beforeprint", disableLinkForPrint);
  window.addEventListener("afterprint", restoreLinkAfterPrint);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeprint", disableLinkForPrint);
  window.removeEventListener("afterprint", restoreLinkAfterPrint);
});
</script>

<template>
  <a
    ref="linkElement"
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

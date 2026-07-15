import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/supplement/secretary-simulator/" : "./",
  plugins: [
    mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: "../../dist/supplement/secretary-simulator",
    emptyOutDir: true,
  },
}));

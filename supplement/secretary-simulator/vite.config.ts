import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/supplement/secretary-simulator/" : "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../../dist/supplement/secretary-simulator",
    emptyOutDir: false,
  },
}));

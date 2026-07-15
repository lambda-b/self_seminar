import { defineConfig } from "vite";

export default defineConfig(({ isPreview }) => ({
  server: isPreview
    ? undefined
    : {
        proxy: {
          "/supplement/secretary-simulator": {
            target: "http://127.0.0.1:3031",
            changeOrigin: false,
          },
        },
      },
}));

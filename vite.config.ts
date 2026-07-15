export default {
  server: {
    proxy: {
      "/supplement/secretary-simulator": {
        target: "http://127.0.0.1:3031",
        changeOrigin: false,
      },
    },
  },
};

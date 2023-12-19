import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
  },
  plugins: [
    react({
      babel: {
        plugins: ["macros", "@emotion/babel-plugin"],
      },
    }),
    eslint(),
  ],
  server: {
    port: 3000
  },
});
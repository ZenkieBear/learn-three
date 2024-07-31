import { fileURLToPath, URL } from "url"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  root: './src',
  publicDir: './public',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
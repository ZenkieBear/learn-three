import { globSync } from 'glob'
import path, { resolve } from 'path'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  root: './src',
  publicDir: './public',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        globSync('src/**/*.html').map((file) => {
          console.log(file)
          return [
            path.relative('src', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ]
        })
      )
    },
    outDir: '../dist'
  }
})

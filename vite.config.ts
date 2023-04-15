import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // host: 'rwkv-web.localhost' // broken
  },
  plugins: [svelte()],
})

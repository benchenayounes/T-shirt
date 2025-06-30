import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/https://benchenayounes.github.io/T-shirt//',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
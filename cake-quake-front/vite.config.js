
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // host: '0.0.0.0', // 모바일 테스트용
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})


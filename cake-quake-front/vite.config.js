
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'global': 'window.global',
    'global.crypto': 'window.crypto'// 또는 'global': 'window' (일부 라이브러리에서 충돌 발생 시 비어있는 객체로 설정)
  },
  server: {
    // host: '0.0.0.0', // 모바일 테스트용
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/socket': { // 백엔드의 SockJS 엔드포인트와 일치
        target: 'http://localhost:8080', // 백엔드 포트
        changeOrigin: true,
        secure: false,
        ws: true, // 웹소켓 프록시 활성화
      },
    },
  },
})


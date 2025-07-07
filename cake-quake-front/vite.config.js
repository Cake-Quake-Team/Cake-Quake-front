
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': {},
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
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': { // 백엔드의 SockJS/WebSocket 엔드포인트와 일치하도록 '/socket' 대신 '/ws'로 변경
        target: 'http://localhost:8080', // 백엔드 포트
        changeOrigin: true,
        ws: true,
        secure: false,// ⭐ WebSocket 프록시를 활성화합니다.
      },
      '/sockjs-node': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
})


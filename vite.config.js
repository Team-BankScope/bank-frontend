import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. 기존 Spring Boot (Java) 서버 연결
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 2. 신규 FastAPI (Python/AI) 서버 연결
      '/py': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
    },
  },
})

/*    host: true,
    port: 5173,*/
/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://unreleased-smugly-alline.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      },
    },
  },
})*/
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      // Фронт ходит на относительный /api — без CORS и без адреса бэкенда в коде.
      // SSE (/api/dataset/events) через прокси тоже работает.
      proxy: {
        '/api': env.VITE_API_PROXY || 'http://127.0.0.1:8000',
      },
    },
  }
})

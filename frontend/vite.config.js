import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy:{
      '/api/v1' : 'https://you-tube-orcin-eight.vercel.app/',
    },
  },
  plugins: [react()],
})

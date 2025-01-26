import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy:{
      // '/api/v1' : 'http://localhost:8000',
      // '/api/v1' : 'https://youtube-backend-88d09717154b.herokuapp.com/',
      '/api/v1' : 'https://youtube-backend-88d09717154b.herokuapp.com',      
    },
  },
  plugins: [react()],
})

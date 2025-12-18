import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/countthosenumbers/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['framer-motion', '@react-spring/three']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

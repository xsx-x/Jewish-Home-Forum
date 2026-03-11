import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // החלף את 'your-repo-name' בשם הפרויקט בגיטהאב
  base: '/Jewish-Home-Forum/', 
})

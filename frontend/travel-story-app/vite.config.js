import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  extend: {
    colors:{
      primary: "#05B6D3",
      secondary: "#EF863E",
    },
    backgroundImage: {
      'login-bg-img' : "url('/assets/images/Window.jpeg')",
      'signup-bg-img': "url('./src/assets/images/download.jpeg')",
    }
  }
})

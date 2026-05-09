import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  base: "/pixel-fade/",
  plugins: [
    react(),
    tailwindcss(),
    checker({typescript: true}),
  ],
})

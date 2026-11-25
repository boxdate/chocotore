import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/chocotore/' : '/'),
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
}));

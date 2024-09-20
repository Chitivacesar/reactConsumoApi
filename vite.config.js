import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/clientes': {
        target: 'https://mi-b7yn.onrender.com', // URL de tu API
        changeOrigin: true,
        secure: false, // Cambia a true si tu API usa HTTPS
      },
    },
  },
});

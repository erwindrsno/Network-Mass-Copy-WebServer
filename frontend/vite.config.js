import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@utils': '/src/components/utils',
      '@icons': '/src/assets',
      '@apis': '/src/apis',
      '@components': '/src/components'
    }
  }
});

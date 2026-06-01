import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // itch.io requires relative paths for assets to load correctly
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        film: resolve(__dirname, 'film.html'),
      },
    },
  },
});
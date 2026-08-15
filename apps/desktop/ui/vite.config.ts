import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname),
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
  },
  build: {
    outDir: path.resolve(__dirname, '../dist/ui'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@posnepal/shared': path.resolve(__dirname, '../../../packages/shared/src'),
    },
  },
});

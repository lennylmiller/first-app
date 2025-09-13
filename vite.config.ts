import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^@polymer\//,
      output: {
        dir: 'dist'
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    include: ['lit', '@polymer/polymer']
  },
  esbuild: {
    target: 'es2020'
  }
});
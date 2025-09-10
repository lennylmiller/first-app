import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
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
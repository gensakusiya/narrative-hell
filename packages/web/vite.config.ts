import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: '../../dist/webview',
    rollupOptions: {
      output: {
        entryFileNames: 'webview.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'webview.css';
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
});

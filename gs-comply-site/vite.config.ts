import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Browser build only (the server build used for pre-rendering keeps Vite's defaults).
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id: string) {
              if (!id.includes('node_modules')) return undefined;
              // Only the icons actually used end up here (tree-shaken); one request instead of dozens.
              if (id.includes('lucide-react')) return 'icons';
              // Rarely changes, so browsers can keep it cached across deploys.
              if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run)\//.test(id)) return 'react-vendor';
              return undefined;
            },
          },
        },
  },
}));

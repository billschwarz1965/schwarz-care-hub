import { defineConfig } from 'vite';
import { resolve } from 'path';

// Standalone Patient Concierge build.
// Shares every JS/CSS module with ../poc/src — the `/src/...` paths used by the
// two pages below are aliased there, so all editions stay on one copy of the code
// and an agent added to patient-app.js appears here automatically.
const SHARED_SRC = resolve(__dirname, '../poc/src');

export default defineConfig({
  base: './',
  root: '.',
  resolve: {
    alias: [
      { find: /^\/src\//, replacement: SHARED_SRC + '/' },
    ]
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      }
    }
  },
  server: {
    port: 5185,
    host: true,
    fs: {
      allow: [resolve(__dirname), SHARED_SRC]
    },
    proxy: {
      '/api/trials': {
        target: 'https://clinicaltrials.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trials/, '/api/v2'),
        secure: true
      }
    }
  }
});

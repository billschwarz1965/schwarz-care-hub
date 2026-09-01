import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createRequire } from 'module';

// External-audience build of the MedVerse POC.
// Shares every JS/CSS module with ../poc/src — the `/src/...` paths used by the
// pages below are aliased there, so both builds stay on one copy of the code.
const SHARED_SRC = resolve(__dirname, '../poc/src');

const { version: APP_VERSION } = createRequire(import.meta.url)('./package.json');

// Version strings in the pages had drifted from package.json (a footer still
// read v0.4.13 against a 0.1.0 package). Pages write %APP_VERSION% instead and
// this substitutes it at serve and build time, so there is one source of truth.
const appVersionHtml = {
  name: 'medverse-app-version',
  transformIndexHtml: (html) => html.replaceAll('%APP_VERSION%', APP_VERSION)
};

export default defineConfig({
  base: './',
  root: '.',
  plugins: [appVersionHtml],
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
        concierge: resolve(__dirname, 'concierge.html'),
        ask: resolve(__dirname, 'ask.html'),
        disease: resolve(__dirname, 'disease.html'),
        literature: resolve(__dirname, 'literature.html'),
        congress: resolve(__dirname, 'congress.html'),
        demo: resolve(__dirname, 'demo.html'),
      }
    }
  },
  server: {
    port: 5182,
    host: true,
    fs: {
      allow: [resolve(__dirname), SHARED_SRC]
    },
    proxy: {
      '/api/pubmed': {
        target: 'https://eutils.ncbi.nlm.nih.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pubmed/, '/entrez/eutils'),
        secure: true
      },
      '/api/trials': {
        target: 'https://clinicaltrials.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trials/, '/api/v2'),
        secure: true
      }
    }
  }
});

import { defineConfig } from 'vite';
import { resolve } from 'path';

// Internal-audience build of the MedVerse POC — Medical Affairs and MSL field
// teams. Shares every JS/CSS module with ../poc/src, the same arrangement
// poc-external uses, so all editions stay on one copy of the code.
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
        ask: resolve(__dirname, 'ask.html'),
        mslcopilot: resolve(__dirname, 'msl-copilot.html'),
        medical: resolve(__dirname, 'medical.html'),
        orion: resolve(__dirname, 'orion.html'),
        population: resolve(__dirname, 'population.html'),
        caregap: resolve(__dirname, 'care-gap.html'),
        disease: resolve(__dirname, 'disease.html'),
        literature: resolve(__dirname, 'literature.html'),
        congress: resolve(__dirname, 'congress.html'),
        agents: resolve(__dirname, 'agents.html'),
        demo: resolve(__dirname, 'demo.html'),
      }
    }
  },
  server: {
    port: 5184,
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

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        orion: resolve(__dirname, 'orion.html'),
        disease: resolve(__dirname, 'disease.html'),
        literature: resolve(__dirname, 'literature.html'),
        congress: resolve(__dirname, 'congress.html'),
        agents: resolve(__dirname, 'agents.html'),
      }
    }
  },
  server: {
    port: 5180,
    host: true,
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

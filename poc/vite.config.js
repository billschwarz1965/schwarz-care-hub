import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: '.',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        mslcopilot: resolve(__dirname, 'msl-copilot.html'),
        concierge: resolve(__dirname, 'concierge.html'),
        orion: resolve(__dirname, 'orion.html'),
        population: resolve(__dirname, 'population.html'),
        disease: resolve(__dirname, 'disease.html'),
        literature: resolve(__dirname, 'literature.html'),
        congress: resolve(__dirname, 'congress.html'),
        agents: resolve(__dirname, 'agents.html'),
        patient: resolve(__dirname, 'patient.html'),
        medical: resolve(__dirname, 'medical.html'),
        systemtools: resolve(__dirname, 'system-tools.html'),
        demo: resolve(__dirname, 'demo.html'),
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

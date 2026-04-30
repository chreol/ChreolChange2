import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Pour GitHub Pages (chemins relatifs)
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

build: {
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false,
  minify: 'esbuild', // ✅ Changé de 'terser' à 'esbuild' (déjà inclus dans Vite)
  
  // esbuild options (plus léger que terserOptions)
  esbuild: {
    drop: ['console', 'debugger'], // ✅ Supprime console.log et debugger en prod
  },
  
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
    },
    output: {
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
  },
},

  server: {
    port: 5173,
    open: true, // Ouvrir le navigateur automatiquement en dev
    host: true, // Accessible sur le réseau local
  },

  preview: {
    port: 4173,
    open: true,
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: [], // Ajouter si tu utilises des libs externes
  },

  // Plugins (à décommenter si tu en ajoutes)
  plugins: [
    // vue(), // Si tu utilises Vue
    // react(), // Si tu utilises React
  ],
});
import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import electron from 'vite-plugin-electron'

// Main Vite Config
export default defineConfig({
  server: {
    hmr: { overlay: false },
    fs: { allow: ['.', '../'] },
  },
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        control: path.resolve(__dirname, 'control.html'),
      },
      output: {
        inlineDynamicImports: false,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    electron([
      {
        // Electron Main Process
        entry: 'electron/main.js',
      },
      {
        // Electron Preload for Main Window
        entry: 'electron/preload_main.js',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              input: 'electron/preload_main.js',
              output: { 
                inlineDynamicImports: false,                
                format: 'esm',
                entryFileNames: '[name].mjs',
               },
            },
          },
        },
      },
      {
        // Electron Preload for Control Window
        entry: 'electron/preload_control.js',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              input: 'electron/preload_control.js',
              output: { 
                inlineDynamicImports: false,
                format: 'esm',
                entryFileNames: '[name].mjs',
               },
            },
          },
        },
      },
    ]),
  ],
})

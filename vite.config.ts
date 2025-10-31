import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Svelte 5 runes mode
        runes: true
      }
    })
  ],
  build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'core/index': resolve(__dirname, 'src/core/index.ts'),
        'svelte/index': resolve(__dirname, 'src/svelte/index.ts'),
        'react/index': resolve(__dirname, 'src/react/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'svelte',
        'svelte/internal',
        '@tiptap/core',
        '@tiptap/pm',
        '@tiptap/starter-kit',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-underline',
        '@tiptap/extension-text-align',
        '@tiptap/extension-text-style',
        '@tiptap/extension-color',
        '@tiptap/extension-highlight',
        '@tiptap/extension-link',
        '@tiptap/extension-image',
        '@tiptap/suggestion'
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      }
    },
    sourcemap: true,
    outDir: 'dist'
  }
});

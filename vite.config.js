
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/frontend-project-11/',
  plugins: [
    tailwindcss(),
  ],
});


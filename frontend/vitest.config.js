import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js',
    coverage: {
      reporter: ['text', 'html'],
      provider: 'v8',
      statements: 40,
      branches: 40,
      functions: 40,
      lines: 40,
      include: ['src/components/**/*.jsx', 'tests/**/*.test.jsx'],
    },
    include: ['tests/**/*.test.jsx'],
  },
});

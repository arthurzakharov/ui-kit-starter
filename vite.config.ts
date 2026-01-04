/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'node:path';
import url from 'node:url';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  logLevel: 'info',
  plugins: [
    react(),
    dts({
      logLevel: 'warn',
      rollupTypes: false,
      tsconfigPath: './tsconfig.app.json',
      exclude: ['**/*.stories.ts', '**/*.stories.tsx'],
    }),
    libInjectCss(),
  ],
  build: {
    sourcemap: 'inline',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1024,
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'rightmart-ui',
      fileName: 'rightmart-ui',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ['**/*.stories.ts', '**/*.stories.tsx'],
          })
          .map((file) => [
            path.relative('src', file.slice(0, file.length - path.extname(file).length)),
            url.fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      exclude: ['./.storybook/**', './**/*.css'],
    },
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});

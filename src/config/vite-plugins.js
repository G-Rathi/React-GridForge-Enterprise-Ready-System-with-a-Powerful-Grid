// Vite plugins configuration
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

export const vitePlugins = [
  AutoImport({
    imports: [
      'react',
      'react-router-dom',
      {
        '@reduxjs/toolkit/query/react': [
          'createApi',
          'fetchBaseQuery',
        ],
        '@reduxjs/toolkit': [
          'createSlice',
          'configureStore',
        ],
      },
    ],
    dts: './src/auto-imports.d.ts',
    eslintrc: {
      enabled: true,
    },
  }),
];
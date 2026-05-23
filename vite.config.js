import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { proxyConfig } from './src/config/proxy.conf.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Get the proxy configuration based on the current mode
  // Default to development if mode is not explicitly production
  const isProduction = mode === 'production'
  const proxy = isProduction ? proxyConfig.production : proxyConfig.development

  return {
    plugins: [react()],
    server: {
      // Bind the dev server to the standard Vite port (5173) by default.
      // If the port is already in use, Vite will still try the next free port.
      port: 5173,
      proxy: proxy,
    },
  }
})

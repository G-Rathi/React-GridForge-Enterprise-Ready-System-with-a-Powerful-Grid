export const proxyConfig = {
  development: {
    // In development, point API routes to the local JSON server so the demo
    // app doesn't attempt to reach a non-existent backend on :3000 which
    // causes ECONNREFUSED proxy errors. This forwards `/api/*` -> `http://localhost:3001/*`.
    '/api': {
      target: process.env.VITE_API_URL || 'https://json-server1-7y3j.onrender.com',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    // NOTE: remove direct `/todos` proxy so SPA routes like `/todos` load index.html.
    // All API requests should use the `/api/*` prefix.
  },
  production: {
    '/api': {
      target: process.env.VITE_API_URL || process.env.API_URL || 'https://json-server1-7y3j.onrender.com',
      changeOrigin: true,
      secure: true,
    },
    '/todos': {
      target: process.env.VITE_JSON_SERVER_URL || 'http://localhost:3001',
      changeOrigin: true,
      secure: true,
    },
  },
};
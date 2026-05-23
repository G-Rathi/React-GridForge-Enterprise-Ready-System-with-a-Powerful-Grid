export function loadEnv(mode) {
  const env = { ...process.env };

  // Load environment-specific variables
  if (mode === 'development') {
    Object.assign(env, import.meta.env);
  } else {
    // In production, use environment variables from the server
    for (const key in import.meta.env) {
      if (key.startsWith('VITE_')) {
        env[key] = import.meta.env[key];
      }
    }
  }

  return env;
}
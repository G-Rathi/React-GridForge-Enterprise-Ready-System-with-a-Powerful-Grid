# Troubleshooting Guide

## Common Issues and Solutions

### 1. JSON Server Not Starting

**Error:** `Error: Cannot find module 'json-server'` or `'json-server' is not recognized`

**Solution:**
```bash
npm install --legacy-peer-deps
```

If that doesn't work, install json-server separately:
```bash
npm install --save-dev json-server --legacy-peer-deps
```

### 2. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
- Check if another process is using port 3001:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  
  # Mac/Linux
  lsof -i :3001
  ```
- Kill the process or change the port in `json-server.json` and `proxy.conf.js`

### 3. Connection Refused Errors

**Error:** `ECONNREFUSED` or `Failed to fetch`

**Solutions:**
1. Make sure JSON Server is running:
   ```bash
   npm run json-server
   ```
2. Verify JSON Server is accessible at http://localhost:3001/todos
3. Check if the proxy configuration in `vite.config.js` is correct
4. Restart both servers

### 4. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- The Vite proxy should handle CORS automatically
- If issues persist, check `proxy.conf.js` has `changeOrigin: true`

### 5. Database File Not Found

**Error:** `Error: Cannot find module './db.json'`

**Solution:**
1. Ensure `db.json` exists in the root directory
2. If missing, regenerate it:
   ```bash
   npm run generate-db
   ```

### 6. Invalid JSON in db.json

**Error:** `SyntaxError: Unexpected token in JSON`

**Solution:**
1. Validate JSON syntax:
   ```bash
   # Using Node.js
   node -e "JSON.parse(require('fs').readFileSync('db.json', 'utf8'))"
   ```
2. Regenerate db.json:
   ```bash
   npm run generate-db
   ```

### 7. RTK Query Not Fetching Data

**Error:** No data or loading state never completes

**Solutions:**
1. Check browser console for errors
2. Verify the API endpoint is correct in `todoApi.js`
3. Check Network tab in DevTools to see if requests are being made
4. Verify JSON Server is responding:
   ```bash
   curl http://localhost:3001/todos
   ```

### 8. Windows Path Issues

**Error:** Path-related errors in scripts

**Solution:**
- Use Git Bash or WSL instead of Command Prompt
- Or use cross-platform path handling (already implemented)

### 9. Concurrently Not Working

**Error:** `'concurrently' is not recognized`

**Solution:**
```bash
npm install --save-dev concurrently --legacy-peer-deps
```

### 10. Dependency Conflicts

**Error:** Peer dependency warnings during install

**Solution:**
```bash
npm install --legacy-peer-deps
```

This is safe to use and resolves most peer dependency conflicts.

## Verification Steps

### 1. Check JSON Server is Running
```bash
# Terminal 1
npm run json-server

# Should see:
# \{^_^}/ hi!
# Loading db.json
# OAuth2 Server ready on http://localhost:3001
```

### 2. Test JSON Server API
```bash
# In browser or using curl
curl http://localhost:3001/todos

# Should return JSON array of todos
```

### 3. Check Vite Dev Server
```bash
# Terminal 2
npm run dev

# Should see:
# VITE v7.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
```

### 4. Test in Browser
1. Open http://localhost:5173/todos
2. Open browser DevTools (F12)
3. Check Network tab for `/todos` requests
4. Verify requests are being proxied correctly

## Quick Fixes

### Reset Everything
```bash
# Stop all servers (Ctrl+C)
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Regenerate db.json
npm run generate-db

# Start servers
npm run dev:server
```

### Check Logs
- JSON Server logs: Check the terminal where json-server is running
- Vite logs: Check the terminal where vite is running
- Browser console: Check for JavaScript errors
- Network tab: Check for failed requests

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the terminal output for both servers
3. Verify all files are in the correct locations
4. Ensure Node.js version is >= 24.0.0
5. Try clearing browser cache
6. Restart your development environment

## Getting Help

If you're still experiencing issues:
1. Copy the exact error message from the terminal
2. Check which step in the setup process failed
3. Verify your Node.js and npm versions
4. Check if all dependencies are installed correctly


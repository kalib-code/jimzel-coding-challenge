#!/bin/sh
set -e

# Print environment variables for debugging
echo "API URL: $VITE_API_URL"

# Update the vite.config.ts file to ensure proper host binding and proxy setup
cat > vite.config.ts << EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
      host: 'localhost',
    },
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    cors: true
  },
});
EOF

# Create a local .env file to override environment variables
cat > .env.local << EOF
VITE_API_URL=/api
EOF

# Start the dev server
exec "$@"
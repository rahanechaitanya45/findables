import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The hosted preview does not proxy Vite's HMR WebSocket reliably.
      // Disable the client and watcher so it cannot report a closed socket.
      hmr: false,
      watch: null,
    },
  };
});

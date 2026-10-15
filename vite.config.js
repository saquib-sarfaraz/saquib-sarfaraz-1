import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/chat.js';

// Custom Vite plugin to handle /api/chat locally during npm run dev
function apiDevPlugin() {
  return {
    name: 'api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        // Load environment variables from .env / .env.local in project root
        const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
        process.env.GROQ_API_KEY_1 = process.env.GROQ_API_KEY_1 || env.GROQ_API_KEY_1 || '';
        process.env.GROQ_API_KEY_2 = process.env.GROQ_API_KEY_2 || env.GROQ_API_KEY_2 || '';
        process.env.GROQ_API_KEY_3 = process.env.GROQ_API_KEY_3 || env.GROQ_API_KEY_3 || '';
        process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || env.GROQ_API_KEY || env.XAI_API_KEY || '';
        process.env.XAI_API_KEY = process.env.XAI_API_KEY || env.XAI_API_KEY || env.GROQ_API_KEY || '';

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end();
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            req.body = bodyStr ? JSON.parse(bodyStr) : {};
          } catch (e) {
            req.body = {};
          }

          // Express response mock helper for Vercel handler
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          try {
            await handler(req, res);
          } catch (err) {
            console.error('Local API dev server error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['framer-motion'],
          lucide: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});

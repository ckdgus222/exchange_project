import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import https from 'https';

// Create a custom HTTPS agent to ignore SSL certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // WARNING: This makes your connection vulnerable to MITM attacks
});

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "https://www.koreaexim.go.kr",
        changeOrigin: true,
        secure: false, // This flag attempts to bypass SSL certificate errors
        rewrite: path => path.replace(/^\/api\/proxy/, "/site/program/financial/exchangeJSON"),
        agent: httpsAgent, // Use the custom agent in the proxy
      },
    },
  },
});

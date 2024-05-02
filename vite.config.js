import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "https://www.koreaexim.go.kr", // Target API server
        changeOrigin: true, // Needed to handle CORS and origin headers
        rewrite: (path) => path.replace(/^\/api/, "/site/program/financial/exchangeJSON"), // Rewrites path
      },
    },
  },
});

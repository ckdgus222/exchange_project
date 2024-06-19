import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.koreaexim.go.kr',
        changeOrigin: true,
        secure: false,  // SSL 인증서 검증 비활성화 
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/site/program/financial/exchangeJSON')
      },
    },
  },
});

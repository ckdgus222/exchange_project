import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api/proxy': {  // 더 명확한 경로 매칭
        target: 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/proxy': '' },  // pathRewrite 옵션 사용
      },
    },
  },
});
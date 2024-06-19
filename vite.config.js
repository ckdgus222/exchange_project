import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import https from 'https';

// HTTPS 에이전트 생성
const agent = new https.Agent({
  rejectUnauthorized: true  // SSL 인증서 검증 활성화
});

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.koreaexim.go.kr',
        changeOrigin: true,
        secure: false,  // 주의: Vercel에서 SSL 인증서 검증 비활성화 필요
        rewrite: path => path.replace(/^\/api\/proxy/, ''),
        agent
      },
    },
  },
});
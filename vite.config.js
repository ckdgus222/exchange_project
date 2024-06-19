import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false, // 필요에 따라 설정
});

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api/proxy': {
        target: 'https://www.koreaexim.go.kr',
        changeOrigin: true,
        secure: false, // SSL 인증서 검증 비활성화
        rewrite: path => path.replace(/^\/api\/proxy/, '/site/program/financial/exchangeJSON'), // URL 재작성
        agent, // 정의된 HTTPS 에이전트를 사용
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import https from 'https';

// SSL 인증서 검증을 비활성화하기 위한 HTTPS 에이전트 생성
const agent = new https.Agent({
  rejectUnauthorized: false
});

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      "/api/proxy": {  // '/api'가 아니라 '/api/proxy' 경로에 명시적으로 프록시를 설정
        target: "https://www.koreaexim.go.kr",
        changeOrigin: true, // Needed to handle CORS and origin headers
        secure: false, // SSL 인증서 검증 비활성화
        rewrite: path => path.replace(/^\/api\/proxy/, '/site/program/financial/exchangeJSON'), // 경로 재작성
        agent // HTTPS 에이전트 설정
      },
    },
  },
});

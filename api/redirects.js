import axios from 'axios';
import https from 'https';

module.exports = async (req, res) => {
  // 요청 URL과 호스트 정보를 사용해 URL 객체 생성
  const { pathname, searchParams } = new URL(req.url, `https://${req.headers.host}`);

  // 쿼리 파라미터에서 필요한 값들 추출
  const authkey = searchParams.get('authkey');
  const searchdate = searchParams.get('searchdate');
  const data = searchParams.get('data');

  // 필수 파라미터가 누락된 경우 클라이언트에 400 에러 응답
  if (!authkey || !searchdate || !data) {
    res.statusCode = 400;
    return res.end('Missing required query parameters.');
  }

  // 외부 API로 리디렉션할 URL 설정
  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  // 응답에 리디렉션 설정
  res.statusCode = 302;
  res.setHeader('Location', apiUrl);
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  res.end();
};

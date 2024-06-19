import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  // API URL 구성
  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  
  // HTTPS 에이전트 구성
  const agent = new https.Agent({
    rejectUnauthorized: true  // 인증서 검증 활성화
  });

  try {
    // 리디렉션 비활성화 및 첫 번째 요청 시도
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0  // 리디렉션 비활성화
    });

    // 리디렉션 수동 처리 로직
    while (response.status === 302 && response.headers.location) {
      const location = response.headers.location;
      console.log('Redirecting to:', location);

      // 같은 위치로의 리디렉션을 피하기 위해 검사
      if (location === apiUrl) break;

      // 리디렉션 따라가기
      response = await axios.get(location, {
        httpsAgent: agent,
        maxRedirects: 0  // 추가 리디렉션 비활성화
      });
    }

    // 최종 응답 검사
    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // 데이터 반환
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

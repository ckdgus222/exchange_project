import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  
  // 필수 파라미터 검증
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  // SSL 검사를 비활성화하는 에이전트 생성 (예제이므로 주의해서 사용)
  const agent = new https.Agent({
    rejectUnauthorized: false  // 보안 상의 이유로 실제 운영 환경에서는 권장하지 않음
  });

  // 리디렉션을 수동으로 처리하도록 설정
  const fetchOptions = {
    agent,
    redirect: 'manual' // 리디렉션을 자동으로 따르지 않고 수동으로 처리
  };

  try {
    console.log(`Requesting URL: ${apiUrl}`);

    const apiResponse = await fetch(apiUrl, fetchOptions);
    if (apiResponse.status >= 300 && apiResponse.status < 400) {
      // 리디렉션 응답 처리
      const locationHeader = apiResponse.headers.get('location');
      console.log(`Redirected to: ${locationHeader}`);
      return res.status(200).json({ message: 'Redirected', location: locationHeader });
    } else if (!apiResponse.ok) {
      // 기타 HTTP 에러 처리
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    // 정상적인 API 응답 데이터 처리
    const responseData = await apiResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      message: 'Unable to fetch data',
      error: error.message
    });
  }
}

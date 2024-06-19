import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  // SSL 검사를 비활성화하는 에이전트 생성
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // 리디렉션 정책을 'manual'로 설정하여 리디렉션을 수동으로 처리
  const fetchOptions = {
    agent,
    redirect: 'manual' // 리디렉션을 자동으로 따르지 않음
  };

  try {
    const apiResponse = await fetch(apiUrl, fetchOptions);
    if (!apiResponse.ok) {
      // API 상태 코드에 따라 적절한 에러 메시지 처리
      if (apiResponse.status === 301 || apiResponse.status === 302) {
        console.log('Redirected:', apiResponse.headers.get('location'));
        return res.status(200).json({ message: 'Redirected', location: apiResponse.headers.get('location') });
      }
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

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

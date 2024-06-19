import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  // SSL 인증서 검증을 비활성화 (운영 환경에서는 사용을 권장하지 않음)
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // 리디렉션을 수동으로 처리하도록 설정
  const fetchOptions = {
    agent,
    redirect: 'manual'
  };

  try {
    const apiResponse = await fetch(apiUrl, fetchOptions);
    
    // 리디렉션 응답 처리
    if (apiResponse.status >= 300 && apiResponse.status < 400) {
      const locationHeader = apiResponse.headers.get('location');
      console.log(`Redirected to: ${locationHeader}`);
      return res.status(200).json({ message: 'Redirected', location: locationHeader });
    }

    // 정상적인 응답 처리
    if (!apiResponse.ok) {
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



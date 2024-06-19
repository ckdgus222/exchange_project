import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { authkey, searchdate, data } = req.query;
  
  
  // 필수 파라미터 검증
  if (!authkey || !searchdate || !data) {
    console.error('Missing required query parameters: ', req.query);
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }
  
  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=AP01`;

  try {
    console.log(`Requesting URL: ${apiUrl}`);

    const apiResponse = await fetch(apiUrl);
    console.log(`API Response Status: ${apiResponse.status}`);
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('API Response Error:', errorBody);
      throw new Error(`API responded with status ${apiResponse.status}: ${errorBody}`);
    }

    const responseData = await apiResponse.json();
    console.log('API Response Data:', responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}

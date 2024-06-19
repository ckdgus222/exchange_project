import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const fetchOptions = {
      agent,
      redirect: 'manual'  // 리디렉션을 수동으로 처리
    };

    const apiResponse = await fetch(apiUrl, fetchOptions);

    if (apiResponse.status >= 300 && apiResponse.status < 400) {
      // 리디렉션 발생 시
      const locationHeader = apiResponse.headers.get('location');
      console.log(`Redirected to: ${locationHeader}`);
      return res.redirect(locationHeader);  // 필요한 경우 클라이언트를 리디렉션
    }

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}

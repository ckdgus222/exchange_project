import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  // SSL 인증서 검증 비활성화
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    let response = await fetch(apiUrl, {
      agent,
      redirect: 'manual' // 리디렉션을 자동으로 따르지 않음
    });

    while (response.status === 302) {
      const location = response.headers.get('location');
      console.log('Redirect location:', location);

      response = await fetch(location, {
        agent,
        redirect: 'manual'
      });
    }

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}


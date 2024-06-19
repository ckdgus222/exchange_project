import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false // 보안 리스크가 있으니, 실제 운영 환경에서는 신중하게 사용
  });

  try {
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0 // 리디렉션 자동 처리 비활성화
    });

    // 리디렉션 수동 처리
    while (response.status === 302 && response.headers.location) {
      if (response.headers.location === apiUrl) {
        // 무한 리디렉션 방지
        break;
      }
      console.log('Redirect location:', response.headers.location);
      response = await axios.get(response.headers.location, { httpsAgent: agent, maxRedirects: 0 });
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

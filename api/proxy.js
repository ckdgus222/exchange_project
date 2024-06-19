import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  const agent = new https.Agent({
    rejectUnauthorized: false  // SSL 인증서 검증 비활성화
  });

  try {
    // 리디렉션 최대 5회 허용
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 5
    });

    // 리디렉션이 발생한 경우 로그 출력
    if (response.status === 302) {
      console.log(`Redirected to: ${response.headers.location}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

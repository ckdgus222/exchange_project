import axios from 'axios';
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
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 5 // 리디렉션 최대 횟수를 설정
    });

    while (response.status === 302 && response.headers.location) {
      console.log(`Redirected to: ${response.headers.location}`);
      response = await axios.get(response.headers.location, {
        httpsAgent: agent,
        maxRedirects: 0 // 추가 리디렉션 비활성화
      });
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

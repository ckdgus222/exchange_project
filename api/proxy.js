import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false // 배포 시에는 보안 리스크가 있으므로 주의가 필요합니다.
  });

  try {
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 5 // 리디렉션 최대 횟수 설정
    });

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      res.status(error.response.status).json({ message: 'Error from external API', details: error.response.data });
    } else {
      res.status(500).json({ message: 'Unable to fetch data', error: error.message });
    }
  }
}

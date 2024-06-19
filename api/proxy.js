import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false // 이 설정은 보안 리스크가 있으니 주의해서 사용
  });

  try {
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0 // 리디렉션 비활성화
    });

    if (response.status === 302) {
      const location = response.headers.location;
      console.log('Redirect location:', location);
      if (location !== apiUrl) { // 같은 URL로의 리디렉션 방지
        response = await axios.get(location, { httpsAgent: agent });
      }
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

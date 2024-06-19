import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: true
  });

  try {
    let redirectURL = apiUrl;
    const visited = new Set();  // 방문한 URL 추적

    do {
      console.log('Requesting:', redirectURL);
      let response = await axios.get(redirectURL, {
        httpsAgent: agent,
        maxRedirects: 0  // 리디렉션 비활성화
      });

      if (response.status === 302) {
        redirectURL = response.headers.location;
        if (visited.has(redirectURL)) {
          throw new Error('Detected redirect loop');
        }
        visited.add(redirectURL);
      } else {
        if (response.status !== 200) {
          throw new Error(`API responded with status ${response.status}`);
        }
        return res.status(200).json(response.data);
      }
    } while (true);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

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
      maxRedirects: 0 // 리디렉션 자동 처리 비활성화
    });

    // 리디렉션 수동 처리
    const visitedUrls = new Set(); // 방문한 URL 기록
    while (response.status === 302 && response.headers.location) {
      if (visitedUrls.has(response.headers.location)) {
        throw new Error('Detected redirect loop'); // 무한 리디렉션 방지
      }
      visitedUrls.add(response.headers.location);

      response = await axios.get(response.headers.location, {
        httpsAgent: agent,
        maxRedirects: 0
      });
    }

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
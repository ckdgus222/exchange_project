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

    // 리디렉션 수동 처리 로직
    if (response.status === 302) {
      let redirectURL = response.headers.location;
      const visited = new Set();  // 방문한 URL 추적

      while (redirectURL && !visited.has(redirectURL)) {
        visited.add(redirectURL);
        console.log('Redirect location:', redirectURL);

        response = await axios.get(redirectURL, { httpsAgent: agent, maxRedirects: 0 });
        redirectURL = response.status === 302 ? response.headers.location : null;
      }

      if (visited.has(redirectURL)) {
        throw new Error('Detected redirect loop');  // 리디렉션 루프 감지
      }
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
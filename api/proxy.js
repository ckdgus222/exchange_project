import express from 'express';
import axios from 'axios';
import https from 'https';

const app = express();

// HTTPS 에이전트 생성
const httpsAgent = new https.Agent({
  rejectUnauthorized: false  // SSL 인증서 검증 비활성화 (운영 환경에서는 적절한 인증서를 사용하시기 바랍니다)
});

app.get('/api/proxy', async (req, res) => {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    let response = await axios.get(apiUrl, { httpsAgent });
    let redirectCount = 0; // 리디렉션 카운트를 추적합니다.

    while (response.status === 302 && response.headers.location && redirectCount < 5) { // 최대 리디렉션 횟수를 5로 제한
      const location = response.headers.location;
      if (location === apiUrl || redirectCount >= 5) { // 같은 URL로의 리디렉션 또는 최대 리디렉션 횟수 초과시 오류 처리
        throw new Error('Too many redirects or redirect loop detected');
      }
      console.log('Redirecting to:', location);
      response = await axios.get(location, { httpsAgent, maxRedirects: 0 });
      redirectCount++; // 리디렉션 횟수 증가
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling external API:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

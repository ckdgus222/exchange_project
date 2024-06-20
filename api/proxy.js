import express from 'express';
import axios from 'axios';
import https from 'https';

const app = express();

// HTTPS 에이전트 생성
const httpsAgent = new https.Agent({
  rejectUnauthorized: false  // SSL 인증서 검증 비활성화
});

app.get('/api/proxy', async (req, res) => {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const response = await axios.get(apiUrl, { httpsAgent });
    if (response.status === 302) { // 리디렉션 처리
      const location = response.headers.location;
      return res.redirect(location);  // 클라이언트에 리디렉션을 전달
    }
    res.json(response.data);  // 데이터 응답
  } catch (error) {
    console.error('Error calling external API:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

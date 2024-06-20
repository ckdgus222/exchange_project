import express from 'express';
import axios from 'axios';
import https from 'https';

const app = express();

// HTTPS 에이전트 생성
const httpsAgent = new https.Agent({
  rejectUnauthorized: false 
});

app.get('/api/proxy', async (req, res) => {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    let response = await axios.get(apiUrl, { httpsAgent });

    // 리디렉션 수동 처리 로직 
    while (response.status === 302 && response.headers.location) {
      const location = response.headers.location;
      if (location === apiUrl) break;  // 무한 리디렉션 방지
      console.log('Redirecting to:', location);
      response = await axios.get(location, { httpsAgent, maxRedirects: 0 });
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling external API:', error);
    if (error.response) {
      // API 에러 응답 처리
      console.error('Error response:', error.response.data);
      res.status(error.response.status).json({ message: 'Error from external API', error: error.response.data });
    } else if (error.request) {
      // 요청이 서버에 도달했으나 응답을 받지 못함
      console.error('Error request:', error.request);
      res.status(500).json({ message: 'No response from external API', error: 'No response received' });
    } else {
      // 요청 설정 중 발생한 에러
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Error setting up request to external API', error: error.message });
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

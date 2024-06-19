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
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0  // 리디렉션을 수동으로 처리하기 위해 리디렉션을 허용하지 않음
    });

    // 리디렉션 응답 처리
    if (response.status === 302) {
      const location = response.headers['location'];
      console.log('Redirecting to:', location);
      response = await axios.get(location, {
        httpsAgent: agent
      });
    }

    if (!response.data) {
      throw new Error('No data returned from API');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      message: 'Unable to fetch data',
      error: error.message
    });
  }
}

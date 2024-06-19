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
    // 리디렉션 자동 처리 활성화
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 5  // 리디렉션 최대 횟수 설정
    });

    // 최종 응답 검사
    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    // 데이터 반환
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}

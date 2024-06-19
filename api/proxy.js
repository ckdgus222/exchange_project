import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    console.error('Missing required query parameters:', req.query);
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  const agent = new https.Agent({
    rejectUnauthorized: false  // 실제 프로덕션 환경에서는 보안을 위해 이 설정을 사용하지 마세요
  });

  try {
    const response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 1  // 리디렉션 최대 횟수 설정
    });

    // 리디렉션 상태 코드 처리
    if (response.status >= 300 && response.status < 400) {
      console.log('Redirect status encountered:', response.status);
      return res.redirect(response.headers.location);
    }

    if (!response.data) {
      throw new Error('No data returned from the API');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      // API에서 제공하는 응답 에러를 클라이언트에 전달
      res.status(error.response.status).json({ message: 'Error from API', details: error.response.data });
    } else {
      // 네트워크 에러 또는 기타 예외 처리
      res.status(500).json({ message: 'Unable to fetch data', error: error.message });
    }
  }
}


import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    console.error('Missing required query parameters.');
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false // 보안 리스크가 있으니, 실제 운영 환경에서는 신중하게 사용
  });

  try {
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0 // 리디렉션 비활성화
    });

    if (response.status === 302) {
      let redirectURL = response.headers.location;
      if (redirectURL === apiUrl) {
        console.error('Detected self redirect loop');
        throw new Error('Detected self redirect loop');
      }
      console.log('Redirecting to:', redirectURL);
      response = await axios.get(redirectURL, { httpsAgent: agent, maxRedirects: 0 });
    }

    if (response.status !== 200) {
      console.error(`API responded with status ${response.status}`);
      throw new Error(`API responded with status ${response.status}`);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

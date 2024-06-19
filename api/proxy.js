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
    rejectUnauthorized: false
  });

  try {
    const response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 0  // 리디렉션을 전혀 허용하지 않음
    });

    if (response.status === 302 || response.status === 301) {
      // 리디렉션 시도가 있을 경우
      console.log(`Attempted to redirect to: ${response.headers.location}`);
      res.status(200).json({ message: 'Redirect attempt', location: response.headers.location });
    } else if (!response.data) {
      throw new Error('No data returned from the API');
    } else {
      res.status(200).json(response.data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

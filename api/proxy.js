import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  const agent = new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_2_method'
  });

  try {
    const apiResponse = await fetch(apiUrl, { agent });
    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}


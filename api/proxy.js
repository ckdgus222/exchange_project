import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    res.status(500).json({ message: 'Unable to fetch data', error: error.message });
  }
}

import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { authkey, searchdate, data } = req.query;
  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const responseData = await apiResponse.json();

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}
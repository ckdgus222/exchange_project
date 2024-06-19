import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      // 추가적인 에러 정보 로깅
      console.error(`API request failed with status ${apiResponse.status} and statusText ${apiResponse.statusText}`);
      throw new Error(`API responded with status ${apiResponse.status} ${apiResponse.statusText}`);
    }

    const responseData = await apiResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      message: 'Unable to fetch data',
      error: error.message
    });
  }
}

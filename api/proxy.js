// proxy.js
import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  const agent = new https.Agent({
    rejectUnauthorized: false  // SSL 인증서 검증 비활성화
  });

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const fetchOptions = {
    agent,
    redirect: 'manual'  // 리디렉션을 수동으로 처리
  };

  try {
    const apiResponse = await fetch(apiUrl, fetchOptions);
    if (apiResponse.status >= 300 && apiResponse.status < 400) {
      // 리디렉션 처리
      const locationHeader = apiResponse.headers.get('location');
      return res.redirect(locationHeader);
    }

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch data', error: error.toString() });
  }
}

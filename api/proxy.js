import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: true // 배포 환경에서는 이 옵션을 true로 설정하여 보안을 강화
});

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const response = await axios.get(apiUrl, { httpsAgent: agent });
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      console.error("Non-200 response: ", response.status);
      res.status(response.status).json({ message: "Bad response from API", details: response.data });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(502).json({ message: "Unable to fetch data", error: error.toString() });
  }
}

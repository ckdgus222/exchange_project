import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false // WARNING: This makes your application vulnerable to man-in-the-middle attacks
});

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const response = await axios.get(apiUrl, { httpsAgent: agent });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Unable to fetch data", error: error.message });
  }
}

import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    console.error("Missing required query parameters", { authkey, searchdate, data });
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false, // Note: This should be true in production for security reasons
  });

  try {
    let response = await axios.get(apiUrl, {
      httpsAgent: agent,
      maxRedirects: 5
    });

    if (response.status !== 200) {
      console.error("API response error", {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error, { apiUrl });
    res.status(500).json({ message: "Unable to fetch data", error: error.message });
  }
}


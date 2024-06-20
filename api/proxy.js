import fetch from 'node-fetch'; 
import https from 'https';

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  const agent = new https.Agent({
    rejectUnauthorized: false, 
  });

  try {
    let response = await fetch(apiUrl, {
      agent: (parsedURL) => parsedURL.protocol === "https:" ? agent : null
    });

    let location = response.headers.get('location');

 
    const visitedUrls = new Set([apiUrl]); 
    while (response.status === 302 && location) {
      if (visitedUrls.has(location)) {
        throw new Error("Detected redirect loop");
      }
      visitedUrls.add(location);

      response = await fetch(location, {
        agent: (parsedURL) => parsedURL.protocol === "https:" ? agent : null
      });
      location = response.headers.get('location');
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json(); 
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Unable to fetch data", error: error.toString() });
  }
}

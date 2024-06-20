import axios from "axios";
import https from "https";
import { URL } from 'url'; 


const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // 
  }),
  maxRedirects: 0 
});

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  try {
    let response = await axiosInstance.get(apiUrl);
    const visitedUrls = new Set([apiUrl]); 


    while (response.status === 302 && response.headers.location) {
      const location = new URL(response.headers.location, apiUrl).href; 

      if (visitedUrls.has(location)) {
        throw new Error("Detected redirect loop"); 
      }

      visitedUrls.add(location);
      response = await axiosInstance.get(location);
    }

    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response) {
      res.status(error.response.status).json({ message: "Error from external API", details: error.response.data });
    } else {
      res.status(500).json({ message: "Unable to fetch data", error: error.message });
    }
  }
}


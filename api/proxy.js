import axios from "axios";
import https from "https";
import { URL } from 'url';  

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false  
  }),
  maxRedirects: 0  
});

export default async function handler(req, res) {
  const { authkey, searchdate, data } = req.query;

  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  const baseUrl = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';
  const apiUrl = `${baseUrl}?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;
  
  try {
    let response = await axiosInstance.get(apiUrl);
    let location = response.headers.location;
    
   
    while (response.status === 302 && location) {
      const nextUrl = new URL(location, baseUrl).href; 
      console.log(`Redirecting to: ${nextUrl}`); 
      
      if (location === nextUrl) {
        throw new Error('Infinite redirect detected.');
      }
      
      location = nextUrl;
      response = await axiosInstance.get(nextUrl);
    }
    
    if (response.status !== 200) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: "Unable to fetch data", error: error.toString() });
  }
}


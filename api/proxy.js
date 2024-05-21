import fetch from "node-fetch";

export default async function handler(req, res) {
  const now = new Date("2024-05-03");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const API_KEY = import.meta.env.VITE_API_KEY; // 환경 변수에서 API 키 가져오기
  const searchDate = `${year}${month}${day}`;
  const dataType = "AP01";
  //const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${searchDate}&data=${dataType}`;

  try {
    const apiResponse = await fetch(import.meta.env.VITE_API_URL);
    const data = await apiResponse.json();

    console.log("API Response Data:", data);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch data", error: error.toString() });
  }

}

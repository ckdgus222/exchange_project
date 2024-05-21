// /api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    // 외부 API 엔드포인트 URL 구성
        const now = new Date('2024-05-03');
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        
    const API_KEY = import.meta.env.VITE_API_KEY;
    const searchDate = String(`${year}${month}${day}`);
    const dataType = String("AP01");
    const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${searchDate}&data=${dataType}`;

    try {
        // 외부 API 호출
        const apiResponse = await fetch(apiUrl, {
            headers: {
                // 필요한 경우 추가 헤더를 여기에 삽입
            }
        });
        const data = await apiResponse.json();

        // CORS 헤더 설정
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // 성공 응답
        res.status(200).json(data);
    } catch (error) {
        // 오류 처리
        res.status(500).json({ message: "Unable to fetch data", error: error.toString() });
    }
}
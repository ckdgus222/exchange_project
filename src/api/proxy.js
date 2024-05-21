import fetch from "node-fetch"; // node-fetch 라이브러리를 사용
import { exchangeAPI } from "../util/exchangeAPI";

const URL = exchangeAPI()

export default async function handler(req, res) {
    
    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?${URL}`;

    try {
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch data", error: error.toString() });
    }
}
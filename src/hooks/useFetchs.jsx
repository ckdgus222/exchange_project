import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        console.log("Fetched Data:", response.data);  // 응답 데이터 로그 출력

        let responseData = response.data;

        // 응답 데이터가 배열이 아닌 경우 배열로 변환
        if (!Array.isArray(responseData)) {
          responseData = Object.values(responseData);
        }

        setData(responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);
  return data;
};

export default useFetch;

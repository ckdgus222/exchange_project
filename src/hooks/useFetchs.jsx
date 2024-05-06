import axios from "axios";
import { useEffect, useState } from "react";

// const exAPI = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=Bjr95JzquH4EmHhc5M9q7jLqK6yxT8HS&searchdate=20240506&data=AP01";
const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
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

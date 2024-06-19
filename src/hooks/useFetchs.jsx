import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("API Error: ", error.response || error.message);
      }
    };
    if (url) {
      fetchData();
    }
  }, [url]);

  return data;
};

export default useFetch;

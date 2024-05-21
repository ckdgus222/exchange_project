import axios from "axios";
import { useEffect, useState } from "react";

const vercel = "https://travel-exchange-fc97y9irc-cchs-projects-be903c00.vercel.app/"

const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${vercel}${url}`);
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

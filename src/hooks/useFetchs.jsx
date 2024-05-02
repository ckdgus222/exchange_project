import axios from "axios";
import { useEffect, useState } from "react";

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");


const API_KEY = String("Bjr95JzquH4EmHhc5M9q7jLqK6yxT8HS");
const API_SEARCHDATE = `${year}${month}${day}`;
const dataType = String("AP01");

const DATA_API = `/api?authkey=${API_KEY}&searchdate=${API_SEARCHDATE}&data=${dataType}`;


const useFetch = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_API);
        setData(response.data);
        
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);
  return data;
};

export default useFetch;

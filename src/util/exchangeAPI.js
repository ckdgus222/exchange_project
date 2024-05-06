import { config } from "./apikey.js";
export const exchangeAPI = () => {
  const now = new Date('2024-05-03');
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const API_KEY = String(config.EXCHANGE_KEY);
  const API_SEARCHDATE = `${year}${month}${day}`;
  const dataType = String("AP01");

  const DATA_API = `/api?authkey=${API_KEY}&searchdate=${API_SEARCHDATE}&data=${dataType}`;

  return DATA_API;
};


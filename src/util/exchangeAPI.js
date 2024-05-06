export const exchangeAPI = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const API_KEY = String("Bjr95JzquH4EmHhc5M9q7jLqK6yxT8HS");
  const API_SEARCHDATE = `${year}${month}${day}`;
  const dataType = String("AP01");

  const DATA_API = `/api?authkey=${API_KEY}&searchdate=${API_SEARCHDATE}&data=${dataType}`;

  return DATA_API;
};
console.log(exchangeAPI());

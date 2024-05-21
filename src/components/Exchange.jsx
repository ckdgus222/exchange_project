import "./Exchange.css";
import Button from "./Button";
import Travel from "./Travel";
import { moneyText, TimeZones } from "../util/consttent";
import { exchangeAPI } from "../util/exchangeAPI";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetchs";


const data_API = exchangeAPI();




const Exchange = ({ changeState }) => {
  const { change, setChange, selectedCurrency, setSelectedCurrency } = changeState;
  const [wonText, setWonText] = useState(moneyText);
  const [krwAmount, setKrwAmount] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const data = useFetch("");

  useEffect(() => {
    const timer = setInterval(() => {
      const timeZone = TimeZones[selectedCurrency];
      const time = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timeZone,
        hour12: false,
      }).format(new Date());
      setCurrentTime(time);
    }, 1000);
    return () => clearInterval(timer.toLocaleString());
  }, [selectedCurrency]);
  


  const getRate = () => {
    if (data) {
      const currency = data.find((won) => won.cur_unit === selectedCurrency);
      if (currency) {
        const rateString = currency.deal_bas_r.replace(/,/g, "");
        const rate = Number(rateString);
        return isNaN(rate) ? 0 : rate;
      }
      return 0;
    }
  };

  const covertAmount = () => {
    const rate = getRate();
    const converted = krwAmount > 0 && rate ? krwAmount / rate : 0;
    return converted.toFixed(2);
  };

  const list = (key) => {
    let values = wonText[key];
    return values;
  };

  const localMoney = (e) => {
    let value = e.target.value;

    value = value.replaceAll(",", "");
    const numValue = Number(value);
    setKrwAmount(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="exchange">
      <p className="main_P">어디로 여행 가실건가요?</p>
      <div className="content-box">
        <div className="money-change">
          <p>나라 선택</p>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
            <option value="JPY(100)">일본(JPY)</option>
            <option value="GBP">영국(GBP)</option>
            <option value="THB">태국(THB)</option>
            <option value="USD">미국(USD)</option>
            <option value="CNH">중국(CNH)</option>
          </select>
        </div>
        <div>
          <p>현재 시간: {currentTime}</p>
        </div>
        <div className="Exchange-Rate">
          <p>환율</p>
          <p>{data && getRate()}</p>
        </div>
        <div className="money-conversion">
          <p>금액 (KRW)</p>
          <input type="text" value={krwAmount.toLocaleString("ko-KR")} onChange={localMoney} />
        </div>
        <div className="amount-received">
          <p>
            수취 금액은 {covertAmount()} {list(selectedCurrency)}입니다
          </p>
          <Button onClick={() => setChange(!change)} className="button-style" text="여행지 추천" />
        </div>
      </div>
      {change ? null : <Travel />}
    </div>
  );
};

export default Exchange;

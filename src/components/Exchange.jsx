import "./Exchange.css";

const Exchange = ({ changeState }) => {
  const { change, setChange } = changeState;
  

  return (
    <div className="exchange">
      <p>어디로 여행 가실건가요?</p>
      <div className="content-box">
        <div className="money-change">
          <p>나라 선택</p>
          <select name="">
            <option value="">일본(JPY)</option>
            <option value="">영국(GBP)</option>
            <option value="">베트남(VND)</option>
            <option value="">미국(USD)</option>
            <option value="">중국(CNY)</option>
          </select>
        </div>
        <div className="Exchange-Rate">
          <p>환율</p>
          <p>1000원</p>
        </div>
        <div className="money-conversion">
          <p>금액</p>
          <input type="number" placeholder="금액을 입력해 주세요" />
        </div>
        <div className="amount-received">
          <p>수취 금액은 20000원</p>
          <button onClick={() => setChange(!change)} className="button-style">
            여행지 추천
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exchange;

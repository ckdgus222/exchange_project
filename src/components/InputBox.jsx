import { useState } from "react";
import "./InputBox.css";

const InputBox = ({ conversation, userData }) => {
  const [userReview, setUserReview] = useState("");

  const userChange = (e) => {
    setUserReview(e.target.value);
  };

  const userdChange = (e) => {
   e.preventDefault();
   if (e.key === "Enter") {
      if(!userReview.trim()) return;

    let copy = [...conversation, userReview];
    userData(copy);
    setUserReview("")
    }
    
  };
  const handleInput = (e , maxlength)=>{
    if(e.value.length > maxlength){
      e.value = e.value.substr(10,maxlength)
    }
  }

  return (
    <div className="input_box">
      <input
        value={userReview}
        onInput={()=>handleInput(this, 10)}
        onChange={userChange}
        onKeyUp={userdChange}
        placeholder="좋은 추억을 남겨주세요"
        type="text"
      />
    </div>
  );
};

export default InputBox;

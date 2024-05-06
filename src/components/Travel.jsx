import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Hashtag from "./Hashtag.jsx";
import Button from "./Button";
import Comment from "./Comment.jsx";
import InputBox from "./InputBox.jsx";
import { images } from "./../util/consttent.js";
import { hashtag } from "./../util/hashtag.js";

import "./Travel.css";

const conversation = ["너무 즐거운 여행 이였어요!", "꼭 추천 합니다", "가족들과 즐거운 여행", "행복한 추억 만드세요!", "꼭 가야 하는 여행지~"];

const Travel = ({ changeState, getSelect }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [imgFade, setImgFade] = useState(true);
  const [userData, setUserData] = useState(conversation);
  const [hash, setHash] = useState(hashtag);
  const currentImages = images[getSelect];

  const nextSlide = () => {
    setImgIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setImgIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const nextImg = setInterval(() => {
      setImgIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(nextImg);
  }, [getSelect, currentImages.length]);
  
  return (
    <CSSTransition in={!changeState} timeout={1500} classNames={"Travel"} unmountOnExit>
      <div className="Travel">
        <div className="img_section">
          <Button className="left_button" onClick={prevSlide} text="<" />
          <div className={`img_slide`} style={{ transform: `translateX(${-imgIndex * 100}%)` }}>
            {currentImages.map((src, index) => (
              <img key={index} src={src} alt={`Image ${index}`} />
            ))}
          </div>
          <Button className="right_button" onClick={nextSlide} text=">" />
          <div className="hashtag">
            {hash[getSelect].map((item, i) => (
              <Hashtag key={i} text={item} />
            ))}
          </div>
        </div>
        <div className="content_section">
          <h3>좋은 기억들을 남겨주세요</h3>
          <div className="content_list">
            {userData.map((item, index) => (
              <Comment key={index} text={item} />
            ))}
          </div>
          <InputBox conversation={userData} userData={setUserData} />
        </div>
      </div>
    </CSSTransition>
  );
};

export default Travel;

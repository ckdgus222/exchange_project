import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Button from "./Button";
import Comment from "./Comment.jsx";
import { images } from "./../util/consttent.js";
import "./Travel.css";

const mockData = ["안녕하세요", "반가워요", "배고파요", "어려워요", "재밌는 여행이에요!"];

const Travel = ({ changeState, getSelect }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [imgFade, setImgFade] = useState(true);

  const prevSlide = () => {
    setImgIndex((prev) => (prev === 0 ? images[getSelect].length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setImgIndex((prev) => (prev === images[getSelect].length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const nextImg = setInterval(() => {
      setImgIndex((prev) => (prev === images[getSelect].length - 1 ? 0 : prev + 1));
      setImgFade(!false);
    }, 2000);

    return () => clearInterval(nextImg);
  }, [getSelect]);

  return (
    <CSSTransition in={!changeState} timeout={1500} classNames={"Travel"} unmountOnExit>
      <div className="Travel">
        <div className="img_section">
          <Button className="left_button" onClick={prevSlide} text="<" />
          <div className={`img_slide ${imgFade ? "out" : "fade"}`}>
            <img src={images[getSelect][imgIndex]} />
          </div>
          <Button className="right_button" onClick={nextSlide} text=">" />
        </div>
        <div className="content_section">
          <h3>좋은 기억들을 남겨주세요</h3>
          <div className="content_list">
            <ul>
              {mockData.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Comment/>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Travel;

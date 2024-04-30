import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./Travel.css";

const mockData = ["안녕하세요", "반가워요", "배고파요", "어려워요", "재밌는 여행이에요!"];

const Travel = ({ changeState }) => {
  const images = ["/boat-5962076_1920.jpg"];

  return (
    <CSSTransition in={!changeState} timeout={1500} classNames={"Travel"} unmountOnExit>
      <div className="Travel">
        <div className="img_section">
          <img src={images[0]} />
        </div>
        <div className="content_section">
          <p>좋은 기억들을 남겨주세요</p>
          <div>
            <ul>
              {mockData.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Travel;

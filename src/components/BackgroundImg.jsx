import { useEffect, useMemo, useState } from "react";
import "./BackgroundImg.css";
import background1 from "./../assets/background1.png";
import background2 from "./../assets/background2.png";
import background3 from "./../assets/background3.png";
import background4 from "./../assets/background4.png";
import background5 from "./../assets/background5.png";







const BackgroundImg = () => {
  const images = useMemo(() => [background1, background2, background3, background4, background5], []);

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [prevImg, setPrevImg] = useState(0);
  const [imgState, setImgState] = useState(true);

  useEffect(() => {
    const imgRandom = setInterval(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * images.length);
      } while (randomIndex === prevImg);

      setPrevImg(randomIndex);
      setImgState(false);

      setTimeout(() => {
        setCurrentImage(images[randomIndex]);
        setImgState(true);
      }, 1000);
    }, 4000);

    return () => clearInterval(imgRandom);
  }, [images, prevImg]);

  return (
    <div className="background-container">
      <div className={`background ${imgState ? "fade-in" : "fade-out"}`} style={{ backgroundImage: `url(${currentImage})` }} />
    </div>
  );
};

export default BackgroundImg;

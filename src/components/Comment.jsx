import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import "./Comment.css";
import { useState } from "react";


const Comment = ({ text }) => {
  const [active, setActive] = useState(false);
  const [like ,setLike] = useState(0)

  const toggleHeart = () => {
    setActive(!active);
  };

  const heartStyle = {
    cursor: "pointer",
    color: active ? "red" : null,
  };

  return (
    <div className="comment_container">
      <div className="comment_one">
        {text}
       <p onClick={()=>setLike(like + 1)}>좋아요: {like}</p>
      </div>
      <span className="font_section">
        <FontAwesomeIcon style={heartStyle} onClick={toggleHeart} icon={active ? faSolidHeart : faRegularHeart} />
      </span>
      
    </div>
  );
};

export default Comment;

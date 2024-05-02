import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Comment = ({ text }) => {
  return (
    <div className="comment_container">
      <div className="comment_one">맛있어요fefsefsefsefsfsef!</div>
      <span>
        <FontAwesomeIcon icon={faHeart} />
      </span>
    </div>
  );
};

export default Comment;

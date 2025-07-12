import React from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import "./Comment.css";
import { likeComment } from "../../Features/CommentSlice";
import { useDispatch, useSelector } from "react-redux";

function Comment({ singleComment, singleCommentStatus }) {
  const { userDetails } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (singleCommentStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  const handleLikeComment = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    formData.append("comment_id", singleComment?.id);
    formData.append("post_owner", singleComment.user_id);
    dispatch(likeComment({ comment_id: singleComment?.id, formData }));
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${singleComment?.user_id}`);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="post">
      <div className="post__avatar">
        <Avatar src={singleComment?.user_image} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3 onClick={handleNavigateToProfile}>
              {singleComment?.username}{" "}
              <span className="post__headerSpecial">
                @{singleComment?.username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{singleComment?.content}</p>
          </div>
        </div>
        {singleComment?.images && (
          <img src={singleComment.images} alt="comment visual" />
        )}
        <div className="post__footer">
          <StatusIcons
            location={"post"}
            to={`/replies/${singleComment?.id}`}
            icon={<ChatBubbleOutlineIcon fontSize="small" />}
            count={singleComment?.replies}
          />
          {/* <StatusIcons icon={<RepeatIcon fontSize="small" />} count={10} /> */}
          <StatusIcons
            location={"post"}
            icon={<FavoriteBorderIcon fontSize="small" />}
            count={singleComment?.likes}
            action={handleLikeComment}
          />
          {/* <StatusIcons
            icon={<BookmarkBorderIcon fontSize="small" />}
            count={savedCount}
          /> */}
        </div>
      </div>
    </Box>
  );
}

export default Comment;

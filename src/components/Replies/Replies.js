import React, { useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { likeComment } from "../../Features/CommentSlice";
import { useDispatch } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Replies({ reply, user_id }) {
  const dispatch = useDispatch();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const navigate = useNavigate();

  const handleLikeComment = () => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("comment_id", reply?.id);
    formData.append("post_owner", reply.user_id);
    dispatch(likeComment({ comment_id: reply?.id, formData }));
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${reply?.user_id}`);
  };

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      id={`post-${reply?.id}`}
      className="post"
    >
      <Box
        sx={{ background: systemPrefersDark && "background.paper" }}
        className="post__avatar"
      >
        <Avatar src={reply?.user_image} />
      </Box>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3 onClick={handleNavigateToProfile}>
              {reply?.username}{" "}
              <span className="post__headerSpecial">@{reply?.username}</span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{reply?.content}</p>
          </div>
        </div>
        {reply?.images && <img src={reply?.images} alt="Post visual" />}
        <div className="post__footer">
          <StatusIcons
            location={"post"}
            to={`/replies/${reply?.id}`}
            icon={<ChatBubbleOutlineIcon fontSize="small" />}
            count={reply?.comments || reply?.replies}
          />
          {/* <StatusIcons icon={<RepeatIcon fontSize="small" />} count={10} /> */}

          <StatusIcons
            location={"post"}
            icon={<FavoriteBorderIcon fontSize="small" />}
            count={reply?.likes}
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

export default Replies;

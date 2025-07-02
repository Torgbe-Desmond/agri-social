import React, { useEffect, useRef } from "react";
import "./Saved.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { useDispatch, useSelector } from "react-redux";
import {
  likePost,
  savePost,
  unSavePost,
} from "../../Features/PostSlice";

import DeleteIcon from "@mui/icons-material/Delete";

function Saved({ save }) {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(likePost({ post_id: save?.post_id, formData }));
  };

  const handleSavePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(savePost({ post_id: save?.post_id, formData }));
  };

  const handleUnsaved = () => {
    dispatch(unSavePost({ user_id: userDetails?.id, post_id: save?.post_id }));
  };

  
  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={save?.user_image} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {save?.username}{" "}
              <span className="post__headerSpecial">@{save?.username}</span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{save?.content}</p>
          </div>
        </div>
        {save?.images && <img src={save?.images} alt="Post visual" />}
        <div className="post__footer">
          <StatusIcons
            to={`/post/${save?.post_id}`}
            icon={<ChatBubbleOutlineIcon fontSize="small" />}
            count={save?.comments}
          />
          <StatusIcons icon={<RepeatIcon fontSize="small" />} count={10} />
          <StatusIcons
            icon={<FavoriteBorderIcon fontSize="small" />}
            action={handleLikePost}
            count={save?.likes}
          />
          <StatusIcons
            icon={<BookmarkBorderIcon fontSize="small" />}
            count={save?.saved}
            action={handleSavePost}
          />

          {/* <StatusIcons
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            action={handleUnsaved}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Saved;

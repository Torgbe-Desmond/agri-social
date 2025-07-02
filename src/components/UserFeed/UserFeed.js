import React, { useEffect, useRef } from "react";
import "./UserFeed.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getPostHistory,
  getUserPostHistory,
} from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Post from "../Post/Post";

function UserFeed({ user_id }) {

  const dispatch = useDispatch();
  const postRef = useRef();
  const { userPostHistory, postDeleteStatus, userPostHistoryStatus } =
    useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getUserPostHistory({ user_id }));
  }, [dispatch, user_id]);

  if (userPostHistoryStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <>
      {userPostHistory?.length === 0 ? (
        <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
      ) : (
        userPostHistory.map((post) => (
          <Post key={post.id || post._id} post={post} />
        ))
      )}
    </>
  );
}

export default UserFeed;

import React, { useEffect } from "react";
import "./StatusIcons.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function StatusIcons({ icon, count, to, action, location, status, post_id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action(); // ✅ Correct: Call the passed-in action function
    }
  };

  useEffect(() => {
    // const postEl = document.querySelector(`#post-${post_id}`);
    // // console.log("postEl", postEl);

    // if (!post_id || !postEl) return;

    // const hasImage = postEl.querySelector(".post__images .post_media img");

    // const hasVideo = postEl.querySelector(`#post-${post_id} video`);

    // postEl.classList.add("visible-post-next");

    // if (hasImage) {
    //   console.log("has image");
    //   hasImage.style.display = "flex";
    // }
  }, [status]);

  const listOfStyles = {
    post: "status-icon",
    video: "video-action-style",
  };

  return (
    <div className={`${listOfStyles[location]}`}>
      {status === "loading" && post_id ? (
        <CircularProgress fontSize="small" color="inherit" />
      ) : (
        <>
          <div className="status-btn" onClick={handleClick}>
            {icon}
          </div>
          <div>{count}</div>
        </>
      )}
    </div>
  );
}

export default StatusIcons;

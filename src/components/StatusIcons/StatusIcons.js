import React from "react";
import "./StatusIcons.css";
import { useNavigate } from "react-router-dom";

function StatusIcons({ icon, count, to, action, location }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action(); // ✅ Correct: Call the passed-in action function
    }
  };

  const listOfStyles = {
    post: "status-icon",
    video: "video-action-style",
  };
  
  return (
    <div className={`${listOfStyles[location]}`}>
      <div onClick={handleClick}>{icon}</div>
      <div>{count}</div>
    </div>
  );
}

export default StatusIcons;

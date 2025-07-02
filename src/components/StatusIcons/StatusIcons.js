import React from "react";
import "./StatusIcons.css";
import { useNavigate } from "react-router-dom";

function StatusIcons({ icon, count, to, action }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action(); // ✅ Correct: Call the passed-in action function
    }
  };

  return (
    <div className="status-icon">
      <div onClick={handleClick}>{icon}</div>
      <div>{count}</div>
    </div>
  );
}

export default StatusIcons;

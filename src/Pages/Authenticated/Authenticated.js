import React from "react";
import { Navigate } from "react-router-dom";

function Authenticated({ isAuthenticated }) {
  const reference_id = localStorage.getItem("reference_id");
  let component;
  if (!isAuthenticated) {
    component = <Navigate to="/" replace />;
  } else {
    component = <Navigate to={`/${reference_id}`} />;
  }

  return component;
}

export default Authenticated;

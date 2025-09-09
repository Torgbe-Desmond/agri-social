import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, Snackbar, Alert } from "@mui/material";

import "./App.css";
import { clearOnLineStatus } from "./Features/StackSlice";
import { useError } from "./components/Errors/Errors";
import { _componentMap } from "./components/HandleStack/ComponentMap";
import { useAuthenticatedQuery } from "./Features/userApi";
import Validated from "./components/Validated/Validated";

function App() {
  const { message, setMessage } = useError();
  const [errorMessage, setErrorMessage] = useState(null);
  const { components } = useSelector((state) => state.stack);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setMessage(null);
    dispatch(clearOnLineStatus());
    setErrorMessage(null);
  };

  return (
    <div className="app">
      <Router>
        {/* Authenticated layout */}
        <Validated />

        <div className="component">
          {components.map((item) => (
            <div key={item.id}>{_componentMap[item?.id]?.(item?.props)}</div>
          ))}
        </div>
      </Router>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;

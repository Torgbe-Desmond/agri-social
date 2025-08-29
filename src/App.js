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
  const [isAuthenticated, setIsAuthenticated] = useState();
  const { message, setMessage } = useError();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:640px)");
  const { components } = useSelector((state) => state.stack);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  // Query user authentication with RTK Query
  const { data, error } = useAuthenticatedQuery(undefined, {
    skip: isAuthenticated,
  });

  useEffect(() => {
    if (error?.status === 401) {
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    } else if (data?.status) {
      setIsAuthenticated(data?.status);
    }
  }, [error, data]);

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

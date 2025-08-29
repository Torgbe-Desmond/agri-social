import { Button, CircularProgress } from "@mui/material";
import React from "react";
import "./Error.css";

function ErrorInfoAndReload({
  isFetching,
  isLoading,
  isError,
  refetch,
  setFetchError,
}) {
  const handleRefetch = () => {
    setFetchError(false);
    refetch();
  };

  return (
    <div>

      {(isLoading || isFetching) && (
        <p className="circular__progress">
          <CircularProgress size={20} />
        </p>
      )}
      {isError && (
        <p className="reload">
          Something went wrong. <Button onClick={handleRefetch}>Retry</Button>
        </p>
      )}
    </div>
  );
}

export default ErrorInfoAndReload;

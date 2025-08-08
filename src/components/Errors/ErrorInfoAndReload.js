import { Button, CircularProgress } from "@mui/material";
import React from "react";

function ErrorInfoAndReload({ isFetching, isLoading, isError, refetch }) {
  return (
    <div>
      {(isLoading || isFetching) && (
        <p className="circular__progress">
          <CircularProgress size={20} />
        </p>
      )}
      {isError && (
        <p className="circular__progress">
          Something went wrong. <Button onClick={refetch}>Retry</Button>
        </p>
      )}
    </div>
  );
}

export default ErrorInfoAndReload;
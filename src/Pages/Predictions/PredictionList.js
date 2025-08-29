import React from "react";
import { Box } from "@mui/material";
import PredictionCard from "../../components/PredictionCard/PredictionCard";

function PredictionList({ predictionStatus, filteredData, userDetails }) {
  return (
    <Box className="" sx={{ height: "100%", overflowY: "auto" }}>
      <div className="predictions__holder">
        {filteredData?.length > 0 &&
          filteredData.map(
            ({
              created_at,
              user_id,
              generated_name,
              confidence,
              prediction_label,
              image_url,
              id,
            }) => (
              <PredictionCard
                key={id}
                userDetails={userDetails}
                created_at={created_at}
                user_id={user_id}
                generated_name={generated_name}
                confidence={confidence}
                prediction_label={prediction_label}
                image_url={image_url}
                id={id}
              />
            )
          )}
      </div>
    </Box>
  );
}

export default PredictionList;

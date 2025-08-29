import React from "react";
import "./PredictionCard.css";
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import PublishIcon from "@mui/icons-material/Publish";
import { Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import StatusIcons from "../StatusIcons/StatusIcons";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentStack from "../HandleStack/HandleStack";
import { useDispatch } from "react-redux";

const PredictionCard = ({
  created_at,
  user_id,
  generated_name,
  confidence,
  prediction_label,
  image_url,
  userDetails,
  id,
}) => {
  const dispatch = useDispatch();

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePrediction", { predictionId: id });
  };

  return (
    <Box sx={{ border: 1, borderColor: "divider", mb: 1 }} className="card">
      <Box className="card__image">
        <img src={image_url} alt="Prediction" />
      </Box>
      <div className="card__right">
        <div>
          <div className="card__header">
            <Avatar src={userDetails?.user_image} />
            <div className="card__user">
              <span>@{userDetails?.username}</span>
            </div>
          </div>

          <div className="card__text">
            <p>
              Prediction: <strong>{prediction_label}</strong> <br />
              Confidence: <strong> {(confidence * 100).toFixed(2)}%</strong>
            </p>
          </div>

          <div className="card__time">
            <small>{new Date(created_at).toLocaleString()}</small>
          </div>
        </div>

        <div className="card__actions">
          {/* <StatusIcons icon={<RepeatIcon fontSize="small" />} /> */}
          <StatusIcons
            icon={<DeleteIcon fontSize="small" />}
            action={handlePostDelete}
          />
        </div>
      </div>
    </Box>
  );
};

export default PredictionCard;

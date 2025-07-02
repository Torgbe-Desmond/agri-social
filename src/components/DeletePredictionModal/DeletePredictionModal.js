import React, { useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPrediction,
  deletePrediction,
  setPredictionToIdle,
} from "../../Features/PredictionSlice";
import { popComponent } from "../../Features/StackSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const DeletePredictionModal = ({ predictionId }) => {
  const { deletePredictionStatus } = useSelector((state) => state.prediction);
  const dispatch = useDispatch();

  const handlePredictionDelete = () => {
    if (predictionId) {
      dispatch(deletePrediction({ prediction_id: predictionId }));
    }
  };

  useEffect(() => {
    if (deletePredictionStatus === "succeeded") {
      dispatch(popComponent());
    }
  }, [deletePredictionStatus, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setPredictionToIdle());
    };
  }, [dispatch]);

  return (
    <Modal open={true}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Delete
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this Prediction?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px !important",
            }}
            color="secondary"
            disabled={deletePredictionStatus === "loading"}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {deletePredictionStatus === "loading" ? (
            <CircularProgress />
          ) : (
            <Button
              className="sidebar__tweet__contained"
              onClick={handlePredictionDelete}
              variant="outlined"
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default DeletePredictionModal;

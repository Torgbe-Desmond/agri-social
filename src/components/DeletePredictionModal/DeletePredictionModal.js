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
import { removeDeletePrediction } from "../../Features/PredictionSlice";
import { popComponent } from "../../Features/StackSlice";
import { useDeletePredictionMutation } from "../../Features/predictionApi";

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
  const dispatch = useDispatch();
  const [deletePrediction, { isLoading }] = useDeletePredictionMutation();

  const handlePredictionDelete = async () => {
    const payload = await deletePrediction({
      prediction_id: predictionId,
    }).unwrap();
    dispatch(removeDeletePrediction({ payload }));
    dispatch(popComponent());
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(popComponent());
    }
  }, [isLoading, dispatch]);

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
            disabled={isLoading}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {isLoading ? (
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

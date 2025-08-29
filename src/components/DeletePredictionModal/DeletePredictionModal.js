import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { removeDeletePrediction } from "../../Features/PredictionSlice";
import { popComponent } from "../../Features/StackSlice";
import { useDeletePredictionMutation } from "../../Features/predictionApi";
import { useTheme } from "@mui/material/styles";

const DeletePredictionModal = ({ predictionId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [deletePrediction, { isLoading, error }] =
    useDeletePredictionMutation();

  console.log("error", error);

  const handlePredictionDelete = async () => {
    const payload = await deletePrediction({
      prediction_id: predictionId,
    }).unwrap();
    dispatch(removeDeletePrediction({ payload }));
    dispatch(popComponent());
  };

  return (
    <Modal open={true} onClose={() => dispatch(popComponent())}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "70%", md: "500px" },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
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
            sx={{ borderRadius: "32px" }}
            color="secondary"
            disabled={isLoading}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handlePredictionDelete} variant="contained">
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default DeletePredictionModal;

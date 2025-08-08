import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PredictionService } from "../Services/PredictionService";

const initialState = {
  prediction: [],
  predictionHistory: [],
};

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    clearPrediction: (state) => {
      state.prediction = [];
    },
    clearImagePrediction: (state) => {
      state.imageInPostPrediction = null;
    },
    clearPredictionStatus: (state) => {
      state.deletePredictionStatus = "idle";
    },
    removeDeletePrediction: (state, action) => {
      const idToDelete = action.payload?.prediction_id;
      if (!idToDelete) return;

      state.prediction = state.prediction?.filter((p) => p.id !== idToDelete);
    },
  },

  extraReducers: (builder) => {},
});

export const {
  clearPrediction,
  clearPredictionStatus,
  clearImagePrediction,
  removeDeletePrediction,
} = predictionSlice.actions;
export default predictionSlice.reducer;

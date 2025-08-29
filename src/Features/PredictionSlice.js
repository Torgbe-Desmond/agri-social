import { createSlice } from "@reduxjs/toolkit";

const mergeUnique = (existing, incoming, key = "id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const initialState = {
  prediction: [],
  predictionHistory: [],
};

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    updatePredictionList: (state, action) => {
      const { predictionData } = action.payload;
      state.prediction = mergeUnique(state.prediction, predictionData, "id");
      console.log(
        "mergeUnique(state.prediction, predictionData)",
        mergeUnique(state.prediction, predictionData, "id")
      );
    },
    updatePredictionHistory: (state, action) => {
      const { predictionHistory } = action.payload;
      state.predictionHistory = mergeUnique(
        state.predictionHistory,
        predictionHistory,
        "id"
      );
    },
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
      const {
        payload: { prediction_id },
      } = action.payload;
      if (!prediction_id) return;

      state.prediction = state.prediction?.filter(
        (p) => p.id !== prediction_id
      );
    },
  },
  extraReducers: (builder) => {},
});

export const {
  updatePredictionList,
  updatePredictionHistory,
  clearPrediction,
  clearPredictionStatus,
  clearImagePrediction,
  removeDeletePrediction,
} = predictionSlice.actions;

export default predictionSlice.reducer;

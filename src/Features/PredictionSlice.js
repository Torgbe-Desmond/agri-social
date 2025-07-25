import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PredictionService } from "../Services/PredictionService";

const initialState = {
  prediction: [],
  imageInPostPrediction: null,
  predictionHistory: [],
  predictionFile: null,
  predictionId: "",
  imageInPostPredictionStatus: "idle",
  getPredictionStatus: "idle",
  predictionStatus: "idle",
  deletePredictionStatus: "idle",
};

export const predictImage = createAsyncThunk(
  "prediction/predictImage",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await PredictionService.predictImage(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const predictImageInPost = createAsyncThunk(
  "prediction/predictImageInPost",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await PredictionService.predictImageInPost(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPredictions = createAsyncThunk(
  "prediction/getPredictions",
  async (_, thunkAPI) => {
    try {
      const response = await PredictionService.getPredictions();
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePrediction = createAsyncThunk(
  "prediction/deletePrediction",
  async ({ prediction_id }, thunkAPI) => {
    try {
      const response = await PredictionService.deletePrediction(prediction_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setPredictionToIdle: (state) => {
      state.predictionStatus = "idle";
      state.deletePredictionStatus = "idle";
    },
    setImageInPostPredictionStatusIdle: (state) => {
      state.imageInPostPredictionStatus = "idle";
    },
    setPredictionId: (state, action) => {
      state.predictionId = action.payload;
    },
    setPredictionDetails: (state, { file }) => {
      if (file) {
        state.predictionFile = file;
      }
    },
    clearPredictionDetails: (state) => {
      state.predictionFile = null;
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(predictImage.pending, (state) => {
        state.predictionStatus = "loading";
      })
      .addCase(predictImage.fulfilled, (state, action) => {
        state.prediction = action.payload;
        state.predictionStatus = "succeeded";
      })
      .addCase(predictImage.rejected, (state, action) => {
        state.predictionStatus = "failed";
      })

      .addCase(predictImageInPost.pending, (state) => {
        state.imageInPostPredictionStatus = "loading";
      })
      .addCase(predictImageInPost.fulfilled, (state, action) => {
        state.imageInPostPrediction = action.payload;
        state.imageInPostPredictionStatus = "succeeded";
      })
      .addCase(predictImageInPost.rejected, (state, action) => {
        state.imageInPostPredictionStatus = "failed";
      })

      .addCase(getPredictions.pending, (state) => {
        state.getPredictionStatus = "loading";
      })
      .addCase(getPredictions.fulfilled, (state, action) => {
        state.prediction = [...action.payload];
        state.getPredictionStatus = "succeeded";
      })
      .addCase(getPredictions.rejected, (state, action) => {
        state.getPredictionStatus = "failed";
      })

      .addCase(deletePrediction.pending, (state) => {
        state.deletePredictionStatus = "loading";
      })
      .addCase(deletePrediction.fulfilled, (state, action) => {
        console.log("Payload received:", action.payload);
        const idToDelete = action.payload?.prediction_id;
        if (!idToDelete) return;

        state.prediction = state.prediction?.filter((p) => p.id !== idToDelete);
        state.deletePredictionStatus = "succeeded";
      })
      .addCase(deletePrediction.rejected, (state, action) => {
        state.deletePredictionStatus = "failed";
      });
  },
});

export const {
  setPredictionDetails,
  clearPredictionDetails,
  setPredictionToIdle,
  setPredictionId,
  clearPrediction,
  clearPredictionStatus,
  clearImagePrediction,
  setImageInPostPredictionStatusIdle,
} = predictionSlice.actions;
export default predictionSlice.reducer;
